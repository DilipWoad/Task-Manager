import { Router } from "express";
import { verifyAuthentication } from "../middlewares/auth.middleware.js";
import {
  addUserToGroup,
  createGroup,
  deleteGroup,
  editGroupName,
  getAdminGroups,
  removeUserFromGroup,
} from "../controllers/group.controller.js";
import { verifyRole } from "../middlewares/role.middleware.js";

const router = Router();

router.use(verifyAuthentication);

router
  .route("/")
  .post(verifyRole(["admin"]), createGroup)
  .get(verifyRole(["admin"]), getAdminGroups);

router
  .route("/:groupId")
  .delete(verifyRole(["admin"]), deleteGroup)
  .patch(verifyRole(["admin"]), editGroupName);

router.route("/:groupId/add/:userId").patch(verifyRole(["admin"]), addUserToGroup);
router.route("/:groupId/remove/:userId").patch(verifyRole(["admin"]), removeUserFromGroup);
export default router;
