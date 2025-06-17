import { Router } from "express";
import { executeCode } from "../controllers/code.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/execute").post(verifyJWT, executeCode);

export default router; 