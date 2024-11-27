"use client";
import useAuthStore from "@/stores/auth-store";
import AvatarForm from "./component/avatar-uploader";
import axiosInstance from "@/lib/axios";
import { useEffect, useState } from "react";

export default function ProfileView() {
  const { user } = useAuthStore();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const HandleAvatarUrl = async () => {
    try {
      const response = await axiosInstance.get(
        `/user/avatar?email=${user?.email}`
      );
      console.log(response.data);
      return response.data;
    } catch (err) {
      console.log(err);
      return null;
    }
  };
  useEffect(() => {
    if (user?.email) {
      HandleAvatarUrl().then((url) => {
        setAvatarUrl(url); // Menyimpan URL avatar ke state
      });
    }
  }, [user?.email]);

  return (
    <div className="mt-20 mx-4 mb-4">
      {user && (
        <div>
          {/* Menampilkan Avatar */}
          <div className="flex items-center">
            {avatarUrl && (
              <img
                src={avatarUrl} // Ganti dengan path yang sesuai
                alt="User  Avatar"
                className="w-16 h-16 rounded-full" // Sesuaikan ukuran dan gaya sesuai kebutuhan
              />
            )}
            {!avatarUrl && (
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-500">No Avatar</span>
              </div>
            )}
            <p className="ml-4">{user.name}</p>
          </div>
          <AvatarForm />
        </div>
      )}
    </div>
  );
}
