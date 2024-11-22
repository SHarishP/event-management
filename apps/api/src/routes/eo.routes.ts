import { Router } from "express";
import { EoLogin, EoRegister, GetEoDatas } from "../controllers/eo.controller";

import {
  LoginValidation,
  RegisterValidation,
} from "../middlewares/validations/auth.validation";

const router = Router();

router.post("/registration", RegisterValidation, EoRegister);

router.get("/eo-list", GetEoDatas);

router.post("/login", LoginValidation, EoLogin);

export default router;
