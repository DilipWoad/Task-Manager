import { Router } from "express";
import {
  createTask,
  getUserAssignTasks,
  getUserAssignTasksAdmin,
} from "../controllers/task.controller.js";
import { verifyAuthentication } from "../middlewares/auth.middleware.js";
import { verifyRole } from "../middlewares/role.middleware.js";

const router = Router();

router.use(verifyAuthentication);

router
  .route("/:userId")
  .post(verifyRole(["admin"]), createTask)
  .get(verifyRole(["admin"]), getUserAssignTasksAdmin);
  
router.route("/").get(verifyRole(["user"]), getUserAssignTasks);

export default router;
