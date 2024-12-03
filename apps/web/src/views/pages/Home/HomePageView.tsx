"use client";
import axiosInstance from "@/lib/axios";
import ErrorHandler from "@/utils/error-handler";
import { useState, useEffect } from "react";
import { Formik, Form, FormikProps, Field } from "formik";
import IFilter from "./types";

// Define the structure of an event
interface IEvent {
  id: string;
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

export default function HomePageView() {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [category, setCategory] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);

  //   Get All Events
  useEffect(() => {
    const getAllEvents = async () => {
      try {
        const response = await axiosInstance.get("/event/all-events");
        console.log(response.data.events);
        setEvents(response.data.events);
      } catch (err) {
        ErrorHandler(err);
      }
    };
    getAllEvents();
  }, []);

  //   Get Categories for filter
  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await axiosInstance.get("/event/categories");
        setCategories(
          response.data.categories.map(
            (category: { name: string }) => category.name
          )
        );
      } catch (err) {
        ErrorHandler(err);
      }
    };
    getCategories();
  }, []);

  //   Get Location for filter
  useEffect(() => {
    const getLocations = async () => {
      try {
        const response = await axiosInstance.get("/event/locations");
        setLocations(
          response.data.locations.map(
            (location: { name: string }) => location.name
          )
        );
      } catch (err) {
        ErrorHandler(err);
      }
    };
    getLocations();
  }, []);

  //   Function to get events by filter
  useEffect(() => {
    const getFilteredEvents = async () => {
      try {
        let url = "/event";
        // Add query parameters if any
        if (category || location) {
          url += `?category=${category || ""}&location=${location || ""}`;
        }
        const response = await axiosInstance.get(url);
        setEvents(response.data.events);
      } catch (err) {
        ErrorHandler(err);
      }
    };
    getFilteredEvents();
  }, [category, location]);

  return (
    <div className="mt-16">
      {/* Banner Container */}
      <div className="Banner Container">
        <img
          src="/images/minpro-images02.jpg"
          alt="HomePage-Banner"
          className="object-cover rounded-2xl"
        />
      </div>

      {/* Filter Panel */}
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg mx-4 mt-2">
        <Formik
          initialValues={{
            category: "",
            location: "",
          }}
          onSubmit={(values) => {
            setCategory(values.category);
            setLocation(values.location);
          }}
        >
          {(props: FormikProps<IFilter>) => {
            const { values, handleChange } = props;
            return (
              <Form>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Category Dropdown */}
                  <div className="py-2">
                    <label
                      htmlFor="category"
                      className="block text-white text-base"
                    >
                      Event Category :
                    </label>
                    <Field
                      as="select"
                      name="category"
                      className="formik-input w-full bg-gray-700 text-white border-gray-600 rounded p-2 mt-1"
                      onChange={handleChange}
                      value={values.category}
                    >
                      <option value="">Select a Category</option>
                      {categories.map((category, idx) => (
                        <option key={idx} value={category}>
                          {category}
                        </option>
                      ))}
                    </Field>
                  </div>

                  {/* Location Dropdown */}
                  <div className="py-2">
                    <label
                      htmlFor="location"
                      className="block text-white text-base"
                    >
                      Event Location :
                    </label>
                    <Field
                      as="select"
                      name="location"
                      className="formik-input w-full bg-gray-700 text-white border-gray-600 rounded p-2 mt-1"
                      onChange={handleChange}
                      value={values.location}
                    >
                      <option value="">Select a Location</option>
                      {locations.map((location, idx) => (
                        <option key={idx} value={location}>
                          {location}
                        </option>
                      ))}
                    </Field>
                  </div>
                </div>

                <div className="mt-4 flex justify-center">
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
                  >
                    Filter Events
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>

      {/* Events Panel */}
      <div className="mx-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {events.map((event, index) => (
            <div
              key={index}
              className="relative group overflow-hidden rounded-lg shadow-lg bg-gray-800 h-72 transition-all duration-300"
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110 group-hover:brightness-75"
                style={{ backgroundImage: `url(${event.bannerUrl})` }}
              ></div>

              {/* Event Details */}
              {/* Event Name */}
              <h3 className="absolute top-4 left-4 text-slate-700 text-lg md:text-xl font-bold transition-transform duration-300 group-hover:opacity-0">
                {event.name}
              </h3>
              {/* Start Date */}
              <p className="absolute top-4 right-4 text-slate-700 text-sm md:text-base transition-transform duration-300 group-hover:opacity-0">
                {new Date(event.startDate).toLocaleDateString()}
              </p>
              {/* Location */}
              <p className="absolute bottom-24 left-4 text-slate-700 text-sm md:text-base transition-transform duration-300 group-hover:opacity-0">
                {event.location.name}
              </p>
              {/* Price */}
              <p className="absolute bottom-20 left-4 text-slate-700 text-sm md:text-base font-bold transition-transform duration-300 group-hover:opacity-0">
                Rp {event.price}
              </p>
              {/* Start Time */}
              <p className="absolute bottom-16 left-4 text-slate-700 text-sm md:text-base transition-transform duration-300 group-hover:opacity-0">
                {event.startTime}
              </p>

              {/* Description (Replaces Other Text on Hover) */}
              <p className="absolute inset-0 flex items-center justify-center text-white text-sm md:text-base font-medium opacity-0 transition-opacity duration-300 group-hover:opacity-100 px-4">
                {event.description}
              </p>

              {/* Button (Unaffected by Hover) */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">
                  <a href={`/book?eventId=${event.id}`}>Book Ticket(s)</a>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
