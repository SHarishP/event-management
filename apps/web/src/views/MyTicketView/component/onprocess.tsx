"use client";
import axiosInstance from "@/lib/axios";
import ErrorHandler from "@/utils/error-handler";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Formik, Form, FormikProps, Field } from "formik";
import { IPayment, ITransaction } from "../types";
import { Payment } from "@/lib/schema";

interface ISubmission {
  paymentId: number;
  paymentProof: string;
}

export default function OnProcess() {
  const [payments, setPayments] = useState<IPayment[]>([]);
  const [rekening, setRekening] = useState<Number | null>(null);

  // Fetch payments for the user (this is analogous to GetPaymentsByUser)
  useEffect(() => {
    const getPayments = async () => {
      try {
        const { data } = await axiosInstance.get("/transaction/payment"); // Adjusted to match the route
        setPayments(data.payments);
        setRekening(data.Rekening);
      } catch (err) {
        ErrorHandler(err);
      }
    };
    getPayments();
  }, []);

  // Handle form submission to upload payment proof (as a string)
  const handlePaymentProofSubmission = async (
    paymentId: number,
    paymentProof: string
  ) => {
    try {
      const { data } = await axiosInstance.post("/transaction/update", {
        paymentProof,
        paymentId,
      });

      Swal.fire({
        icon: "success",
        title: data.message,
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (err) {
      ErrorHandler(err);
    }
  };
  return (
    <div className="my-4">
      {payments.map((payment) => (
        <div
          key={payment.id}
          className="bg-gray-200 p-2 rounded-xl drop-shadow-md flex justify-between items-center my-4"
        >
          {/* Transaction description */}
          <div>
            <h3>Payment Id: {payment.id}</h3>
            <p>Total Payment: Rp {payment.amountPaid}</p>
            <h4>Event(s) :</h4>
            {payment.transactions.map((transaction: ITransaction) => (
              <div key={transaction.id}>
                <p>{transaction.event.name}</p>
                <p>Seats: {transaction.seats}</p>
              </div>
            ))}
          </div>

          {/* Rekening Message */}
          <div>
            <p>
              Please Transfer to BCA :{" "}
              {rekening !== null ? String(rekening) : "Loading..."}
            </p>
          </div>

          {/* Formik Form */}
          <div>
            <Formik
              initialValues={{
                paymentId: payment.id,
                paymentProof: "",
              }}
              validationSchema={Payment}
              onSubmit={async (values) => {
                await handlePaymentProofSubmission(
                  payment.id,
                  values.paymentProof
                );
              }}
            >
              {(props: FormikProps<ISubmission>) => {
                const { values, errors, touched, handleChange } = props;

                return (
                  <Form>
                    <div>
                      <label htmlFor="PaymentProof">
                        Insert Payment Receipt :
                      </label>
                      <Field
                        className="formik-input"
                        types="text"
                        name="paymentProof"
                        onChange={handleChange}
                        value={values.paymentProof}
                      />
                      {touched.paymentProof && errors.paymentProof ? (
                        <div className="text-red-600 h-6">
                          {errors.paymentProof}
                        </div>
                      ) : (
                        <div className="h-6" />
                      )}
                    </div>
                    <button
                      className="mt-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded "
                      type="submit"
                    >
                      Submit Payment
                    </button>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>
      ))}
    </div>
  );
}
