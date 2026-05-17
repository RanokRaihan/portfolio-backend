import { Router } from "express";
import authRouter from "../modules/auth/auth.route";
import certificationRouter from "../modules/certification/certification.route";
import educationRouter from "../modules/education/education.route";
import blogRouter from "../modules/blog/blog.route";
import messageRouter from "../modules/message/message.route";
import testimonialRouter from "../modules/testimonial/testimonial.route";
import projectRouter from "../modules/project/project.route";
import settingRouter from "../modules/setting/setting.route";
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
  {
    path: "/certification",
    route: certificationRouter,
  },
  {
    path: "/setting",
    route: settingRouter,
  },
  {
    path: "/message",
    route: messageRouter,
  },
  {
    path: "/testimonial",
    route: testimonialRouter,
  },
  {
    path: "/blog",
    route: blogRouter,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
