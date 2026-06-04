import { Router } from "express";
import { auth } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/authorize.middleware";
import { getStatsController } from "./stats.controller";

const statsRouter = Router();

statsRouter.get("/", auth, authorize(["admin"]), getStatsController);

export default statsRouter;
