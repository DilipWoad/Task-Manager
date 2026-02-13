import { CookieOptions } from "express";

const ACCESS_TOKEN_EXPIRY = 15 * 60 * 1000;
const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000;
const isProduction = process.env.NODE_ENV === "production";

const BaseCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "strict",
};

const AccessTokenOptions: CookieOptions = {
  ...BaseCookieOptions,
  maxAge: ACCESS_TOKEN_EXPIRY,
};
const RefreshTokenOptions: CookieOptions = {
  ...BaseCookieOptions,
  maxAge: REFRESH_TOKEN_EXPIRY,
};
export { AccessTokenOptions, RefreshTokenOptions };
