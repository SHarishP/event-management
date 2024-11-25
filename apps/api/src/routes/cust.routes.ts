import { Router } from "express";
import {
  CustLogin,
  CustRegist,
  EoRegist,
  GetCustDatas,
} from "../controllers/cust.controller";
import {
  RegisterValidation,
  LoginValidation,
} from "../middlewares/validations/auth.validation";
import { GetEoDatas } from "../controllers/eo.controller";

const router = Router();

router.post("/cust-regist", RegisterValidation, CustRegist);
router.post("/eo-regist", RegisterValidation, EoRegist);
router.get("/cust-list", GetCustDatas);
router.get("/eo-list", GetEoDatas);
router.post("/login", LoginValidation, CustLogin);

export default router;
