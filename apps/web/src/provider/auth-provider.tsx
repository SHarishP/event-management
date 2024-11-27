"use client";
import useAuthStore from "@/stores/auth-store";
import { getCookie } from "cookies-next";
import React, { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";

type Token = {
  email: string;
  name: string;
  role: string;
  avatar: string;
  iat: number;
  exp: number;
};

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { onAuthSuccess, clearAuth } = useAuthStore();

  const checkLogin = async () => {
    try {
      const access_token = await getCookie("access_token");
      if (!access_token) {
        clearAuth(); // Jika tidak ada token, clearAuth
        return;
      }

      // Dekode token jika tersedia
      const token: Token = jwtDecode(access_token);

      // Cek apakah token sudah expired
      if (Date.now() >= token.exp * 1000) {
        Swal.fire({
          icon: "warning",
          title: "Session expired please relogin",
          showConfirmButton: false,
          timer: 2000,
        }).then(() => clearAuth());
      } else {
        onAuthSuccess({
          name: token.name,
          email: token.email,
          role: token.role,
          avatar: token.avatar,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      checkLogin();
    }
  }, []);
  return <>{children}</>;
}
