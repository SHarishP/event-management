import { Router } from "express";
import { VerifyToken } from "../middlewares/user.middleware";
import { CreateEvent, GetMyEvents } from "../controllers/event.controller";

const router = Router();

// First Function to test if Verify Token is working, YOU NEED TO UPDATE LATER!!!
router.post("/create-event", VerifyToken, CreateEvent);
// Second Function to test if Verify Token is Working
router.get("/my-events", VerifyToken, GetMyEvents);

export default router;
