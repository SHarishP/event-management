"use client";
import axiosInstance from "@/lib/axios";
import ErrorHandler from "@/utils/error-handler";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export default function Page({ params }: { params: { token: string } }) {
  const router = useRouter();
  const verifyUser = async () => {
    try {
      const { token } = await params;
      console.log(token);
      const { data } = await axiosInstance.get("/user/verify", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.fire({
        icon: "success",
        title: data.message,
        showConfirmButton: false,
        timer: 2000,
      }).then(() => router.push("/"));
    } catch (err) {
      ErrorHandler(err);
    }
  };
  return (
    <div>
      <div className="mx-20 my-20 bg-slate-200 px-4 py-4 text-center rounded-xl shadow-md">
        <h1 className="font-bold text-2xl p-1">
          Thank you for joining with us!
        </h1>
        <p className="p-1">
          Please click the button below to verify your account!
        </p>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white p-1 font-bold py-2 px-4 rounded duration-300"
          onClick={() => verifyUser()}
        >
          Verify my Account
        </button>
      </div>
    </div>
  );
}
