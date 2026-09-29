import { Router } from "express";
import { requireAdmin } from "@backoffice/middlewares/requireAdmin";
import { ListActivitiesController } from "@backoffice/controllers/activities/ListActivitiesController";
import { NewActivityController } from "@backoffice/controllers/activities/NewActivityController";
import { EditActivityController } from "@backoffice/controllers/activities/EditActivityController";
import { CreateActivityController } from "@backoffice/controllers/activities/CreateActivityController";
import { UpdateActivityController } from "@backoffice/controllers/activities/UpdateActivityController";
import { DeleteActivityController } from "@backoffice/controllers/activities/DeleteActivityController";
const router = Router();
router.use(requireAdmin);
router.get("/", (req, res) => new ListActivitiesController().handle(req, res));
router.get("/new", (req, res) => new NewActivityController().handle(req, res));
router.post("/", (req, res) => new CreateActivityController().handle(req, res));
router.get("/:id/edit", (req, res) =>
  new EditActivityController().handle(req, res),
);
router.post("/:id/edit", (req, res) =>
  new UpdateActivityController().handle(req, res),
);
router.post("/:id/delete", (req, res) =>
  new DeleteActivityController().handle(req, res),
);
export default router;
