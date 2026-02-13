import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";

export const verifyRole = (roles: string[]) => {
  //so comming here the user is already authenticated
  return AsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      //so we can have the req.user
      if (!req.user) {
        throw new ApiError(401, "Unauthorized request");
      }
      // to ensure user exists then we can extract role from it
      const { role } = req.user;

      //get the role from the req.user and match it with the allowed roles
      if (!roles.includes(role)) {
        throw new ApiError(
          403,
          "You don't have permission to access this route.",
        );
      }
      //if all good call the "next" middleware
      next();
    },
  );
};
