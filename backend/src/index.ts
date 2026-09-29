import "reflect-metadata";
import "@backoffice/types";
import express from "express";
import cors from "cors";
import session from "express-session";
import path from "path";
import { AppDataSource } from "@config/data-source";
import { env } from "@config/env";
import routes from "@restapi/routes";
import { errorHandler } from "@restapi/middlewares/errorHandler";
import adminAuthRoutes from "@backoffice/routes/auth";
import adminActivitiesRoutes from "@backoffice/routes/activities";
import adminBookingsRoutes from "@backoffice/routes/bookings";
import { requireSameOrigin } from "@backoffice/middlewares/requireSameOrigin";
import { loginRateLimit } from "@restapi/middlewares/loginRateLimitMiddleware";

function createApp() {
  const app = express();
  //derrière le reverse-proxy NGINX : fait confiance au premier X-Forwarded-*,
  //nécessaire pour que req.ip (rate limit) et req.secure (cookie secure) soient corrects
  app.set("trust proxy", 1);

  app.use("/admin", express.static(path.join(__dirname, "../public/admin")));
  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "./backoffice/views"));

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.use(cors({ origin: "*", credentials: true }));

  app.use(
    session({
      secret: env.sessionSecret,
      resave: false,
      saveUninitialized: false,
      name: "goeasy.admin.sid",
      cookie: {
        httpOnly: true, //inaccessible en JS, limite le vol de cookie via XSS
        sameSite: "lax", //bloque l'envoi du cookie sur des requêtes cross-site, en complément de requireSameOrigin
        secure: env.nodeEnv === "production", //cookie HTTPS uniquement en prod (HTTP local en dev)
        maxAge: 8 * 3600 * 1000,
      },
    }),
  );

  // REST API (public + customers)
  app.use("/api", routes);

  // Back Office (admins)
  app.get("/admin", (_req, res) => res.redirect("/admin/activities"));
  app.use("/admin", requireSameOrigin);
  app.post("/admin/login", loginRateLimit);
  app.use("/admin", adminAuthRoutes);
  app.use("/admin/activities", adminActivitiesRoutes);
  app.use("/admin/bookings", adminBookingsRoutes);

  app.use(errorHandler);

  return app;
}

//réessaie la connexion DB au démarrage : utile avec Docker Compose, où le conteneur
//backend peut démarrer avant que MariaDB soit prête à accepter des connexions
async function connectWithRetry(retries = 10, delayMs = 3000): Promise<void> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await AppDataSource.initialize();
      console.log("Database connection established");
      return;
    } catch (err) {
      console.warn(
        `DB connection attempt ${attempt}/${retries} failed. Retrying in ${delayMs}ms...`,
      );
      if (attempt === retries) throw err;
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
}

async function bootstrap(): Promise<void> {
  await connectWithRetry();
  const app = createApp();
  app.listen(3000, () => {
    console.log(`REST API    → http://localhost:3000/api`);
    console.log(`Back Office   → http://localhost:3000/admin`);
  });
}

bootstrap().catch((err) => {
  console.error("Fatal startup error:", err);
  process.exit(1);
});
