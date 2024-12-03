"use client";
import axiosInstance from "@/lib/axios";
import ErrorHandler from "@/utils/error-handler";
import { useState, useEffect } from "react";
import { IMyEvents } from "../type";

export default function EventsTable() {
  const [events, setEvents] = useState<IMyEvents[]>([]);

  // Get My Events
  useEffect(() => {
    const getMyEvents = async () => {
      try {
        const { data } = await axiosInstance.get("/event/my-events");
        console.log(data.myEvents);
        setEvents(data.myEvents);
      } catch (err) {
        ErrorHandler(err);
      }
    };
    getMyEvents();
  }, []);
  return (
    <div className="p-4">
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">
                Event Name
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Location
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Total Seats
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Remaining Seats
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Transactions
              </th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">
                  {event.name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {event.location.name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {event.totalSeats}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {event.remainSeats}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <ul className="list-disc pl-4">
                    {event.transaction.map((txn, idx) => (
                      <li key={idx} className="mb-2">
                        <span className="font-semibold">{txn.user.name}</span> (
                        <a
                          href={`mailto:${txn.user.email}`}
                          className="text-blue-500 underline"
                        >
                          {txn.user.email}
                        </a>
                        ): {txn.seats} seats -{" "}
                        {txn.isPaid ? (
                          <span className="text-green-500">Paid</span>
                        ) : (
                          <span className="text-red-500">Unpaid</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
