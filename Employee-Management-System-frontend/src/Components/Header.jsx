import React from "react";
import { Link, useLocation } from "react-router-dom";
import { GoPersonAdd } from "react-icons/go";
import { MdViewList } from "react-icons/md";

const Header = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? "text-blue-400" : "text-gray-300 hover:text-white";
  };

  return (
    <header className="bg-gray-900 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center">
        <Link
          to="/"
          className="text-white text-2xl font-bold tracking-tight hover:text-blue-400 transition-colors duration-200 flex items-center gap-2"
        >
          <span className="bg-blue-600 text-white p-1 rounded-md text-sm font-bold">EMS</span>
          EmployeeHub
        </Link>
        <nav className="flex space-x-8 mt-4 sm:mt-0 items-center">
          <Link
            to="/view"
            className={`flex items-center gap-2 text-lg font-medium transition-colors duration-200 ${isActive('/view')}`}
            title="View Employees"
          >
            <MdViewList className="text-xl" />
            <span className="hidden sm:inline">Employees</span>
          </Link>
          <Link
            to="/employee"
            className={`flex items-center gap-2 text-lg font-medium transition-colors duration-200 ${isActive('/employee')}`}
            title="Add Employee"
          >
            <GoPersonAdd className="text-xl" />
            <span className="hidden sm:inline">Add New</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
