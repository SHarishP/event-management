import { Router } from "express";
import { VerifyToken } from "../middlewares/user.middleware";
import {
  Checkout,
  DeleteTransaction,
  GetTransactionsByUser,
  MakePayment,
  UploadPaymentProof,
  GetPaymentsByUser,
  GetPaidTransactionsByUser,
} from "../controllers/transaction.controller";

const router = Router();
// Book Ticket
router.post("/checkout", VerifyToken, Checkout);
// Delete Booked Ticket
router.delete("/:transactionId", VerifyToken, DeleteTransaction);
// Getting unpaid transaction by userId
router.get("/cart", VerifyToken, GetTransactionsByUser);
// Get transaction done by user
router.get("/done", VerifyToken, GetPaidTransactionsByUser);
// Process Transaction(s)
router.post("/payment", VerifyToken, MakePayment);
// Get Payment
router.get("/payment", VerifyToken, GetPaymentsByUser);
// Upload payment proof
router.post("/update", VerifyToken, UploadPaymentProof);

export default router;
