import { Router } from "express";
import {
  CustLogin,
  CustRegist,
  GetCustDatas,
} from "../controllers/cust.controller";
import {
  RegisterValidation,
  LoginValidation,
} from "../middlewares/validations/auth.validation";

const router = Router();

router.post("/registration", RegisterValidation, CustRegist);
router.get("/cust-list", GetCustDatas);
router.post("/login", LoginValidation, CustLogin);

export default router;
