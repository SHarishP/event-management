"use client";
import { Formik, Form, FormikProps } from "formik";
import Swal from "sweetalert2";
import axiosInstance from "@/lib/axios";
import IRegister from "../types";
import Schema from "./schema";
import ErrorHandler from "@/utils/error-handler";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const router = useRouter();

  //
  const register = async (params: IRegister) => {
    try {
      const { data } = await axiosInstance.post("/eo/registration", params);
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
    <div className="px-10 md:px-40 lg:px-60">
      <Formik
        initialValues={{
          name: "",
          email: "",
          password: "",
        }}
        validationSchema={Schema}
        onSubmit={(values) => {
          register(values);
        }}
      >
        {(props: FormikProps<IRegister>) => {
          const { values, errors, touched, handleChange } = props;
          return (
            <Form>
              <div className="py-2">
                <label htmlFor="name" className="block text-base">
                  Name :
                </label>
                <input
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  type="text"
                  name="name"
                  onChange={handleChange}
                  value={values.name}
                />
                {touched.name && errors.name ? (
                  <div className="text-red-600">{errors.name}</div>
                ) : null}
              </div>
              <div className="py-2">
                <label htmlFor="email" className="block text-base">
                  Email :
                </label>
                <input
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  type="text"
                  name="email"
                  onChange={handleChange}
                  value={values.email}
                />
                {touched.email && errors.email ? (
                  <div className="text-red-600">{errors.email}</div>
                ) : null}
              </div>
              <div className="py-2">
                <label htmlFor="password" className="block text-base">
                  Password :
                </label>
                <input
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  type="password"
                  name="password"
                  onChange={handleChange}
                  value={values.password}
                />
                {touched.password && errors.password ? (
                  <div className="text-red-600">{errors.password}</div>
                ) : null}
              </div>
              <button
                className="mt-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded "
                type="submit"
              >
                Register
              </button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
