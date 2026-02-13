import {NextFunction, Request, RequestHandler, Response} from "express"
//it is just a function that takes a function as an input then returns a function as an output
//More of a higher order function
export const AsyncHandler = (requestHandler:RequestHandler) => {
  //requestHandler is the input function
  // |
  // |
  //--- below is the function is return in a transformed form
  return (req:Request, res:Response, next:NextFunction) => {
    Promise.resolve(requestHandler(req, res, next)).catch((error) =>
      next(error)
    );
  };
};
