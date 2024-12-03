"use client";
import { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoginModal from "./login/login";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons/faMagnifyingGlass";
import useAuthStore from "@/stores/auth-store";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [burgerOpen, setBurgerOpen] = useState<boolean>(false);
  const [loginOpen, setLoginOpen] = useState<boolean>(false);
  const { user, clearAuth } = useAuthStore();
  const router = useRouter();

  const toggleMenu = () => {
    setBurgerOpen(!burgerOpen);
  };

  const userSlug = (user: string) => {
    return user.replace(" ", "-").toLowerCase();
  };

  const renderContentBasedRole = () => {
    if (user) {
      if (user.role === "eo") {
        return (
          <div className="hidden md:flex gap-4 items-center basis-4/5">
            <div className="items-center w-3/4 text-center">
              <button className="hover:bg-blue-500 mx-4">
                <a href="/create-event">Create Event</a>
              </button>
              <button className="hover:bg-blue-500 mx-4">
                <a href="/my-events">My Events</a>
              </button>
              <button className="hover:bg-blue-500 mx-4">
                <a href={`/profile/${userSlug(user.name)}`}>Profile</a>
              </button>
            </div>
            <div className="w-1/4 flex justify-end items-center gap-2">
              <p>Welcome, {user.name}</p>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded "
                type="submit"
                onClick={() => {
                  clearAuth();
                  router.push("/");
                }}
              >
                Logout
              </button>
            </div>
          </div>
        );
      } else if (user.role === "cust") {
        return (
          <div className="hidden md:flex gap-4 items-center basis-4/5">
            <div className="items-center w-3/4 text-center">
              <button className="hover:bg-blue-500 mx-4">
                <a href="/my-tickets">My Tickets</a>
              </button>
              <button className="hover:bg-blue-500 mx-4">
                <a href={`/profile/${userSlug(user.name)}`}>Profile</a>
              </button>
              <input
                type="text"
                name=""
                id=""
                className="rounded-2xl bg-gray-300 mx-2 p-1.5 border "
                placeholder="Search Event..."
              />
              <button className="bg-blue-700 text-black h-10 w-10 rounded-full hover:bg-blue-600">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </button>
            </div>
            <div className="w-1/4 flex justify-end items-center gap-2">
              <p>Welcome, {user.name}</p>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded "
                type="submit"
                onClick={() => {
                  clearAuth();
                  router.push("/");
                }}
              >
                Logout
              </button>
            </div>
          </div>
        );
      }
    } else {
      return (
        <div className="hidden md:flex basis-4/5 items-center">
          <div className="items-center w-3/4 text-center">
            <input
              type="text"
              name=""
              id=""
              className="rounded-2xl bg-gray-300 mx-2 p-1.5 border "
              placeholder="Search Event..."
            />
            <button className="bg-blue-700 text-black h-10 w-10 rounded-full hover:bg-blue-600">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          </div>
          <div className="w-1/4 flex justify-end">
            <button
              onClick={() => {
                setLoginOpen(true);
              }}
              className="hover:bg-blue-500"
            >
              Login
            </button>
            <button
              className="bg-blue-800 p-2 px-5 text-white rounded-full hover:bg-blue-300 mx-4"
              onClick={() => router.push("/cust-regist")}
            >
              Sign Up
            </button>
            <LoginModal
              LoginOpen={loginOpen}
              LoginClose={() => setLoginOpen(false)}
              Link="/cust-regist"
            />
          </div>
        </div>
      );
    }
  };

  const renderContentBasedRoleMobile = () => {
    if (user) {
      if (user.role === "eo") {
        return (
          <div className="flex flex-col p-4 text-center gap-4">
            <p>Welcome, {user.name}!</p>
            <button className="hover:bg-blue-500 py-2">
              <a href="/create-event">Create Event</a>
            </button>
            <button className="hover:bg-blue-500 mx-4">
              <a href="/my-events">My Events</a>
            </button>
            <button className="hover:bg-blue-500 mx-4">
              <a href={`/profile/${userSlug(user.name)}`}>Profile</a>
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded "
              type="submit"
              onClick={() => {
                clearAuth();
                router.push("/");
              }}
            >
              Logout
            </button>
          </div>
        );
      } else if (user.role == "cust") {
        return (
          <div className="flex flex-col p-4 text-center gap-4">
            <p>Welcome, {user.name}!</p>
            <button className="hover:bg-blue-500 py-2">My Tickets</button>
            <button className="hover:bg-blue-500 mx-4">
              <a href={`/profile/${userSlug(user.name)}`}>Profile</a>
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded "
              type="submit"
              onClick={() => {
                clearAuth();
                router.push("/");
              }}
            >
              Logout
            </button>
          </div>
        );
      }
    } else {
      return (
        <div className="flex flex-col p-4 gap-4">
          <button
            onClick={() => {
              setLoginOpen(true);
            }}
            className="hover:bg-blue-500 py-2"
          >
            Login
          </button>
          <LoginModal
            LoginOpen={loginOpen}
            LoginClose={() => setLoginOpen(false)}
            Link="/cust-regist"
          />
          <button
            className="bg-blue-800 p-2 text-white rounded-full hover:bg-blue-300 my-2"
            onClick={() => {
              router.push("/cust-regist");
              toggleMenu();
            }}
          >
            Sign Up
          </button>
        </div>
      );
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="flex flex-row justify-between bg-white items-center my-2 px-4">
        <div className="items-center w-1/5">
          <Link href="/">
            <img src="logo" alt="ini Logo" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden p-2" onClick={toggleMenu}>
          <div className="w-6 h-0.5 bg-black mb-1"></div>
          <div className="w-6 h-0.5 bg-black mb-1"></div>
          <div className="w-6 h-0.5 bg-black"></div>
        </button>
        {renderContentBasedRole()}
      </div>

      {/* Mobile Menu */}
      <div className="relative">
        <div
          className={`md:hidden w-full bg-white shadow-lg z-50 ${burgerOpen ? "block" : "hidden"}`}
        >
          {renderContentBasedRoleMobile()}
        </div>
      </div>
    </div>
  );
}
