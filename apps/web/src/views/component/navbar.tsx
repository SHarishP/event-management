"use client";
import { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoginModal from "./LoginModal";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons/faMagnifyingGlass";


export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="flex flex-row justify-between bg-white h-14 items-center mt-6 px-4">
        <div className="flex flex-row items-center">
          <Link href="/">
            <img src="logo" alt="ini Logo" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <button 
          className="md:hidden p-2"
          onClick={toggleMenu}
        >
          <div className="w-6 h-0.5 bg-black mb-1"></div>
          <div className="w-6 h-0.5 bg-black mb-1"></div>
          <div className="w-6 h-0.5 bg-black"></div>
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center">
          <button className="hover:bg-blue-500 mx-4">Find Events</button>
          <button className="hover:bg-blue-500 mx-4">Create Event</button>
          <button className="hover:bg-blue-500 mx-4">Find my Tickets</button>

          <input
            type="text"
            name=""
            id=""
            className="rounded-md bg-gray-300 mx-4"
            placeholder="Search Event..."
          />
          <button className="bg-blue-700 p-1 px-5 text-black rounded-full hover:bg-blue-600">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </div>

        <div className="hidden md:block">
          <button 
            onClick={() => setIsOpen(true)}
            className="hover:bg-blue-500 mx-4"
          >
            Login
          </button>
          <button className="bg-blue-800 p-2 px-5 text-white rounded-full hover:bg-blue-300 mx-4">
            Sign Up
          </button>
          <LoginModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-14 left-0 right-0 bg-white shadow-lg md:hidden z-50">
          <div className="flex flex-col p-4">
            <button className="hover:bg-blue-500 py-2">Find my Tickets</button>
            
            <button 
              onClick={() => setIsOpen(true)}
              className="hover:bg-blue-500 py-2"
            >
              Login
            </button>
            <button className="bg-blue-800 p-2 text-white rounded-full hover:bg-blue-300 my-2">
              Sign Up
            </button>
          </div>
        </div>
      )}
     
    </div>
  );
}
