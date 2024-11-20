import React from 'react';
import { FaFacebook, FaInstagram } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#21003A] text-gray-300 py-12 w-full">
      <div className="px-8 lg:px-16">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/3 mb-8 md:mb-0">
            <h2 className="text-3xl font-bold text-white mb-4">Eventsu.</h2>
            <p className="mb-4">
              Purchase with us and we will ensure a seamless experience for you.
              What are you waiting for? Book your events on Eventsu today!
            </p>
            {/* <div className="flex space-x-4">
              <img src="/path/to/visa.svg" alt="Visa" className="h-6" />
              <img
                src="/path/to/mastercard.svg"
                alt="MasterCard"
                className="h-6"
              />
              <img src="/path/to/gpay.svg" alt="Google Pay" className="h-6" />
              <img
                src="/path/to/applepay.svg"
                alt="Apple Pay"
                className="h-6"
              />
              <img src="/path/to/grabpay.svg" alt="Grab Pay" className="h-6" />
              <img src="/path/to/paynow.svg" alt="PayNow" className="h-6" />
            </div> */}
            {/* <p className="mt-4">
              See our <span className="font-semibold">140 reviews</span> on{' '}
              <a href="#" className="text-green-500 font-semibold">
                Trustpilot
              </a>
            </p> */}
          </div>

          <div className="w-full md:w-1/4 mb-8 md:mb-0">
            <h3 className="text-white font-semibold mb-4">COMPANY</h3>
            <ul>
              <li>
                <a href="#" className="hover:text-white">
                  Log In
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Sign Up
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Create Event
                </a>
              </li>
            </ul>
          </div>
          {/* <div className="w-full md:w-1/4 mb-8 md:mb-0">
            <h3 className="text-white font-semibold mb-4">HELP & SUPPORT</h3>
            <ul>
              <li>
                <a href="#" className="hover:text-white">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Support
                </a>
              </li>
            </ul>
          </div> */}
          <div className="w-full md:w-1/4">
            <h3 className="text-white font-semibold mb-4">LEGAL</h3>
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
};

export default Footer;
