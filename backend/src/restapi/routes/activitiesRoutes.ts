import { Router } from "express";
import { ListActivitiesController } from "@restapi/controllers/activities/ListActivitiesController";
import { GetActivityController } from "@restapi/controllers/activities/GetActivityController";
import { CreateActivityController } from "@restapi/controllers/activities/CreateActivityController";
import { UpdateActivityController } from "@restapi/controllers/activities/UpdateActivityController";
import { DeleteActivityController } from "@restapi/controllers/activities/DeleteActivityController";
import { asyncHandlerMiddleware } from "@restapi/middlewares/asyncHandlerMiddleware";
import { validateBody } from "@restapi/middlewares/validateBodyMiddleware";
import {
  authnMiddleware,
  authzMiddleware,
} from "@restapi/middlewares/authMiddleware";
import { UserRole } from "@domain/entities/enums";
import { CreateActivityDTO } from "@restapi/dto/activity/CreateActivityDTO";
import { UpdateActivityDTO } from "@restapi/dto/activity/UpdateActivityDTO";
const router = Router();
const admin = [authnMiddleware];
router.get(
  "/",
  asyncHandlerMiddleware((req, res) =>
    new ListActivitiesController().handle(req, res),
  ),
);
router.get(
  "/:id",
  asyncHandlerMiddleware((req, res) =>
    new GetActivityController().handle(req, res),
  ),
);
router.post(
  "/",
  ...admin,
  validateBody(CreateActivityDTO),
  asyncHandlerMiddleware((req, res) =>
    new CreateActivityController().handle(req, res),
  ),
);
router.put(
  "/:id",
  ...admin,
  validateBody(UpdateActivityDTO),
  asyncHandlerMiddleware((req, res) =>
    new UpdateActivityController().handle(req, res),
  ),
);
router.delete(
  "/:id",
  ...admin,
  asyncHandlerMiddleware((req, res) =>
    new DeleteActivityController().handle(req, res),
  ),
);
export default router;
