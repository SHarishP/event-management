import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { User } from "../custom";

const prisma = new PrismaClient();

// Function to handle ticket booking
async function Checkout(req: Request, res: Response, next: NextFunction) {
  try {
    const { eventId, seats, usePoints } = req.body;
    const { id: userId } = req.user as User;

    // Input Validation
    if (!eventId) throw new Error("Event ID is required");
    if (!seats) throw new Error("Seat(s) is required");

    // Get information about the event
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!event) throw new Error("Event not found");

    // Check the remaining seat
    if (event.remainSeats < seats) {
      throw new Error("Not enough seats available");
    }

    // Calculate total price
    let totalPrice = event.price * seats;

    // If use poin
    let pointsUsed = 0;
    if (usePoints) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (!user) throw new Error("User not found");
      if (user.totalPoints == null) {
        throw new Error("User has no points");
      } else if (user.totalPoints !== null && user.totalPoints < usePoints) {
        throw new Error("Not enough points to use");
      }
      pointsUsed = usePoints;
      totalPrice -= pointsUsed;

      //   Reduce the point that user has
      if (user.totalPoints !== null) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            totalPoints: user.totalPoints - pointsUsed,
          },
        });
      }
    }

    // Booking Transaction
    await prisma.transaction.create({
      data: {
        eventId,
        userId,
        seats: seats,
        usePoints: pointsUsed,
        totalPrice,
      },
    });

    // reduce the remaining seat
    await prisma.event.update({
      where: { id: eventId },
      data: {
        remainSeats: event.remainSeats - seats,
      },
    });

    res.status(200).send({
      message: `Success! You need to pay : IDR ${totalPrice}`,
    });
  } catch (err) {
    next(err);
  }
}

// Function to delete a transaction
async function DeleteTransaction(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { transactionId } = req.params;
    const { id: userId } = req.user as User;

    // Convertion transactionId to Int
    const transactionIdInt = parseInt(transactionId, 10);
    if (isNaN(transactionIdInt)) {
      throw new Error("transaction id must be valid number!");
    }

    // Validate transaction existance
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionIdInt },
    });
    if (!transaction) throw new Error("Transaction not found");

    // Validate user ownership
    if (transaction.userId !== userId) {
      throw new Error("Unauthorized to delete this transaction");
    }

    // Update remaining seats for the event
    await prisma.event.update({
      where: { id: transaction.eventId },
      data: {
        remainSeats: {
          increment: transaction.seats,
        },
      },
    });

    // Update total point
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new Error("User not found");
    if (transaction.usePoints !== null && user.totalPoints !== null) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          totalPoints: {
            increment: transaction.usePoints,
          },
        },
      });
    }

    // Delete the transaction
    await prisma.transaction.delete({
      where: { id: transactionIdInt },
    });
    res.status(200).send({
      message: "Transaction deleted successfully",
    });
  } catch (err) {
    next(err);
  }
}

// Function to get all transactions by user Id
async function GetTransactionsByUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id: userId } = req.user as User;

    // Fetch transactions for the user
    const transactions = await prisma.transaction.findMany({
      where: { userId, isPaid: false, paymentId: null },
      select: {
        id: true,
        seats: true,
        totalPrice: true,
        isPaid: true,
        event: {
          select: {
            name: true,
            startDate: true,
            startTime: true,
            description: true,
            location: {
              select: { name: true },
            },
            category: {
              select: { name: true },
            },
          },
        },
      },
    });

    // Check if user has no transaction
    if (transactions.length === 0) {
      res.status(404).send({
        message: "No unpaid transactions found for this user",
      });
    }
    res.status(200).send({
      message: "Success",
      transactions,
    });
  } catch (err) {
    next(err);
  }
}

