import { Router } from "express";
import { VerifyEoToken } from "../middlewares/eo.middleware";
import { VerifyEoToken } from "../middleware/eo.middleware";
import { CreateEvent, GetMyEvents } from "../controllers/event.controller";

const router = Router();

// First Function to test if Verify Token is working, YOU NEED TO UPDATE LATER!!!
router.post("/create-event", VerifyEoToken, CreateEvent);
// Second Function to test if Verify Token is Working
router.get("/my-events", VerifyEoToken, GetMyEvents);

export default router;
