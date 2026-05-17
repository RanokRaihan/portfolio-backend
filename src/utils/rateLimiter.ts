import { NextFunction, Request, Response } from "express";
import ApiError from "../errors/ApiError";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

export const createRateLimiter = (options: { windowMs: number; max: number }) => {
  const store = new Map<string, RateLimitEntry>();

  return (_req: Request, _res: Response, next: NextFunction) => {
    const ip = _req.ip ?? _req.socket.remoteAddress ?? "unknown";
    const now = Date.now();

    // Lazy cleanup of expired entries
    for (const [key, entry] of store) {
      if (now > entry.resetAt) store.delete(key);
    }

    const entry = store.get(ip);

    if (!entry || now > entry.resetAt) {
      store.set(ip, { count: 1, resetAt: now + options.windowMs });
      return next();
    }

    if (entry.count >= options.max) {
      throw new ApiError(429, "Too many requests, please try again later", "rateLimiter");
    }

    entry.count += 1;
    next();
  };
};
