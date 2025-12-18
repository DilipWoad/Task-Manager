import { Router } from "express";
import {
  completedTasks,
  createTask,
  deleteTask,
  getUserAssignTasks,
  getUserAssignTasksAdmin,
  updateTaskDetails,
  updateTaskStatus,
  todaysUserTasks,
  upcomingUserTasks,
  pastDueTasks,
  taskStats,
} from "../controllers/task.controller.js";
import { verifyAuthentication } from "../middlewares/auth.middleware.js";
import { verifyRole } from "../middlewares/role.middleware.js";

const router = Router();

router.use(verifyAuthentication);

router.route("/").get(verifyRole(["user"]), getUserAssignTasks);
router.route("/completed").get(verifyRole(["user"]), completedTasks);
router.route("/today").get(verifyRole(["user"]), todaysUserTasks);
router.route("/upcoming").get(verifyRole(["user"]), upcomingUserTasks);
router.route("/past-due").get(verifyRole(["user"]), pastDueTasks);
router.route("/stats").get(verifyRole(["admin"]),taskStats)

router
  .route("/user/:userId")
  .post(verifyRole(["admin"]), createTask)
  .get(verifyRole(["admin"]), getUserAssignTasksAdmin);

router
  .route("/:taskId")
  .patch(verifyRole(["user"]), updateTaskStatus)
  .delete(verifyRole(["admin"]), deleteTask);
router.route("/:taskId/admin").patch(verifyRole(["admin"]), updateTaskDetails);

export default router;
