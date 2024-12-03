"use client";
import { Formik, Form, FormikProps, Field } from "formik";
import Swal from "sweetalert2";
import axiosInstance from "@/lib/axios";
import IEvent from "../types";
import { EventSchema } from "@/lib/schema";
import ErrorHandler from "@/utils/error-handler";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function EventForm() {
  const router = useRouter();
  const [categories, setCategories] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);

  // Get categories from the API
  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await axiosInstance.get("/event/categories");
        console.log(
          response.data.categories.map(
            (category: { name: string }) => category.name
          )
        );
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

  // Get locations from the API
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

  const submitEvent = async (values: IEvent, { setSubmitting }: any) => {
    try {
      const formData = new FormData();
      // Add form data values
      formData.append("name", values.name);
      formData.append("price", values.price.toString());
      formData.append("startDate", values.startDate);
      formData.append("startTime", values.startTime);
      formData.append("location", values.location);
      formData.append("category", values.category);
      formData.append("description", values.description);
      formData.append("totalSeats", values.totalSeats.toString());
      // Add the banner file if it exists
      if (values.file) {
        formData.append("file", values.file);
      }

      const { data } = await axiosInstance.post(
        "/event/create-event",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(data);

      Swal.fire({
        icon: "success",
        title: data.message,
        showConfirmButton: false,
        timer: 2000,
      }).then(() => router.push("/"));
    } catch (err) {
      console.log(err);
      ErrorHandler(err);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div>
      <Formik
        initialValues={{
          name: "",
          price: 0,
          startDate: "",
          startTime: "",
          location: "",
          category: "",
          description: "",
          file: "",
          totalSeats: 0,
        }}
        validationSchema={EventSchema}
        onSubmit={(values, { setSubmitting }) => {
          submitEvent(values, { setSubmitting });
        }}
      >
        {(props: FormikProps<IEvent>) => {
          const { values, errors, touched, handleChange, setFieldValue } =
            props;
          return (
            <Form>
              <div className="py-2">
                <label htmlFor="name" className="formik-label">
                  Name :
                </label>
                <div className="">
                  <Field
                    className="formik-input"
                    type="text"
                    name="name"
                    onChange={handleChange}
                    value={values.name}
                  />
                  {touched.name && errors.name ? (
                    <div className="text-red-600 h-6">{errors.name}</div>
                  ) : (
                    <div className="h-6" />
                  )}
                </div>
              </div>

              <div className="py-2">
                <label htmlFor="price" className="formik-label">
                  Event Price :
                </label>
                <div>
                  <Field
                    className="formik-input"
                    type="number"
                    name="price"
                    onChange={handleChange}
                    value={values.price}
                  />
                  {touched.price && errors.price ? (
                    <div className="text-red-600 h-6">{errors.price}</div>
                  ) : (
                    <div className="h-6" />
                  )}
                </div>
              </div>

              <div className="py-2">
                <label htmlFor="totalSeats" className="formik-label">
                  Seat Available :
                </label>
                <div>
                  <Field
                    className="formik-input"
                    type="number"
                    name="totalSeats"
                    onChange={handleChange}
                    value={values.totalSeats}
                  />
                  {touched.totalSeats && errors.totalSeats ? (
                    <div className="text-red-600 h-6">{errors.totalSeats}</div>
                  ) : (
                    <div className="h-6" />
                  )}
                </div>
              </div>

              <div className="py-2">
                <label htmlFor="startDate" className="block text-base">
                  Event Date :
                </label>
                <div>
                  <Field
                    className="formik-input"
                    type="date"
                    name="startDate"
                    onChange={handleChange}
                    value={values.startDate}
                  />
                  {touched.startDate && errors.startDate ? (
                    <div className="text-red-600 h-6">{errors.startDate}</div>
                  ) : (
                    <div className="h-6" />
                  )}
                </div>
              </div>

              <div className="py-2">
                <label htmlFor="startTime" className="block text-base">
                  Event Time :
                </label>
                <div>
                  <Field
                    className="formik-input"
                    type="time"
                    name="startTime"
                    onChange={handleChange}
                    value={values.startTime}
                  />
                  {touched.startTime && errors.startTime ? (
                    <div className="text-red-600 h-6">{errors.startTime}</div>
                  ) : (
                    <div className="h-6" />
                  )}
                </div>
              </div>

              <div className="py-2">
                <label htmlFor="location" className="block text-base">
                  Event Location :
                </label>
                <div>
                  <Field
                    as="select"
                    name="location"
                    className="formik-input"
                    onChange={handleChange}
                    value={values.location}
                    placholder="Select a Location"
                  >
                    <option value="">Select a Location</option>
                    {locations.map((location, idx) => {
                      return (
                        <option key={idx} value={location}>
                          {location}
                        </option>
                      );
                    })}
                  </Field>
                  {touched.location && errors.location ? (
                    <div className="text-red-600 h-6">{errors.location}</div>
                  ) : (
                    <div className="h-6" />
                  )}
                </div>
              </div>

              <div className="py-2">
                <label htmlFor="category" className="block text-base">
                  Event Category :
                </label>
                <div>
                  <Field
                    as="select"
                    name="category"
                    className="formik-input"
                    onChange={handleChange}
                    value={values.category}
                  >
                    <option value="">Select a Category</option>
                    {categories.map((category, idx) => {
                      return (
                        <option key={idx} value={category}>
                          {category}
                        </option>
                      );
                    })}
                  </Field>
                  {touched.category && errors.category ? (
                    <div className="text-red-600 h-6">{errors.category}</div>
                  ) : (
                    <div className="h-6" />
                  )}
                </div>
              </div>

              <div className="py-2">
                <label htmlFor="description" className="block text-base">
                  Event Description :
                </label>
                <div>
                  <Field
                    className="formik-input"
                    type="text"
                    name="description"
                    onChange={handleChange}
                    value={values.description}
                  />
                  <div className="h-6" />
                </div>
              </div>

              <div className="py-2">
                <label htmlFor="file" className="block text-base">
                  Event Banner :
                </label>
                <input
                  type="file"
                  name="file"
                  onChange={(event) =>
                    setFieldValue(
                      "file",
                      event.currentTarget.files?.[0] || null
                    )
                  } // Update file in Formik state
                />
                {touched.file && errors.file ? (
                  <div className="text-red-600 h-6">{errors.file}</div>
                ) : (
                  <div className="h-6" />
                )}
              </div>
              <button
                className="mt-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded "
                type="submit"
              >
                Create
              </button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
