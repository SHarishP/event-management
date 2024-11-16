import { Router } from "express";
import {
  CustLogin,
  CustRegist,
  GetCustDatas,
} from "../controllers/cust.controller";

const router = Router();

router.post("/registration", CustRegist);
router.get("/cust-list", GetCustDatas);
router.post("/login", CustLogin);

export default router;
