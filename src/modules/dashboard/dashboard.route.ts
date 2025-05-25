import { Router } from "express";
import { auth } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/authorize.middleware";
import { getDashboardInsightController } from "./dashboard.controller";

const dashboardRouter = Router();

dashboardRouter.get(
  "/insight",
  auth,
  authorize(["admin"]),
  getDashboardInsightController
);

export default dashboardRouter;
