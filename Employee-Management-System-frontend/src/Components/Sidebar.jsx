import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import {
    FaHome,
    FaUsers,
    FaClock,
    FaCalendarAlt,
    FaBuilding,
    FaUserCircle,
    FaSignOutAlt,
    FaCogs,
    FaShieldAlt,
    FaChevronLeft,
    FaChevronRight,
    FaTimes
} from 'react-icons/fa';

const Sidebar = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) => {
    const { user, logout, hasRole } = useAuth();
    const location = useLocation();

    const menuItems = [
        { path: '/view', name: 'Executive Overlook', icon: <FaHome />, roles: ['ROLE_ADMIN', 'ROLE_HR', 'ROLE_USER'] },
        { path: '/view/employees', name: 'Employees', icon: <FaUsers />, roles: ['ROLE_ADMIN', 'ROLE_HR'] },
        { path: '/attendance', name: 'Attendance', icon: <FaClock />, roles: ['ROLE_ADMIN', 'ROLE_HR', 'ROLE_USER'] },
        { path: '/leaves', name: 'Leaves', icon: <FaCalendarAlt />, roles: ['ROLE_ADMIN', 'ROLE_HR', 'ROLE_USER'] },
        { path: '/departments', name: 'Departments', icon: <FaBuilding />, roles: ['ROLE_ADMIN', 'ROLE_HR'] },
    ];

    const filteredMenu = menuItems.filter(item => hasRole(item.roles));

    return (
        <aside className={`fixed left-0 top-0 z-50 h-screen transition-all duration-300 ease-in-out bg-[#020617] border-r border-slate-900/50 flex flex-col ${isMobileOpen
            ? 'translate-x-0 w-72'
            : '-translate-x-full lg:translate-x-0 ' + (isCollapsed ? 'w-20' : 'w-72')
            }`}>
            {/* Toggle Button (Desktop Only) */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden lg:flex absolute -right-3 top-10 h-6 w-6 bg-blue-600 text-white rounded-full items-center justify-center shadow-lg border-2 border-[#020617] hover:bg-blue-500 transition-all z-50"
            >
                {isCollapsed ? <FaChevronRight size={10} /> : <FaChevronLeft size={10} />}
            </button>

            {/* Mobile Close Button */}
            <button
                onClick={() => setIsMobileOpen(false)}
                className="lg:hidden absolute right-4 top-4 text-slate-500 hover:text-white p-2"
            >
                <FaTimes size={20} />
            </button>
            {/* High-End Branding */}
            <div className={`p-6 ${isCollapsed ? 'items-center px-4' : 'px-10'} pt-10`}>
                <div className={`flex items-center gap-4 group cursor-pointer ${isCollapsed ? 'justify-center' : ''}`}>
                    <div className={`flex-shrink-0 h-12 w-12 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-blue-500/20 group-hover:rotate-6 transition-all duration-500`}>
                        <FaShieldAlt size={22} className="group-hover:scale-110 transition-transform" />
                    </div>
                    {!isCollapsed && (
                        <div className="whitespace-nowrap transition-all duration-300 overflow-hidden">
                            <h1 className="text-2xl font-bold text-white tracking-tighter leading-none">
                                EH<span className="text-blue-500 font-bold">HUB</span>
                            </h1>
                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.3em] mt-1 lg:mt-2">Core Ecosystem</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation Section */}
            <div className={`flex-1 ${isCollapsed ? 'px-3' : 'px-5'} py-6 space-y-10 overflow-y-auto no-scrollbar`}>

                {/* Section: Intelligence */}
                <div className="space-y-2">
                    {!isCollapsed && <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.25em] pl-4 mb-5">Enterprise Intelligence</p>}
                    <div className="space-y-1.5">
                        {filteredMenu.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    title={isCollapsed ? item.name : ''}
                                    onClick={() => setIsMobileOpen(false)}
                                    className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group no-underline relative overflow-hidden ${isCollapsed ? 'justify-center px-0' : ''
                                        } ${isActive
                                            ? 'bg-blue-600/10 text-white shadow-sm'
                                            : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
                                        }`}
                                >
                                    {isActive && (
                                        <div className="absolute left-0 top-0 h-full w-1 bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)]"></div>
                                    )}
                                    <span className={`${isActive ? 'text-blue-500' : 'text-slate-600 group-hover:text-blue-400'} transition-all duration-300 group-hover:scale-110 flex-shrink-0`}>
                                        {React.cloneElement(item.icon, { size: 18 })}
                                    </span>
                                    {!isCollapsed && <span className={`text-[13px] font-bold tracking-tight whitespace-nowrap`}>{item.name}</span>}

                                    {isActive && (
                                        <div className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(37,99,235,1)]"></div>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Section: Personal Node */}
                <div className="space-y-2">
                    {!isCollapsed && <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.25em] pl-4 mb-5">Personal Node</p>}
                    <div className="space-y-1.5">
                        <Link
                            to={`/employee/details/${user?.id}`}
                            title={isCollapsed ? 'Profile' : ''}
                            onClick={() => setIsMobileOpen(false)}
                            className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group no-underline text-slate-500 hover:text-slate-200 hover:bg-white/5 ${isCollapsed ? 'justify-center px-0' : ''
                                } ${location.pathname.includes('/employee/details') && location.pathname.includes(user?.id) ? 'bg-indigo-600/10 text-white' : ''
                                }`}
                        >
                            <FaUserCircle size={18} className="text-slate-600 group-hover:text-indigo-400 flex-shrink-0" />
                            {!isCollapsed && <span className="text-[13px] font-bold tracking-tight whitespace-nowrap">Profile</span>}
                        </Link>
                        <Link
                            to="/settings"
                            title={isCollapsed ? 'Settings' : ''}
                            onClick={() => setIsMobileOpen(false)}
                            className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group no-underline text-slate-500 hover:text-slate-200 hover:bg-white/5 ${isCollapsed ? 'justify-center px-0' : ''
                                }`}
                        >
                            <FaCogs size={18} className="text-slate-600 group-hover:text-slate-400 flex-shrink-0" />
                            {!isCollapsed && <span className="text-[13px] font-bold tracking-tight whitespace-nowrap">Settings</span>}
                        </Link>
                    </div>
                </div>
            </div>

            {/* Premium Footer User Block */}
            <div className={`p-4 mt-auto`}>
                <div className={`bg-[#0f172a]/50 ${isCollapsed ? 'p-2 rounded-2xl' : 'p-5 rounded-[2rem]'} border border-slate-800/50 backdrop-blur-xl relative overflow-hidden group transition-all duration-300`}>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700"></div>

                    <div className={`flex items-center gap-4 ${isCollapsed ? 'mb-2 justify-center' : 'mb-6'} relative z-10`}>
                        <div className={`flex-shrink-0 h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 text-lg font-bold shadow-inner`}>
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        {!isCollapsed && (
                            <div className="overflow-hidden">
                                <h4 className="text-white font-bold text-[11px] uppercase tracking-wider truncate mb-0.5">{user?.name || 'Authorized User'}</h4>
                                <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                    <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{user?.role?.replace('ROLE_', '')}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={logout}
                        title={isCollapsed ? 'Log out' : ''}
                        className={`w-full flex items-center justify-center gap-3 ${isCollapsed ? 'py-3' : 'py-3.5'} bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 hover:border-red-500/30 text-red-500 rounded-2xl transition-all duration-300 group`}
                    >
                        <FaSignOutAlt size={14} className={`${!isCollapsed ? 'group-hover:-translate-x-1' : ''} transition-transform flex-shrink-0`} />
                        {!isCollapsed && <span className="text-[10px] font-bold uppercase tracking-[0.2em] whitespace-nowrap">Log out</span>}
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
