import { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

export function validateBody<T extends object>(dtoClass: new () => T) {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const instance = plainToInstance(dtoClass, req.body);
    //whitelist/forbidNonWhitelisted : toute propriété non déclarée sur le DTO est
    //rejetée, ce qui empêche un client d'injecter des champs additionnels non
    //prévus par le contrôleur/service en aval (seuls les champs du DTO passent)
    const errors = await validate(instance, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      const details = errors.map((e) => ({
        property: e.property,
        constraints: e.constraints,
      }));
      next(details);
      return;
    }

    req.body = instance;
    next();
  };
}
