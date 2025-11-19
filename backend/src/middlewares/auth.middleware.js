import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

const verifyAuthentication = AsyncHandler(async (req, res, next) => {
  //1)cookies can be from header and can be taken from cookies
  let accessToken = req.cookies.accessToken || req.header("Authorization");
  console.log(accessToken);

  if (!accessToken) {
    throw new ApiError(404, "Access token does not exists");
  }
  //if coming from header only then use the Bearer
  //   if (accessToken.includes("Bearer")) {
  //     accessToken = accessToken.replace("Bearer ", "");
  //   }

  const userPayload = jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET_KEY
  );

  if (!userPayload) {
    throw new ApiError(401, "Invalid Access Token");
  }

  //if all good add it to the req
  req.user = userPayload;
  next();
});
export {verifyAuthentication};
