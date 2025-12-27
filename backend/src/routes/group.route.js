import { Router } from "express";
import { verifyAuthentication } from "../middlewares/auth.middleware.js";
import {
  addUserToGroup,
  createGroup,
  deleteGroup,
  editGroupName,
  getAdminGroups,
  getAllUserFromGroup,
  removeUserFromGroup,
  getAllUsers,
  userTaskStatistic,
  getGroupMemberCompletionStats
} from "../controllers/group.controller.js";
import { verifyRole } from "../middlewares/role.middleware.js";

const router = Router();

router.use(verifyAuthentication);

router
  .route("/")
  .post(verifyRole(["admin"]), createGroup)
  .get(verifyRole(["admin"]), getAdminGroups);
router.route("/all-users").get(verifyRole(["admin"]), getAllUsers);
router
  .route("/:groupId")
  .delete(verifyRole(["admin"]), deleteGroup)
  .patch(verifyRole(["admin"]), editGroupName)
  .get(verifyRole(["admin"]), getAllUserFromGroup);

  router.route("/:groupId/members").get(verifyRole(["admin"]),getGroupMemberCompletionStats);
router
  .route("/:groupId/add/:userId")
  .patch(verifyRole(["admin"]), addUserToGroup);
router
  .route("/:groupId/remove/:userId")
  .patch(verifyRole(["admin"]), removeUserFromGroup);
router
  .route("/user/:userId")
  .get(verifyRole(["admin"]), userTaskStatistic);
export default router;
