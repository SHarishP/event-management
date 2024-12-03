"use client";
import { Formik, Form, FormikProps, Field } from "formik";
import Swal from "sweetalert2";
import axiosInstance from "@/lib/axios";
import IRegister from "../types";
import { RegisterSchema } from "@/lib/schema";
import ErrorHandler from "@/utils/error-handler";
import { useRouter } from "next/navigation";
import { useState } from "react";
import debounce from "lodash.debounce";

export function EoRegist() {
  const router = useRouter();

  //
  const register = async (params: IRegister) => {
    try {
      const { data } = await axiosInstance.post("/user/eo-regist", params);
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
          referralCode: "",
        }}
        validationSchema={RegisterSchema}
        onSubmit={(values) => {
          register(values);
        }}
      >
        {(props: FormikProps<IRegister>) => {
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
                <label htmlFor="email" className="formik-label">
                  Email :
                </label>
                <div>
                  <Field
                    className="formik-input"
                    type="text"
                    name="email"
                    onChange={handleChange}
                    value={values.email}
                  />
                  {touched.email && errors.email ? (
                    <div className="text-red-600 h-6">{errors.email}</div>
                  ) : (
                    <div className="h-6" />
                  )}
                </div>
              </div>

              <div className="py-2">
                <label htmlFor="password" className="block text-base">
                  Password :
                </label>
                <div>
                  <Field
                    className="formik-input"
                    type="password"
                    name="password"
                    onChange={handleChange}
                    value={values.password}
                  />
                  {touched.password && errors.password ? (
                    <div className="text-red-600 h-6">{errors.password}</div>
                  ) : (
                    <div className="h-6" />
                  )}
                </div>
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

export function CustRegist() {
  const router = useRouter();

  // To check and send to BE if referral code is valid
  const [refValid, setRefValid] = useState<string | null>(null);
  const validateRefCode = debounce(async (refCode: string) => {
    if (!refCode) {
      setRefValid(null);
      return;
    }
    try {
      const { data } = await axiosInstance.post("/user/referral", {
        refCode,
      });
      setRefValid(data.message);
    } catch {
      setRefValid("Invalid referral code!");
    }
  });

  //
  const register = async (params: IRegister) => {
    try {
      const { data } = await axiosInstance.post("/user/cust-regist", params);
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
          referralCode: "",
        }}
        validationSchema={RegisterSchema}
        onSubmit={(values) => {
          register(values);
        }}
      >
        {(props: FormikProps<IRegister>) => {
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
                <label htmlFor="email" className="formik-label">
                  Email :
                </label>
                <div>
                  <Field
                    className="formik-input"
                    type="text"
                    name="email"
                    onChange={handleChange}
                    value={values.email}
                  />
                  {touched.email && errors.email ? (
                    <div className="text-red-600 h-6">{errors.email}</div>
                  ) : (
                    <div className="h-6" />
                  )}
                </div>
              </div>

              <div className="py-2">
                <label htmlFor="password" className="block text-base">
                  Password :
                </label>
                <div>
                  <Field
                    className="formik-input"
                    type="password"
                    name="password"
                    onChange={handleChange}
                    value={values.password}
                  />
                  {touched.password && errors.password ? (
                    <div className="text-red-600 h-6">{errors.password}</div>
                  ) : (
                    <div className="h-6" />
                  )}
                </div>
              </div>

              <div className="py-2">
                <label htmlFor="referralCode" className="formik-label">
                  Referral Code (Optional) :
                </label>
                <div>
                  <Field
                    className="formik-input"
                    type="text"
                    name="referralCode"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      handleChange(e);
                      validateRefCode(e.target.value); // Call backend validation
                    }}
                    value={values.referralCode}
                  />
                  {refValid !== null ? (
                    <div>{refValid}</div>
                  ) : (
                    <div className="h-6" />
                  )}
                </div>
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
