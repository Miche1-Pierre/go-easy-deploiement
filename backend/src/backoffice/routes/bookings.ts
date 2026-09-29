import { Router } from "express";
import { requireAdmin } from "@backoffice/middlewares/requireAdmin";
import { ListBookingsController } from "@backoffice/controllers/bookings/ListBookingsController";
import { CancelBookingController } from "@backoffice/controllers/bookings/CancelBookingController";

const router = Router();
router.use(requireAdmin);

router.get("/", (req, res) => new ListBookingsController().handle(req, res));
router.post("/:id/cancel", (req, res) =>
  new CancelBookingController().handle(req, res),
);

export default router;
