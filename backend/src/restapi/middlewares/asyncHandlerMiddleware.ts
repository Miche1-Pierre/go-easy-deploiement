import { Request, Response, NextFunction, RequestHandler } from "express";

export const asyncHandlerMiddleware =
  (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
  ): RequestHandler =>
  (req, res, next) => {
    //Express n'attrape pas nativement les rejets de promesse dans un handler async :
    //sans ce .catch, une erreur async ne serait jamais transmise à errorHandler
    fn(req, res, next).catch(next);
  };
