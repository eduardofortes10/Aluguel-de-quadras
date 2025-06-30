import React, { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="relative bg-white shadow dark:bg-gray-800">
      <div className="container px-6 py-4 mx-auto">
        <div className="lg:flex lg:items-center lg:justify-between">
          <div className="flex items-center justify-between">
            <a href="#">
              <img
                className="w-auto h-6 sm:h-7"
                src="https://merakiui.com/images/full-logo.svg"
                alt="Logo"
              />
            </a>
            {/* Botão mobile */} 
            <div className="flex lg:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-500 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 focus:outline-none"
                aria-label="Toggle Menu"
              >
                {isOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 8h16M4 16h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Menu mobile + desktop */}
          <div
            className={`${
              isOpen
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-full lg:opacity-100 lg:translate-x-0"
            } absolute inset-x-0 z-20 w-full px-6 py-4 transition-all duration-300 ease-in-out bg-white dark:bg-gray-800 lg:mt-0 lg:p-0 lg:top-0 lg:relative lg:bg-transparent lg:w-auto lg:flex lg:items-center`}
          >
            <div className="flex flex-col -mx-6 lg:flex-row lg:items-center lg:mx-8">
              <a href="#" className="nav-link">Join Slack</a>
              <a href="#" className="nav-link">Browse Topics</a>
              <a href="#" className="nav-link">Random Item</a>
              <a href="#" className="nav-link">Experts</a>
            </div>

            <div className="flex items-center mt-4 lg:mt-0">
              <button className="hidden mx-4 text-gray-600 dark:text-gray-200 hover:text-gray-700 dark:hover:text-gray-400 focus:outline-none">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    d="M15 17H20L18.6 15.6C18.2 15.2 18 14.7 18 14.2V11C18 8.4 16.3 6.2 14 5.3V5C14 3.9 13.1 3 12 3C10.9 3 10 3.9 10 5V5.3C7.7 6.2 6 8.4 6 11V14.2C6 14.7 5.8 15.2 5.4 15.6L4 17H9V18C9 19.7 10.3 21 12 21C13.7 21 15 19.7 15 18V17Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <button type="button" className="flex items-center focus:outline-none">
                <div className="w-8 h-8 overflow-hidden border-2 border-gray-400 rounded-full">
                  <img
                    src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=334&q=80"
                    className="object-cover w-full h-full"
                    alt="avatar"
                  />
                </div>
                <h3 className="mx-2 text-gray-700 dark:text-gray-200 lg:hidden">Khatab wedaa</h3>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
