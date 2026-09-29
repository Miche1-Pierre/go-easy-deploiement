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
  res.status(500).json({ error: "Erreur interne du serveur", success: false });
}
