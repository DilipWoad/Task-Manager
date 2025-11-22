import { ApiError } from "./ApiError.js";

export const generateAccessRefreshToken = async (user) => {
  try {
    //so we have user-> is a schema and we have
    //so we use the user payload to regenrate the jwt token
    if (!user) {
      throw new ApiError(404, "User does not exists.");
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    //first update the token in the database
    user.refreshToken = refreshToken;
    user.save({ validateBeforeSave: false }); //this will not run th validation on the schema struct and types just update it
    return { refreshToken, accessToken };
  } catch (error) {
    console.log("Error while generating tokens :: ", error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500,"Something went wrong while generating the tokens.")
  }
};
