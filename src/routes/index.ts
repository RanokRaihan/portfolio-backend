import { Router } from "express";
import authRouter from "../modules/auth/auth.route";
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
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
