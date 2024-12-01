"use client";
import axiosInstance from "@/lib/axios";
import ErrorHandler from "@/utils/error-handler";
import { useState, useEffect } from "react";
import { Formik, Form, FormikProps, Field } from "formik";
import IFilter from "./types";

// Define the structure of an event
interface IEvent {
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
      <div>
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
                <div className="py-2">
                  <label htmlFor="category" className="block text-base">
                    Event Category :
                  </label>
                  <Field
                    as="select"
                    name="category"
                    className="formik-input"
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

                <div className="py-2">
                  <label htmlFor="location" className="block text-base">
                    Event Location :
                  </label>
                  <Field
                    as="select"
                    name="location"
                    className="formik-input"
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

                <button
                  type="submit"
                  className="mt-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Filter Events
                </button>
              </Form>
            );
          }}
        </Formik>
      </div>

      {/* Events Panel */}
      <div className="mx-auto p-4">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {events.map((event, index) => (
            <div
              key={index}
              className="bg-[#000000] py-[1em] px-[1em] rounded-[10%] md:mt-[5em] md:mb-[5em]"
            >
              <div className="py-4 px-8 bg-[#04020a] rounded-[10%] mt-4">
                <img
                  src={`/images/${event.banner}`} // Dynamically set the banner image
                  width={90}
                  height={"100%"}
                  className="w-[80px] md:w-[150px]"
                  alt={event.name}
                />
              </div>
              <h3 className="text-white text-center mt-4 px-2 text-2xl font-bold">
                {event.name} {/* Display the event name */}
              </h3>
              <p className="text-white text-center mt-2">{event.description}</p>{" "}
              {/* Display event description */}
              <p className="text-white text-center mt-2">
                Location: {event.location.name}
              </p>{" "}
              {/* Display location */}
              <p className="text-white text-center mt-2">
                Price: Rp {event.price}
              </p>{" "}
              {/* Display event price */}
              <p className="text-white text-center mt-2">
                Start Date: {new Date(event.startDate).toLocaleDateString()}
              </p>{" "}
              {/* Format and display start date */}
              <p className="text-white text-center mt-2">
                Start Time: {event.startTime}
              </p>{" "}
              {/* Display start time */}
              <button className="border-1 bg-[#28218b] font-bold text-white py-2 px-5 rounded-3xl mb-[4em] md:mb-[1em]">
                Pilih Event
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
