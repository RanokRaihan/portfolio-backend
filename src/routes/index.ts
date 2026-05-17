import { Router } from "express";
import authRouter from "../modules/auth/auth.route";
import educationRouter from "../modules/education/education.route";
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
    path: "/project",
    route: projectRouter,
  },
  {
    path: "/skill",
    route: skillRouter,
  },
  {
    path: "/education",
    route: educationRouter,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
