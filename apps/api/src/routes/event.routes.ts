import { Router } from "express";
import { EoGuard, VerifyToken } from "../middlewares/user.middleware";
import { CreateEvent, GetMyEvents } from "../controllers/event.controller";

const router = Router();

// First Function to test if Verify Token is working
router.post("/create-event", VerifyToken, EoGuard, CreateEvent);
// Second Function to test if Verify Token is Working
router.get("/my-events", VerifyToken, EoGuard, GetMyEvents);

export default router;
