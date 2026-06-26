function parseExpiryToMs(expiry: string): number {
  const value = parseInt(expiry.slice(0, -1), 10);
  const unit = expiry.slice(-1);
  switch (unit) {
    case "s":
      return value * 1000;
    case "m":
      return value * 60 * 1000;
    case "h":
      return value * 60 * 60 * 1000;
    case "d":
      return value * 24 * 60 * 60 * 1000;
    default:
      throw new Error(
        `Unrecognized JWT expiry unit: "${unit}" in "${expiry}". Use s, m, h, or d.`,
      );
  }
}
export { parseExpiryToMs };
