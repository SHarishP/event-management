"use client";
import { Formik, Form, FormikProps, Field } from "formik";
import axiosInstance from "@/lib/axios";
import ErrorHandler from "@/utils/error-handler";
import { useRouter } from "next/navigation";
import { deleteCookie, getCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";
import useAuthStore, { IUser } from "@/stores/auth-store";
import { LoginSchema } from "@/lib/schema";

interface ILogin {
  email: string;
  password: string;
}

interface IloginModalProps {
  LoginOpen: boolean;
  LoginClose: () => void;
  Link: string;
}

const HandleLogin = async (onAuthSuccess: (user: IUser | null) => void) => {
  try {
    const access_token = (await getCookie("access_token")) || "";

    if (access_token) {
      const user: IUser = jwtDecode(access_token);
      onAuthSuccess(user);
      console.log(user.avatar);
    }
  } catch (err) {
    deleteCookie("access_token");
    throw err;
  }
};

export default function LoginModal({
  LoginOpen,
  LoginClose,
  Link,
}: IloginModalProps) {
  const { onAuthSuccess, user } = useAuthStore();
  const router = useRouter();
  const login = async (params: ILogin) => {
    try {
      const { data } = await axiosInstance.post("/user/login", params);
      await HandleLogin(onAuthSuccess);
    } catch (err) {
      ErrorHandler(err);
    }
  };

  return (
    <div
      className={`inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${LoginOpen ? "fixed" : "hidden"}`}
      style={{ transition: "transform 0.3s ease, opacity 0.3s ease" }}
    >
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold text-black">Login</h2>
          <button
            onClick={LoginClose}
            className="w-8 h-8 rounded-full text-sm flex items-center justify-center text-gray-500 hover:text-white hover:border hover:border-blue-500 hover:bg-blue-700 ease-in-out duration-200"
          >
            ✕
          </button>
        </div>

        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={LoginSchema}
          onSubmit={(values) => {
            login(values);
          }}
        >
          {(props: FormikProps<ILogin>) => {
            const { values, handleChange } = props;
            return (
              <Form>
                <div>
                  <label htmlFor="email" className="formik-label">
                    Email :
                  </label>
                  <Field
                    className="formik-input"
                    type="text"
                    name="email"
                    onChange={handleChange}
                    values={values.email}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="formik-label">
                    Password :
                  </label>
                  <Field
                    className="formik-input"
                    type="password"
                    name="password"
                    onChange={handleChange}
                    value={values.password}
                  />
                </div>
                <div className="mt-4 text-center">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ease-in-out duration-200"
                    type="submit"
                    onClick={() => {
                      LoginClose();
                    }}
                  >
                    Login
                  </button>
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      Don't have an account?
                      <a
                        href={Link}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Sign up
                      </a>
                    </p>
                  </div>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
}
