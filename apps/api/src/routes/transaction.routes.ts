import { Router } from "express";
import { VerifyToken, CustGuard } from "../middlewares/user.middleware";
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
router.post("/checkout", VerifyToken, CustGuard, Checkout);
// Delete Booked Ticket
router.delete("/:transactionId", VerifyToken, CustGuard, DeleteTransaction);
// Getting unpaid transaction by userId
router.get("/cart", VerifyToken, CustGuard, GetTransactionsByUser);
// Get transaction done by user
router.get("/done", VerifyToken, CustGuard, GetPaidTransactionsByUser);
// Process Transaction(s)
router.post("/payment", VerifyToken, CustGuard, MakePayment);
// Get Payment
router.get("/payment", VerifyToken, CustGuard, GetPaymentsByUser);
// Upload payment proof
router.post("/update", VerifyToken, CustGuard, UploadPaymentProof);

export default router;
