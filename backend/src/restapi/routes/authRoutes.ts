import { Router } from "express";
import { RegisterController } from "@restapi/controllers/auth/RegisterController";
import { LoginController } from "@restapi/controllers/auth/LoginController";
import { MeController } from "@restapi/controllers/auth/MeController";
import { LogoutController } from "@restapi/controllers/auth/LogoutController";
import { loginRateLimit } from "@restapi/middlewares/loginRateLimitMiddleware";
import { asyncHandlerMiddleware } from "@restapi/middlewares/asyncHandlerMiddleware";
import { validateBody } from "@restapi/middlewares/validateBodyMiddleware";
import { authnMiddleware } from "@restapi/middlewares/authMiddleware";
import { RegisterDTO } from "@restapi/dto/auth/RegisterDTO";
import { LoginDTO } from "@restapi/dto/auth/LoginDTO";

const router = Router();

router.post(
  "/register",
  loginRateLimit,
  validateBody(RegisterDTO),
  asyncHandlerMiddleware((req, res) =>
    new RegisterController().handle(req, res),
  ),
);
router.post(
  "/login",
  loginRateLimit,
  validateBody(LoginDTO),
  asyncHandlerMiddleware((req, res) => new LoginController().handle(req, res)),
);
router.get(
  "/me",
  authnMiddleware,
  asyncHandlerMiddleware((req, res) => new MeController().handle(req, res)),
);
router.post(
  "/logout",
  authnMiddleware,
  asyncHandlerMiddleware((req, res) => new LogoutController().handle(req, res)),
);

export default router;
