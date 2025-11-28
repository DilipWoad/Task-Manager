import { ApiError } from "../utils/ApiError.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";

export const verifyRole = (roles) => {
  //so comming here the user is already authenticated
  console.log("Listed Roles yyh :: ", roles);
  return AsyncHandler(async (req, res, next) => {
    //so we can have the req.user
  console.log("Listed Rolesxyz :: ", roles);
    const { role } = req.user;
    if (!role) {
      throw new ApiError(404, "Role not found.");
    }
    console.log("This is the role :: ",role)
    //get the role from the req.user and match it with the allowed roles
    if (!roles.includes(role)) {
      throw new ApiError(
        403,
        "You don't have permission to access this route."
      );
    }
    //if all good call the "next" middleware
    next();
  });
};
