import React from "react";
import { Link } from "react-router-dom";
import { GoPersonAdd } from "react-icons/go";
import { MdViewList } from "react-icons/md";

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-[#2e2e3a] to-[#3a3a4d] shadow-md">
      <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center">
        <Link
          to="/"
          className="text-white text-2xl  font-extrabold tracking-wide hover:text-gray-300 transition-colors duration-200"
        >
          EmployeeHub
        </Link>
        <nav className="flex flex-col sm:flex-row sm:space-x-6 mt-3 sm:mt-0">
          <Link
            to="/view"
            className="text-gray-200 text-4xl  font-medium no-underline hover:text-white hover:underline transition-all duration-150"
          >
           <MdViewList /> 
          </Link>
          <Link
            to="/employee"
            className="text-gray-200 text-4xl font-medium no-underline hover:text-white hover:underline transition-all duration-150"
          >
            <GoPersonAdd />
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
