import { Request, Response, NextFunction } from "express";
import { HttpErrorMiddleware } from "@restapi/middlewares/HttpErrorMiddleware";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof HttpErrorMiddleware) {
    res.status(err.status).json({ error: err.message, success: false });
    return;
  }

  if (Array.isArray(err)) {
    res
      .status(400)
      .json({ error: "Échec de la validation", details: err, success: false });
    return;
  }

  console.error("Erreur inattendue :", err);
  const message = err instanceof Error ? err.message : String(err);
  const stack = err instanceof Error ? err.stack : undefined;
  res.status(500).json({ error: message, stack, success: false });
}
