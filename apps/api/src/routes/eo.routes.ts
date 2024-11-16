import { Router } from "express";
import { EoLogin, EoRegister, GetEoDatas } from "../controllers/eo.controller";

const router = Router();

router.post("/registration", EoRegister);

router.get("/eo-list", GetEoDatas);

router.post("/login", EoLogin);

export default router;
