import { Router } from "express";
import { verifyAuthentication } from "../middlewares/auth.middleware.js";
import { createGroup, deleteGroup } from "../controllers/group.controller.js";
import { verifyRole } from "../middlewares/role.middleware.js";

const router = Router();

router.use(verifyAuthentication);

router
  .route("/")
  .post(verifyRole(["admin"]), createGroup)
  .delete(verifyRole(["admin"]), deleteGroup);

export default router;
