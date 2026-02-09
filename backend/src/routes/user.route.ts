import { Router } from "express";
import { verifyAuthentication } from "../middlewares/auth.middleware.js";
import { getUserDetails } from "../controllers/user.controller.js";
import { verifyRole } from "../middlewares/role.middleware.js";
const router = Router();

router.use(verifyAuthentication);

router.route("/:userId").get(verifyRole(["admin"]), getUserDetails);

export default router;
