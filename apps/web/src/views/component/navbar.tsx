"use client";
import { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex flex-row justify-between bg-white h-14 items-center mt-6">
      <div className="flex flex-row items-center">
        <Link href="/">
          <img src="logo" alt="ini Logo" />
        </Link>
      </div>

      <div>
        <button className="hover:bg-blue-500 mx-4">Find Events</button>
        <button className="hover:bg-blue-500 mx-4">Create Event</button>
        <button className="hover:bg-blue-500 mx-4">Find my Tickets</button>

        <input
          type="text"
          name=""
          id=""
          className="rounded-md bg-gray-300 mx-4"
          placeholder="Seacrh Event..."
        />
        <button className="bg-blue-700 p-1 px-5 text-black rounded-full hover:bg-blue-600">
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>

      <div>
        <button className="hover:bg-blue-500 mx-4">Login</button>
        <button className="bg-blue-800 p-2 px-5 text-white rounded-full hover:bg-blue-300 mx-4">
          <a href="/signup">Sign Up</a>
        </button>
      </div>
    </div>
  );
}
