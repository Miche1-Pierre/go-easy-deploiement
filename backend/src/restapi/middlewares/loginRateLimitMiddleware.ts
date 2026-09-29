import { Request, Response, NextFunction } from "express";

//compteur en mémoire locale au process : protège contre le brute-force sur /login,
//mais n'est pas partagé si le backend tourne en plusieurs instances
const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX_ATTEMPTS = 8;

export function loginRateLimit(req: Request, res: Response, next: NextFunction): void {
  const now = Date.now();
  //purge les entrées expirées quand la map grossit trop, pour ne pas laisser
  //ce compteur en mémoire devenir lui-même une fuite mémoire exploitable
  if (attempts.size > 10_000) {
    for (const [ip, value] of attempts) {
      if (value.resetAt <= now) attempts.delete(ip);
    }
  }
  const key = req.ip || req.socket.remoteAddress || "unknown";
  const current = attempts.get(key);
  if (!current || current.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    next();
    return;
  }
  current.count += 1;
  if (current.count > MAX_ATTEMPTS) {
    res.setHeader("Retry-After", Math.ceil((current.resetAt - now) / 1000));
    res.status(429).json({ error: "Trop de tentatives d'authentification", success: false });
    return;
  }
  next();
}
