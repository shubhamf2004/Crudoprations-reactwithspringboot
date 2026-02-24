import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GoPersonAdd } from "react-icons/go";
import { MdViewList, MdMenu, MdClose, MdLogout, MdBusiness } from "react-icons/md";
import { useAuth } from "../../Context/AuthContext";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Helper for active link styling (Pill shape)
    const getLinkClass = (path) => {
        return location.pathname === path
            ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20 px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 no-underline hover:no-underline"
            : "text-slate-500 hover:text-slate-900 hover:bg-slate-100 px-5 py-2.5 rounded-2xl text-sm font-medium transition-all duration-300 flex items-center gap-2 no-underline hover:no-underline";
    };

    return (
        <header className="bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-50 transition-all duration-500">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-24">

                    {/* Left: Brand / Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link
                            to="/"
                            className="flex items-center gap-4 no-underline hover:no-underline group"
                        >
                            <div className="bg-slate-800 text-white p-2.5 rounded-2xl shadow-2xl shadow-slate-800/10 group-hover:scale-105 transition-transform duration-500">
                                <span className="font-bold text-lg tracking-tighter">EH</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-slate-900 text-xl font-semibold tracking-tight leading-none">EmployeeHub</span>
                                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Ecosystem</span>
                            </div>
                        </Link>
                    </div>

                    {/* Center: Desktop Navigation */}
                    {user && (
                        <div className="hidden md:block">
                            <div className="flex items-baseline space-x-2">
                                <Link to="/view" className={getLinkClass('/view')}>
                                    <MdViewList className="text-lg" />
                                    Dashboard
                                </Link>
                                <Link to="/departments" className={getLinkClass('/departments')}>
                                    <MdBusiness className="text-lg" />
                                    Departments
                                </Link>
                                {user?.role === 'ADMIN' && (
                                    <Link to="/employee" className={getLinkClass('/employee')}>
                                        <GoPersonAdd className="text-lg" />
                                        Add Employee
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Right: User Profile / Actions */}
                    <div className="hidden md:flex items-center gap-6">
                        {user ? (
                            <>
                                <div className="h-8 w-px bg-slate-100 mx-2"></div>
                                <div className="flex items-center gap-3 text-sm rounded-2xl bg-slate-50 pl-2 pr-4 py-2 border border-slate-100 hover:border-blue-200 transition-all group relative cursor-pointer">
                                    <div className="h-9 w-9 rounded-xl bg-slate-800 flex items-center justify-center text-white shadow-lg shadow-slate-800/10 transition-all group-hover:scale-105">
                                        <span className="font-bold text-xs">{(user?.name || user?.email || "?").charAt(0).toUpperCase()}</span>
                                    </div>
                                    <div className="flex flex-col items-start mr-2">
                                        <span className="text-slate-900 font-semibold leading-none text-sm">{user?.name || user?.email || "User"}</span>
                                        <span className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mt-1">{user?.role?.replace('ROLE_', '')}</span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="text-slate-400 hover:text-red-500 transition-colors ml-2"
                                        title="Logout"
                                    >
                                        <MdLogout className="text-xl" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-6">
                                <Link to="/login" className="text-slate-500 hover:text-slate-900 text-sm font-semibold no-underline hover:no-underline transition-colors">Sign In</Link>
                                <Link to="/signup" className="bg-slate-800 text-white px-8 py-3.5 rounded-2xl text-sm font-semibold transition-all no-underline hover:no-underline shadow-2xl shadow-slate-800/10 hover:bg-slate-700 hover:-translate-y-0.5 active:translate-y-0">Identity Creation</Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white transition-colors"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMenuOpen ? (
                                <MdClose className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <MdMenu className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
                <div className="md:hidden bg-gray-900 border-t border-gray-800 animate-slide-down">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {user ? (
                            <>
                                <Link
                                    to="/view"
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`block px-3 py-3 rounded-md text-base font-medium flex items-center gap-3 ${location.pathname === '/view' ? "bg-gray-800 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"} no-underline`}
                                >
                                    <MdViewList className="text-xl" />
                                    Dashboard
                                </Link>
                                <Link
                                    to="/departments"
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`block px-3 py-3 rounded-md text-base font-medium flex items-center gap-3 ${location.pathname === '/departments' ? "bg-gray-800 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"} no-underline`}
                                >
                                    <MdBusiness className="text-xl" />
                                    Departments
                                </Link>
                                {user?.role === 'ADMIN' && (
                                    <Link
                                        to="/employee"
                                        onClick={() => setIsMenuOpen(false)}
                                        className={`block px-3 py-3 rounded-md text-base font-medium flex items-center gap-3 ${location.pathname === '/employee' ? "bg-gray-800 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"} no-underline`}
                                    >
                                        <GoPersonAdd className="text-xl" />
                                        Add Employee
                                    </Link>
                                )}
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setIsMenuOpen(false);
                                    }}
                                    className="block w-full text-left px-3 py-3 rounded-md text-base font-medium text-red-400 hover:bg-gray-700 hover:text-red-300 flex items-center gap-3"
                                >
                                    <MdLogout className="text-xl" />
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block px-3 py-3 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white no-underline"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/signup"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block px-3 py-3 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-500 no-underline"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                    {/* Mobile User Profile */}
                    {user && (
                        <div className="pt-4 pb-4 border-t border-gray-800">
                            <div className="flex items-center px-5">
                                <div className="flex-shrink-0">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-sm">
                                        {(user?.name || user?.email || "?").charAt(0).toUpperCase()}
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <div className="text-base font-medium leading-none text-white">{user?.name || user?.email || "User"}</div>
                                    <div className="text-sm font-medium leading-none text-gray-400 mt-1">{user?.email}</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
};

export default Header;
