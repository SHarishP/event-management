"use client";
import MyBooks from "./component/mybooks";
import Purchased from "./component/purchased";
import OnProcess from "./component/onprocess";
import { useState } from "react";
export default function MyTicketsView() {
  // State to check which section is active
  const [activeSection, setActiveSection] = useState<string>("My Books");

  return (
    <div className="mt-16 px-4 items-center">
      {/* Page Title */}
      <div className="flex flex-col items-center my-4">
        <h1 className="font-bold text-2xl text-gray-900">My Tickets</h1>
      </div>

      {/* Button */}
      <div className="flex flex-row justify-center items-center gap-4">
        <div>
          <button
            className={`${
              activeSection === "My Books" ? "bg-blue-700" : "bg-blue-500"
            } hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`}
            onClick={() => setActiveSection("My Books")}
          >
            My Books
          </button>
        </div>
        <div>
          <button
            className={`${
              activeSection === "On Process" ? "bg-blue-700" : "bg-blue-500"
            } hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`}
            onClick={() => setActiveSection("On Process")}
          >
            On Process
          </button>
        </div>
        <div>
          <button
            className={`${
              activeSection === "Purchased" ? "bg-blue-700" : "bg-blue-500"
            } hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`}
            onClick={() => setActiveSection("Purchased")}
          >
            Purchased
          </button>
        </div>
      </div>

      {/* Render Active Section */}
      <div className="mt-8">
        {activeSection === "My Books" && <MyBooks />}
        {activeSection === "On Process" && <OnProcess />}
        {activeSection === "Purchased" && <Purchased />}
      </div>
    </div>
  );
}
