"use client";
import axiosInstance from "@/lib/axios";
import ErrorHandler from "@/utils/error-handler";
import { useState, useEffect } from "react";
import { ITransactions } from "../types";
import Swal from "sweetalert2";
import { Formik, Form, FormikProps } from "formik";
import { Transaction } from "@/lib/schema";
export default function Purchased() {
  const [myEvents, setMyEvents] = useState<ITransactions[]>([]);
  // Get AllEvents that has been paid
  useEffect(() => {
    const getAllBooked = async () => {
      try {
        const { data } = await axiosInstance.get("/transaction/done");
        setMyEvents(data.transactions);
        console.log(data.transactions);
      } catch (err) {
        ErrorHandler(err);
      }
    };
    getAllBooked();
  }, []);

  return (
    <div className="my-4">
      {myEvents.map((transaction) => (
        <div
          key={transaction.id}
          className="bg-gray-200 p-2 rounded-xl drop-shadow-md flex justify-between items-center my-4"
        >
          {/* Event name */}
          <div className="flex-1 text-center">
            <h3>{transaction.event.name}</h3>
            <p>{transaction.event.location.name}</p>
            <p>{transaction.event.startDate}</p>
            <p>{transaction.event.startTime}</p>
            <p>My Ticket : {transaction.seats} ticket(s)</p>
          </div>

          {/* Delete Transaction */}
        </div>
      ))}
    </div>
  );
}
