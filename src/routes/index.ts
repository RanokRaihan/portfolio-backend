import { Router } from "express";
import authRouter from "../modules/auth/auth.route";
import blogRouter from "../modules/blog/blog.route";
import dashboardRouter from "../modules/dashboard/dashboard.route";
import projectRouter from "../modules/project/project.route";
import skillRouter from "../modules/skill/skill.route";
import userRouter from "../modules/user/user.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: authRouter,
  },
  {
    path: "/user",
    route: userRouter,
  },
  {
    path: "/skill",
    route: skillRouter,
  },
  {
    path: "/project",
    route: projectRouter,
  },
  {
    path: "/blog",
    route: blogRouter,
  },
  {
    path: "/dashboard",
    route: dashboardRouter,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
