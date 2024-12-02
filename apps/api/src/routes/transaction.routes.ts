import { Router } from "express";
import { VerifyToken } from "../middlewares/user.middleware";
import {
  Checkout,
  DeleteTransaction,
  GetTransactionsByUser,
  MakePayment,
  UploadPaymentProof,
} from "../controllers/transaction.controller";

const router = Router();
// Book Ticket
router.post("/checkout", VerifyToken, Checkout);
// Delete Booked Ticket
router.delete("/:transactionId", VerifyToken, DeleteTransaction);
// Getting transaction by userId
router.get("/cart", VerifyToken, GetTransactionsByUser);
// Process Transaction(s)
router.post("/payment", VerifyToken, MakePayment);
// Upload payment proof
router.post("/uptade", VerifyToken, UploadPaymentProof);

export default router;
