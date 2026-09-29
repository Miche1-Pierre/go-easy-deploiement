import { Router } from "express";
import { CreateBookingController } from "@restapi/controllers/bookings/CreateBookingController";
import { ListMyBookingsController } from "@restapi/controllers/bookings/ListMyBookingsController";
import { ListAllBookingsController } from "@restapi/controllers/bookings/ListAllBookingsController";
import { CancelBookingController } from "@restapi/controllers/bookings/CancelBookingController";
import { asyncHandlerMiddleware } from "@restapi/middlewares/asyncHandlerMiddleware";
import { validateBody } from "@restapi/middlewares/validateBodyMiddleware";
import {
  authnMiddleware,
  authzMiddleware,
} from "@restapi/middlewares/authMiddleware";
import { UserRole } from "@domain/entities/enums";
import { CreateBookingDTO } from "@restapi/dto/booking/CreateBookingDTO";

const router = Router();

router.post(
  "/",
  authnMiddleware,
  validateBody(CreateBookingDTO),
  asyncHandlerMiddleware((req, res) =>
    new CreateBookingController().handle(req, res),
  ),
);
router.get(
  "/me",
  authnMiddleware,
  asyncHandlerMiddleware((req, res) =>
    new ListMyBookingsController().handle(req, res),
  ),
);
router.patch(
  "/:id/cancel",
  authnMiddleware,
  asyncHandlerMiddleware((req, res) =>
    new CancelBookingController().handle(req, res),
  ),
);
router.get(
  "/",
  authnMiddleware,
  authzMiddleware(UserRole.ADMIN),
  asyncHandlerMiddleware((req, res) =>
    new ListAllBookingsController().handle(req, res),
  ),
);

export default router;