async function MakePayment(req: Request, res: Response, next: NextFunction) {
  try {
    const { id: userId } = req.user as User;
    const { transactionIds, useCoupon } = req.body;

    // Get all transaction that is unPaid
    const transactions = await prisma.transaction.findMany({
      where: {
        id: { in: transactionIds },
        userId: userId,
        isPaid: false,
        paymentId: null,
      },
    });
    //  Check if there are any transactions to process
    console.log(transactions);
    if (transactions.length === 0) {
      throw new Error(
        "You have no unpaid transactions or some transactions already need to be processed"
      );
    }

    // Check if paymentId is not null
    const invalidTransactions = await prisma.transaction.findMany({
      where: {
        id: { in: transactionIds },
        userId: userId,
        paymentId: { not: null },
      },
    });

    if (invalidTransactions.length > 0) {
      throw new Error(
        "Some transactions already have a paymentId and cannot be processed again"
      );
    }

    // Calculate total price that need to pay
    let totalAmount = transactions.reduce(
      (sum, transaction) => sum + transaction.totalPrice,
      0
    );

    // If user choose to use coupon
    let couponUsed = null;
    if (useCoupon) {
      const coupon = await prisma.coupon.findFirst({
        where: { userId: userId, isUsed: false },
      });
      if (!coupon) throw new Error("Coupon is unavailable");
      //   If coupon not yet used
      totalAmount -= totalAmount * coupon.discount;
      couponUsed = coupon;
      //   update coupon status to used
      await prisma.coupon.update({
        where: { id: coupon.id },
        data: { isUsed: true },
      });
    }

    // Make a transaction
    await prisma.payment.create({
      data: {
        amountPaid: totalAmount,
        transactions: {
          connect: transactions.map((transaction) => ({ id: transaction.id })),
        },
      },
    });
    const Rekening: string = "086745321"; // You need to update it later!!!!
    res.status(200).send({
      message: `Please pay ${totalAmount} to ${Rekening}`,
    });
  } catch (err) {
    next(err);
  }
}

async function UploadPaymentProof(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id: userId } = req.user as User;
    const { paymentId, paymentProof } = req.body;

    // Check if paymentProof Exist
    if (!paymentProof) throw new Error("Payment proof is required");

    // Get payment based on payment Id
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { transactions: true },
    });

    if (!payment) {
      throw new Error("Payment not found");
    }

    // Check if payment is already done
    if (payment.isPaid) {
      throw new Error("Payment has already been processed");
    }

    // Update payment proof in payment db
    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        paymentProof: paymentProof,
        isPaid: true,
      },
    });

    // Update transactions status to paid
    await prisma.transaction.updateMany({
      where: {
        id: { in: payment.transactions.map((t) => t.id) },
      },
      data: {
        isPaid: true,
      },
    });

    res.status(200).send({
      message: "Payment Successful",
    });
  } catch (err) {
    next(err);
  }
}

// Function to get Payment by Users
async function GetPaymentsByUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id: userId } = req.user as User;
    // Fetch payments for the user, including transactions that are associated with this payment
    const payments = await prisma.payment.findMany({
      where: {
        isPaid: false,
        transactions: {
          some: {
            userId: userId, // Filter transactions by userId
          },
        },
      },
      include: {
        transactions: {
          where: {
            userId: userId, // Ensure transactions belong to the user
          },
          select: {
            id: true,
            totalPrice: true,
            seats: true,
            event: {
              select: {
                name: true,
                startDate: true,
                startTime: true,
                location: {
                  select: { name: true },
                },
                category: {
                  select: { name: true },
                },
              },
            },
          },
        },
      },
    });

    // If no payments found, return a message
    if (payments.length === 0) {
      res.status(404).send({
        message: "No unpaid payments found for this user",
      });
      return;
    }
    const Rekening: string = "086745321"; // You need to update it
    res.status(200).send({
      message: "Success",
      payments,
      Rekening,
    });
  } catch (err) {
    next(err);
  }
}

// Function to get all transactions by user Id
async function GetPaidTransactionsByUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id: userId } = req.user as User;

    // Fetch transactions for the user
    const transactions = await prisma.transaction.findMany({
      where: { userId, isPaid: true },
      select: {
        id: true,
        seats: true,
        totalPrice: true,
        isPaid: true,
        event: {
          select: {
            name: true,
            startDate: true,
            startTime: true,
            description: true,
            location: {
              select: { name: true },
            },
            category: {
              select: { name: true },
            },
          },
        },
      },
    });

    // Check if user has no transaction
    if (transactions.length === 0) {
      res.status(404).send({
        message: "No transactions found for this user",
      });
    }
    res.status(200).send({
      message: "Success",
      transactions,
    });
  } catch (err) {
    next(err);
  }
}
export {
  Checkout,
  DeleteTransaction,
  GetTransactionsByUser,
  MakePayment,
  UploadPaymentProof,
  GetPaymentsByUser,
  GetPaidTransactionsByUser,
};
