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
  inprogressTasks,
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
router.route("/stats").get(verifyRole(["admin"]), taskStats);


// admin accessing user's tasks details completed,pastdue,all-tasks and in-progress
router.route("/user/:userId")
  .post(verifyRole(["admin"]), createTask)
  .get(verifyRole(["admin"]), getUserAssignTasksAdmin);

router.route("/user/:userId/completed").get(verifyRole(["admin"]), completedTasks);
router.route("/user/:userId/in-progress").get(verifyRole(["admin"]), inprogressTasks);
router.route("/user/:userId/today").get(verifyRole(["admin"]), todaysUserTasks);
router.route("/user/:userId/upcoming").get(verifyRole(["admin"]), upcomingUserTasks);
router.route("/user/:userId/past-due").get(verifyRole(["admin"]), pastDueTasks);
/////////////////


router
  .route("/:taskId")
  .patch(verifyRole(["user"]), updateTaskStatus)
  .delete(verifyRole(["admin"]), deleteTask);
router.route("/:taskId/admin").patch(verifyRole(["admin"]), updateTaskDetails);

export default router;
