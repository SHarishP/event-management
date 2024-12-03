"use client";
import { Formik, Form, FormikProps, Field } from "formik";
import Swal from "sweetalert2";
import axiosInstance from "@/lib/axios";
import ErrorHandler from "@/utils/error-handler";
import { BookSchema } from "@/lib/schema";
import { useRouter } from "next/navigation";

interface IProps {
  eventId: number;
}
interface IBook {
  seats: number;
  usePoints: number;
}
export default function TicketForm({ eventId }: IProps) {
  const router = useRouter();

  const handleSubmit = async (values: IBook) => {
    try {
      const { data } = await axiosInstance.post("/transaction/checkout", {
        eventId,
        seats: values.seats,
        usePoints: values.usePoints,
      });

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
          seats: 1,
          usePoints: 0,
        }}
        validationSchema={BookSchema}
        onSubmit={handleSubmit}
      >
        {(props: FormikProps<IBook>) => {
          const { values, handleChange } = props;
          return (
            <Form>
              <div className="py-2">
                <label htmlFor="seats" className="formik-label">
                  Seats :
                </label>
                <Field
                  className="formik-input"
                  type="number"
                  name="seats"
                  min="1"
                  onChange={handleChange}
                  value={values.seats}
                />
              </div>

              <div className="py-2">
                <label htmlFor="usePoints" className="formik-label">
                  Use Points :
                </label>
                <Field
                  className="formik-input"
                  type="number"
                  name="usePoints"
                  min="0"
                  onChange={handleChange}
                  value={values.usePoints}
                />
              </div>
              <button
                type="submit"
                className="mt-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded "
              >
                Book Ticket
              </button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
