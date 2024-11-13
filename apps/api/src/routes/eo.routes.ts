import { Router } from "express";
import { EoRegister, GetEoDatas } from "../controllers/eo.controller";

const router = Router();

router.post("/registration", EoRegister);

router.get("/eo-list", GetEoDatas);

export default router;
