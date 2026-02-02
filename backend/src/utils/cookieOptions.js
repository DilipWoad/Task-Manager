const AccessTokenOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV,
  // sameSite: "Strict",
  sameSite: "None",
  maxAge: 16* 60 * 60 * 1000,
};
const RefreshTokenOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV,
  // sameSite: "Strict",
  sameSite: "None",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};
export {AccessTokenOptions,RefreshTokenOptions};