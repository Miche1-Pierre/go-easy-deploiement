import { Request, Response, NextFunction } from "express";

export function requireSameOrigin(req: Request, res: Response, next: NextFunction): void {
  //protection CSRF : seules les méthodes mutatives peuvent modifier un état,
  //inutile de vérifier l'origine des requêtes de lecture (GET/HEAD)
  if (!["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
    next();
    return;
  }

  const source = req.get("origin") || req.get("referer");
  if (!source) {
    res.status(403).send("Origine de la requête manquante");
    return;
  }

  try {
    const sourceUrl = new URL(source);
    //derrière NGINX, req.get("host") renverrait l'hôte interne : on privilégie
    //x-forwarded-host pour comparer à l'hôte public réellement visé
    const forwardedHost = req.get("x-forwarded-host")?.split(",")[0].trim();
    const expectedHost = forwardedHost || req.get("host");
    if (!expectedHost || sourceUrl.host !== expectedHost) {
      res.status(403).send("Origine de la requête invalide");
      return;
    }
  } catch {
    res.status(403).send("Origine de la requête invalide");
    return;
  }

  next();
}
