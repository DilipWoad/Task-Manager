import { Router } from "express";
import {
  loginUser,
  logoutUser,
  refreshTokens,
  registerUser,
  userAuthenticated,
} from "../controllers/auth.controller.js";
import { verifyAuthentication } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyAuthentication, logoutUser);
router.route("/refresh-tokens").post(refreshTokens);
router
  .route("/user-authenticated")
  .get(verifyAuthentication, userAuthenticated);

export default router;
