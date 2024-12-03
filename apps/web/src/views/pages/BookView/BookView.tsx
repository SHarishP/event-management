"use client";
import { useSearchParams } from "next/navigation";
import axiosInstance from "@/lib/axios";
import ErrorHandler from "@/utils/error-handler";
import { useState, useEffect } from "react";
import useAuthStore from "@/stores/auth-store";
import TicketForm from "./component/ticket-form";

// Define the structure of an event
interface IEvent {
  id: number;
  name: string;
  createdBy: {
    name: string;
  };
  price: number;
  startDate: string;
  startTime: string;
  location: {
    name: string;
  };
  description: string;
  banner: string;
  totalSeats: number;
  remainSeats: number;
  bannerUrl: string;
}

export default function BookView() {
  const { user } = useAuthStore();
  const searchParams = useSearchParams();
  const eventId = searchParams.get("eventId");
  const [event, setEvent] = useState<IEvent>();
  //   Get Event
  const getEvent = async () => {
    try {
      const response = await axiosInstance.get(
        `/event/book?eventId=${eventId}`
      );
      setEvent(response.data.event);
    } catch (err) {
      ErrorHandler(err);
    }
  };

  useEffect(() => {
    getEvent();
  }, [eventId]);
  return (
    <div className="mt-16 mx-auto px-4 mb-4 max-w-7xl">
      <div className="flex flex-col items-center my-4">
        <h1 className="font-bold text-2xl text-gray-900">Book Your Ticket</h1>
      </div>

      {event ? (
        <div className="grid grid-cols-1 gap-6 bg-gray-100 p-4 rounded-xl shadow-lg">
          {/* Banner and Event Details */}
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Event Banner */}
            <div className="flex-shrink-0 w-full md:w-1/3">
              <img
                src={event.bannerUrl}
                alt={event.name}
                className="w-full h-auto rounded-lg shadow-md"
              />
            </div>

            {/* Event Information */}
            <div className="space-y-4 flex-1">
              <h2 className="text-2xl font-bold text-gray-800">{event.name}</h2>
              <p className="text-lg text-gray-700">
                <strong>Price: </strong> Rp {event.price.toLocaleString()}
              </p>
              <p className="text-lg text-gray-700">
                <strong>Date: </strong>
                {new Date(event.startDate).toLocaleDateString()}
              </p>
              <p className="text-lg text-gray-700">
                <strong>Time: </strong> {event.startTime}
              </p>
              <p className="text-lg text-gray-700">
                <strong>Location: </strong> {event.location.name}
              </p>
              <p className="text-lg text-gray-700">
                <strong>Remaining Seats: </strong> {event.remainSeats}/
                {event.totalSeats}
              </p>
            </div>

            {/* Form */}
            <div className="bg-blue-200 p-6 rounded-xl">
              <TicketForm eventId={event.id} />
              <button className="mt-5 w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg">
                <a href="/">Cancel</a>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading event details...</p>
      )}
    </div>
  );
}
