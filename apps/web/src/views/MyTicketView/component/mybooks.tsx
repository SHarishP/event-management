"use client";
import axiosInstance from "@/lib/axios";
import ErrorHandler from "@/utils/error-handler";
import { useState, useEffect } from "react";
import { ITransactions } from "../types";
import Swal from "sweetalert2";
import { Formik, Form, FormikProps } from "formik";
import { Transaction } from "@/lib/schema";

interface ITransId {
  transactionIds: number[];
  useCoupon: boolean;
}

export default function MyBooks() {
  const [myEvents, setMyEvents] = useState<ITransactions[]>([]);
  const [selectedTransactions, setSelectedTransactions] = useState<number[]>(
    []
  );

  // Get All Booked Events
  useEffect(() => {
    const getAllBooked = async () => {
      try {
        const { data } = await axiosInstance.get("/transaction/cart");
        setMyEvents(data.transactions);
      } catch (err) {
        ErrorHandler(err);
      }
    };
    getAllBooked();
  }, []);

  // Delete transaction
  const deleteButton = async (transactionId: number) => {
    try {
      const { data } = await axiosInstance.delete(
        `/transaction/${transactionId}`
      );
      Swal.fire({
        icon: "success",
        title: data.message,
        showConfirmButton: false,
        timer: 2000,
      });
      // Refresh the list of transactions
      setMyEvents((prev) => prev.filter((event) => event.id !== transactionId));
    } catch (err) {
      ErrorHandler(err);
    }
  };

  // Make Payment
  const makePayment = async (transactionIds: number[], useCoupon: boolean) => {
    try {
      const { data } = await axiosInstance.post("/transaction/payment", {
        transactionIds,
        useCoupon,
      });
      Swal.fire({
        icon: "success",
        title: data.message,
        showConfirmButton: false,
        timer: 2000,
      });
      // Refresh the list of transactions
      setMyEvents((prev) =>
        prev.filter((event) => !transactionIds.includes(event.id))
      );
    } catch (err) {
      ErrorHandler(err);
    }
  };

  // Handle checkbox change outside of rendering cycle
  const handleCheckboxChange = (
    transactionId: number,
    setFieldValue: (field: string, value: any) => void
  ) => {
    setSelectedTransactions((prev) => {
      const updatedTransactions = prev.includes(transactionId)
        ? prev.filter((id) => id !== transactionId)
        : [...prev, transactionId];

      // Update Formik's transactionIds field with selected transactions
      setFieldValue("transactionIds", updatedTransactions);

      return updatedTransactions;
    });
  };

  return (
    <div className="my-4 mx-10">
      <Formik
        initialValues={{
          transactionIds: selectedTransactions, // Ensure Formik tracks selected transactions
          useCoupon: false,
        }}
        validationSchema={Transaction}
        onSubmit={(values, actions) => {
          makePayment(values.transactionIds, values.useCoupon);
          actions.setSubmitting(false);
        }}
      >
        {(props: FormikProps<ITransId>) => {
          const { values, handleChange, setFieldValue } = props;

          return (
            <Form>
              {/* UnProcessed Book */}
              <div>
                {myEvents.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="bg-gray-200 p-2 rounded-xl drop-shadow-md flex justify-between items-center my-4"
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="transactionIds"
                        value={transaction.id}
                        checked={selectedTransactions.includes(transaction.id)}
                        onChange={() =>
                          handleCheckboxChange(transaction.id, setFieldValue)
                        } // Pass setFieldValue here
                      />
                    </div>
                    {/* Event name */}
                    <div className="flex-1 text-center">
                      <h3>{transaction.event.name}</h3>
                      <p>{transaction.event.location.name}</p>
                      <p>{transaction.event.startDate}</p>
                      <p>{transaction.event.startTime}</p>
                      <p>My Ticket : {transaction.seats} ticket(s)</p>
                    </div>

                    {/* Delete Transaction */}
                    <div>
                      <button
                        type="button"
                        className="text-red-500"
                        onClick={() => deleteButton(transaction.id)}
                      >
                        X
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Use Coupon Section */}
              <div className="flex items-center gap-4 my-4">
                <label htmlFor="UseCoupon">Use Your Coupon? </label>
                <input
                  type="checkbox"
                  name="useCoupon"
                  checked={values.useCoupon}
                  onChange={() => setFieldValue("useCoupon", !values.useCoupon)}
                />
              </div>

              {/* Make Payment Section */}
              <div>
                <button
                  type="submit" // Ensure it triggers Formik submit
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  disabled={selectedTransactions.length === 0} // Disable if no transactions are selected
                >
                  Make Payment
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
