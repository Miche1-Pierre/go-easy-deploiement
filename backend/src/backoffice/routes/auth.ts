import { Router } from "express";
import { ShowLoginController } from "@backoffice/controllers/auth/ShowLoginController";
import { LoginController } from "@backoffice/controllers/auth/LoginController";
import { LogoutController } from "@backoffice/controllers/auth/LogoutController";

const router = Router();

router.get("/login", (req, res) => new ShowLoginController().handle(req, res));
router.post("/login", (req, res) => new LoginController().handle(req, res));
router.post("/logout", (req, res) => new LogoutController().handle(req, res));

export default router;
