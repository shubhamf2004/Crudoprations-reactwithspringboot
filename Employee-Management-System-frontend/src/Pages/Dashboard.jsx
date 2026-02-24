import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaEdit, FaTrash, FaUserPlus, FaSearch, FaPhone, FaEnvelope,
    FaBuilding, FaEye, FaFilter, FaLayerGroup, FaDotCircle,
    FaChevronRight, FaArrowUp, FaChartBar, FaCalendarCheck, FaClock,
    FaArrowDown, FaBriefcase, FaIdBadge
} from "react-icons/fa";
import { useAuth } from "../Context/AuthContext";
import api from "../api/api";
import { toast } from "react-hot-toast";

const Dashboard = () => {
    const [employees, setEmployees] = useState([]);
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterDept, setFilterDept] = useState("All");
    const [filterStatus, setFilterStatus] = useState("All");
    const navigate = useNavigate();
    const { user, hasRole } = useAuth();

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                console.log('Dashboard: Fetching data for user', user.email);
                const [empRes, statsRes] = await Promise.all([
                    api.get("/getEmployee"),
                    api.get("/dashboard/stats")
                ]);
                console.log('Dashboard: Data received', { employees: empRes.data?.length, stats: !!statsRes.data });
                setEmployees(empRes.data || []);
                setStats(statsRes.data || null);
            } catch (error) {
                console.error("Dashboard: Fetch error:", error.response?.status, error.message);
            } finally {
                setIsLoading(false);
            }
        };
        if (user?.token) fetchEmployees();
    }, [user]);

    const handleDelete = async (empId, e) => {
        e.stopPropagation();

        toast((t) => (
            <div className="flex flex-col gap-3">
                <p className="text-xs font-bold text-slate-800 uppercase tracking-widest">Confirm Deletion?</p>
                <p className="text-[10px] text-slate-500 font-medium">This action will permanently purge the personnel record.</p>
                <div className="flex gap-2 justify-end">
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="px-3 py-1.5 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-bold uppercase tracking-widest"
                    >
                        Abort
                    </button>
                    <button
                        onClick={async () => {
                            toast.dismiss(t.id);
                            const deletePromise = api.delete(`/employee/${empId}`);

                            toast.promise(deletePromise, {
                                loading: 'Purging record...',
                                success: () => {
                                    setEmployees(prev => prev.filter(emp => emp.id !== empId));
                                    return 'Personnel record purged successfully';
                                },
                                error: 'Failed to purge record'
                            });
                        }}
                        className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest"
                    >
                        Confirm Purge
                    </button>
                </div>
            </div>
        ), { duration: 6000, position: 'top-center' });
    };

    const handleUpdate = (empId, e) => {
        e.stopPropagation();
        navigate(`/employee/${empId}`);
    };

    const departments = ["All", ...new Set(employees.map(e => e.department).filter(Boolean))];

    const filteredEmployees = employees.filter(employee => {
        const matchSearch = (employee.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (employee.email?.toLowerCase() || "").includes(searchTerm.toLowerCase());
        const matchDept = filterDept === "All" || employee.department === filterDept;
        const matchStatus = filterStatus === "All" || employee.status === filterStatus;
        return matchSearch && matchDept && matchStatus;
    });

    if (isLoading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-600 border-t-transparent shadow-lg shadow-blue-500/10"></div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest animate-pulse">Initializing Human Capital Grid...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-fade-in-up pb-12">
            {/* --- Header Section --- */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-5xl font-bold text-slate-800 tracking-tight">Human Capital</h1>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2 flex items-center gap-2">
                        <FaDotCircle className="text-blue-500 animate-pulse" size={8} />
                        Global Workforce Directory • {employees.length} Active Records
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    {hasRole(['ROLE_ADMIN', 'ROLE_HR']) && (
                        <button
                            onClick={() => navigate('/employee')}
                            className="group flex items-center gap-3 px-8 py-5 bg-blue-600 text-white rounded-[2rem] font-bold text-[10px] uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all"
                        >
                            <FaUserPlus size={14} className="group-hover:rotate-12 transition-transform" />
                            Synchronize New Hire
                        </button>
                    )}
                </div>
            </div>

            {/* --- Stats Overlays --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Capital', value: stats?.totalEmployees || 0, sub: 'Personnel records', icon: FaLayerGroup, color: 'blue' },
                    { label: 'Active Status', value: stats?.activeEmployees || 0, sub: 'Online in grid', icon: FaDotCircle, color: 'emerald' },
                    { label: 'Attendance Rate', value: stats?.attendanceRate || '0%', sub: 'Engagement level', icon: FaCalendarCheck, color: 'indigo' },
                    { label: 'Pending States', value: stats?.pendingLeaves || 0, sub: 'Leave requests', icon: FaClock, color: 'amber' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-xl shadow-slate-200/40 relative overflow-hidden group hover:border-blue-100 transition-all">
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-blue-500 opacity-[0.03] rounded-full -mr-8 -mt-8`}></div>
                        <div className="relative z-10">
                            <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600 mb-6 group-hover:scale-110 transition-transform">
                                <stat.icon size={16} />
                            </div>
                            <h3 className="text-4xl font-bold text-slate-800 tracking-tight mb-1">{stat.value}</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                            <p className="text-[8px] font-semibold text-slate-300 uppercase tracking-widest mt-2">{stat.sub}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- Controls Bar --- */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-3 flex flex-col md:flex-row items-center gap-4">
                <div className="relative flex-1 w-full">
                    <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-slate-300">
                        <FaSearch size={14} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search Identity by Name, Email or ID..."
                        className="w-full pl-14 pr-8 py-5 bg-slate-50 border border-slate-100 rounded-[2rem] text-[11px] font-semibold uppercase tracking-widest placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 transition-all shadow-inner"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                    <div className="flex items-center gap-2 bg-slate-50 px-6 py-5 rounded-[2rem] border border-slate-100 shadow-inner shrink-0">
                        <FaFilter size={10} className="text-slate-400" />
                        <select
                            className="bg-transparent text-[10px] font-bold text-slate-600 uppercase tracking-widest outline-none cursor-pointer"
                            value={filterDept}
                            onChange={(e) => setFilterDept(e.target.value)}
                        >
                            {departments.map(d => <option key={d} value={d}>{d === 'All' ? 'All Departments' : d}</option>)}
                        </select>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-50 px-6 py-5 rounded-[2rem] border border-slate-100 shadow-inner shrink-0">
                        <FaDotCircle size={10} className="text-slate-400" />
                        <select
                            className="bg-transparent text-[10px] font-bold text-slate-600 uppercase tracking-widest outline-none cursor-pointer"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="All">All Status</option>
                            <option value="ACTIVE">Active Only</option>
                            <option value="INACTIVE">Deactivated</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* --- Table Section --- */}
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/60 overflow-hidden relative">
                <div className="overflow-x-auto overflow-y-hidden no-scrollbar">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-10 py-8 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Identity Profile</th>
                                <th className="px-10 py-8 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reach & Contact</th>
                                <th className="px-10 py-8 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Professional Unit</th>
                                <th className="px-10 py-8 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Operational Status</th>
                                <th className="px-10 py-8 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">Grid Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredEmployees.length > 0 ? (
                                filteredEmployees.map((employee, idx) => (
                                    <tr
                                        key={employee.id}
                                        onClick={() => navigate(`/employee/details/${employee.id}`)}
                                        className="group hover:bg-slate-50/50 cursor-pointer transition-all animate-fade-in-up"
                                        style={{ animationDelay: `${idx * 50}ms` }}
                                    >
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-6">
                                                <div className="h-14 w-14 rounded-[1.5rem] bg-slate-800 flex items-center justify-center text-white text-xl font-bold shadow-xl shadow-slate-800/10 group-hover:scale-110 transition-transform duration-500 ring-4 ring-white">
                                                    {employee.name?.charAt(0).toUpperCase() || '?'}
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-bold text-slate-800 uppercase tracking-tight group-hover:text-blue-600 transition-colors">
                                                        {employee.name}
                                                    </h4>
                                                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-1">
                                                        ID: {employee.employeeId || `EMP-${String(employee.id).padStart(4, '0')}`}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-3 text-slate-600">
                                                    <div className="h-7 w-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500 shadow-inner group-hover:bg-white transition-all"><FaEnvelope size={10} /></div>
                                                    <span className="text-[11px] font-bold tracking-tight">{employee.email}</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-slate-600">
                                                    <div className="h-7 w-7 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shadow-inner group-hover:bg-white transition-all"><FaPhone size={10} /></div>
                                                    <span className="text-[11px] font-bold tracking-tight">{employee.phone || 'NO_LINE'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100 w-fit">
                                                    <FaBuilding size={10} />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest">{employee.department}</span>
                                                </div>
                                                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-tight ml-1">{employee.designation || 'Specialist'}</p>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex flex-col gap-2">
                                                <span className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[9px] font-bold uppercase tracking-widest w-fit ${employee.status === 'ACTIVE'
                                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                    : 'bg-rose-50 text-rose-600 border-rose-100'
                                                    }`}>
                                                    <div className={`h-1.5 w-1.5 rounded-full ${employee.status === 'ACTIVE' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></div>
                                                    {employee.status || 'ACTIVE'}
                                                </span>
                                                {stats?.onLeaveEmployees?.some(e => e.id === employee.id) && (
                                                    <span className="text-[8px] font-bold text-amber-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                                        <FaClock size={8} /> Currently Off-Grid
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/employee/details/${employee.id}`);
                                                    }}
                                                    className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-blue-600 hover:text-white transition-all border border-slate-200"
                                                    title="View Profile"
                                                >
                                                    <FaEye size={14} />
                                                </button>
                                                {hasRole(['ROLE_ADMIN', 'ROLE_HR']) && (
                                                    <>
                                                        <button
                                                            onClick={(e) => handleUpdate(employee.id, e)}
                                                            className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-indigo-600 hover:text-white transition-all border border-slate-200"
                                                            title="Update Node"
                                                        >
                                                            <FaEdit size={14} />
                                                        </button>
                                                        <button
                                                            onClick={(e) => handleDelete(employee.id, e)}
                                                            className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-rose-600 hover:text-white transition-all border border-slate-200"
                                                            title="Purge Record"
                                                        >
                                                            <FaTrash size={14} />
                                                        </button>
                                                    </>
                                                )}
                                                <div className="ml-2 h-8 w-8 flex items-center justify-center text-slate-300">
                                                    <FaChevronRight size={12} />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-10 py-24 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-30">
                                            <FaSearch size={40} />
                                            <p className="text-sm font-bold uppercase tracking-widest">No Match Found in Grid</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* --- Pagination Footer Placeholder --- */}
                <div className="px-10 py-6 bg-slate-50/30 border-t border-slate-50 flex justify-between items-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Displaying <span className="text-slate-900">{filteredEmployees.length}</span> of {employees.length} Personnel
                    </p>
                    <div className="flex gap-2">
                        <button disabled className="px-6 py-2.5 rounded-xl border border-slate-100 bg-white text-[10px] font-bold text-slate-300 uppercase tracking-widest opacity-50">Previous</button>
                        <button className="px-6 py-2.5 rounded-xl border border-blue-100 bg-blue-50 text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">Next Cluster</button>
                    </div>
                </div>
            </div>

            <footer className="pt-12 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6 pb-8">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Copyright © 2025 CORE ENTERPRISE SYSTEMS </p>
                <div className="flex gap-6">
                    {['Access Control', 'Data Protection', 'Support'].map(link => (
                        <a key={link} href="#" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-blue-600 transition-all">{link}</a>
                    ))}
                </div>
            </footer>
        </div>
    );
};

export default Dashboard;
