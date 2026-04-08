import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import showsRouter from "./shows";
import photosRouter from "./photos";
import videosRouter from "./videos";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(showsRouter);
router.use(photosRouter);
router.use(videosRouter);

export default router;
