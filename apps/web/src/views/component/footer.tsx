"use client";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import LoginModal from "./login/login";
import { useState } from "react";
import useAuthStore from "@/stores/auth-store";
import { useRouter } from "next/navigation";

export default function Footer() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [loginOpen, setLoginOpen] = useState<boolean>(false);
  const loginMenu = () => {
    setLoginOpen(true);
  };

  return (
    <footer className="bg-[#21003A] text-gray-300 py-12 w-full">
      <div className="px-8 lg:px-16">
        <div className="flex flex-wrap justify-between">
          {/* Web profile short */}
          <div className="w-full md:w-1/3 mb-8 md:mb-0">
            <h2 className="text-3xl font-bold text-white mb-4">EventMinpro.</h2>
            <p className="mb-4">
              Purchase with us and we will ensure a seamless experience for you.
              What are you waiting for? Book your events on Nama-web-event
              today!
            </p>
          </div>

          {/*Legal Column  */}
          <div className="w-full md:w-1/4">
            <h3 className="text-white font-semibold mb-4">MORE FROM US</h3>
            <ul>
              <li>
                <a href="#" className="hover:text-white">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Seller Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Terms and Conditions
                </a>
              </li>
              <li>
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      if (user) {
                        router.push("/create-event");
                      } else {
                        loginMenu();
                      }
                    }}
                  >
                    Create Event Here!
                  </button>
                  <LoginModal
                    LoginOpen={loginOpen}
                    LoginClose={() => setLoginOpen(false)}
                    Link="/eo-regist"
                  />
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex justify-between items-center">
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-white">
              <FaInstagram size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <FaFacebook size={20} />
            </a>
          </div>
          <p className="text-sm text-gray-500">
            &copy; 2024 Eventsu. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
