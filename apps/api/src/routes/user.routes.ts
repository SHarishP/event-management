import { Router } from "express";
import {
  CustLogin,
  CustRegist,
  EoRegist,
  GetAvatar,
  GetCustDatas,
  GetEoDatas,
  UpdateAvatar,
} from "../controllers/user.controller";
import {
  RegisterValidation,
  LoginValidation,
} from "../middlewares/validations/auth.validation";
import { VerifyToken } from "../middlewares/user.middleware";
import { SingleUploader } from "../config/uploader";

const router = Router();

router.post("/cust-regist", RegisterValidation, CustRegist);
router.post("/eo-regist", RegisterValidation, EoRegist);
router.get("/cust-list", GetCustDatas);
router.get("/eo-list", GetEoDatas);
router.post("/login", LoginValidation, CustLogin);
router.get("/avatar", VerifyToken, GetAvatar);
router.patch(
  "/avatar",
  VerifyToken,
  SingleUploader("AVT", "/avatar"),
  UpdateAvatar
);

export default router;
