import { NextFunction, Request, Response } from "express";

export const GlobalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode: number = err.statusCode || 500;
  const message: string = err.message || "Internal Server Error.";
  //so this will return a response to gracefully handle the error/creahsed
  const response = {
    success: false,
    statusCode,
    message,
    errors: err.errors || [],
    data: null,
    //show error stack in dev env only not in production
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  };

  //for development console.log the errorStack
  if (process.env.NODE_ENV === "development") {
    console.error(`💥 Error: ${message}`);
  }
  return res.status(statusCode).json(response);
};
