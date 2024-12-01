"use client";
import { Formik, Form, FormikProps, Field } from "formik";
import Swal from "sweetalert2";
import axiosInstance from "@/lib/axios";
import IEvent from "../types";
import { EventSchema } from "@/lib/schema";
import ErrorHandler from "@/utils/error-handler";
import { useRouter } from "next/navigation";

export function EventForm() {
  const router = useRouter();

  const submitEvent = async (params: IEvent) => {
    try {
      const { data } = await axiosInstance.post("/event/create-event", params);
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
        }}
        validationSchema={EventSchema}
        onSubmit={(values) => {
          submitEvent(values);
        }}
      >
        {(props: FormikProps<IEvent>) => {
          const { values, errors, touched, handleChange } = props;
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
                    className="formik-input"
                    type="text"
                    name="location"
                    onChange={handleChange}
                    value={values.location}
                  />
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
                    className="formik-input"
                    type="text"
                    name="category"
                    onChange={handleChange}
                    value={values.category}
                  />
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
