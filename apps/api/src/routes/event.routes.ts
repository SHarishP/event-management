import { Router } from "express";
import { EoGuard, VerifyToken } from "../middlewares/user.middleware";
import {
  CreateEvent,
  GetMyEvents,
  GetCategories,
  GetLocations,
} from "../controllers/event.controller";
import { SingleUploader } from "../config/uploader";

const router = Router();

// First Function to test if Verify Token is working
router.post(
  "/create-event",
  VerifyToken,
  EoGuard,
  SingleUploader("EVT", "/banner"),
  CreateEvent
);
// Second Function to test if Verify Token is Working
router.get("/my-events", VerifyToken, EoGuard, GetMyEvents);

router.get("/categories", VerifyToken, EoGuard, GetCategories);

router.get("/locations", VerifyToken, EoGuard, GetLocations);

export default router;
