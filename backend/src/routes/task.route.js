import { Router } from "express";
import {
  completedTasks,
  createTask,
  deleteTask,
  getUserAssignTasks,
  getUserAssignTasksAdmin,
  updateTaskDetails,
  updateTaskStatus,
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

router
  .route("/:taskId")
  .patch(verifyRole(["user"]), updateTaskStatus)
  .delete(verifyRole(["admin"]), deleteTask);
router.route("/:taskId/admin").patch(verifyRole(["admin"]), updateTaskDetails);
router.route("/completed").get(verifyRole(["user"]),completedTasks);

export default router;
