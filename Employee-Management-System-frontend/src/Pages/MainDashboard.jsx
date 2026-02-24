import React, { useEffect, useState } from 'react';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { toast } from 'react-hot-toast';
import {
    FaUsers, FaUserCheck, FaCalendarAlt, FaClock, FaRocket,
    FaLightbulb, FaCheckCircle, FaExclamationCircle, FaSignOutAlt,
    FaArrowRight, FaDotCircle, FaFireAlt, FaGem, FaChartLine
} from 'react-icons/fa';

const MainDashboard = () => {
    const { user, logout, hasRole } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [attendanceStatus, setAttendanceStatus] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAttendanceStatus = async () => {
        if (!user?.id) return;
        try {
            const res = await api.get(`/attendance/employee/${user.id}`);
            const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
            const todayRecord = res.data.find(r => r.date === today);
            setAttendanceStatus(todayRecord || null);
        } catch (err) {
            toast.error("Failed to verify attendance status");
            console.error("Status check failed", err);
        }
    };

    const handleAttendanceAction = async (action) => {
        if (!user?.id) return;
        const actionLabel = action === 'check-in' ? 'Initializing Shift' : 'Terminating Shift';

        try {
            const actionPromise = api.post(`/attendance/${action}/${user.id}`);

            toast.promise(actionPromise, {
                loading: `${actionLabel}...`,
                success: () => {
                    fetchData();
                    return `${action === 'check-in' ? 'Shift active' : 'Shift terminated'} successfully`;
                },
                error: `Failed to ${action.replace('-', ' ')}`
            });
        } catch (err) {
            toast.error("An unexpected error occurred");
            console.error("Attendance action failed", err);
        }
    };

    const fetchData = async () => {
        if (!user?.id) return;
        setLoading(true);
        try {
            const [statsRes] = await Promise.all([
                api.get('/dashboard/stats'),
                checkAttendanceStatus()
            ]);
            setStats(statsRes.data);
        } catch (err) {
            toast.error("Failed to synchronize enterprise stats");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    if (loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-600 border-t-transparent shadow-lg shadow-blue-500/10"></div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest animate-pulse">Establishing Secure Uplink...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-fade-in-up pb-12">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div>
                    <h1 className="text-5xl font-bold text-slate-800 tracking-tight leading-tight">
                        Enterprise<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 text-6xl">Operations</span>
                    </h1>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-4 flex items-center gap-2">
                        <FaDotCircle className="text-emerald-500 animate-pulse" size={8} />
                        Operational Status: Nominal • Welcome, {user?.name?.split(' ')[0]}
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-4 bg-white p-4 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40">
                        <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner">
                            <FaClock size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Active Shift</p>
                            <p className="text-sm font-bold text-slate-800">09:00 — 18:00</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="h-14 w-14 flex items-center justify-center bg-white border border-slate-100 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-[1.5rem] shadow-xl shadow-slate-200/40 transition-all hover:rotate-12"
                        title="Secure Logout"
                    >
                        <FaSignOutAlt size={20} />
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {hasRole(['ROLE_ADMIN', 'ROLE_HR']) ? (
                    <>
                        <StatCard icon={<FaUsers />} title="Total Capital" value={stats?.totalEmployees || 0} trend="+2 New Hire" color="blue" />
                        <StatCard icon={<FaUserCheck />} title="Active Node" value={stats?.activeEmployees || 0} trend="Current Grid" color="emerald" />
                        <StatCard icon={<FaCalendarAlt />} title="Leave Sync" value={stats?.pendingLeaves || 0} trend="Awaiting Proc" color="amber" />
                        <StatCard icon={<FaChartLine />} title="Efficiency" value={stats?.attendanceRate || '0%'} trend="Global Rate" color="indigo" />
                    </>
                ) : (
                    <>
                        <StatCard icon={<FaClock />} title="Present Units" value={stats?.presentDays || 0} trend="Monthly Stat" color="blue" />
                        <StatCard icon={<FaCalendarAlt />} title="Annual Balance" value={stats?.leavesRemaining || 0} trend="Remaining" color="amber" />
                        <StatCard icon={<FaGem />} title="Performance" value={stats?.performanceScore || 'N/A'} trend="Tier Status" color="indigo" />
                        <StatCard icon={<FaLightbulb />} title="Break Cycles" value={stats?.upcomingHolidays || 0} trend="Upcoming" color="emerald" />
                    </>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-10">
                    {/* System Feed */}
                    <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-slate-200/50 border border-slate-100">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h2 className="text-[11px] font-bold text-slate-800 uppercase tracking-widest">Intelligence Feed</h2>
                                <p className="text-xs font-bold text-slate-400 mt-1">Real-time system telemetry and updates</p>
                            </div>
                            <button className="h-10 w-10 flex items-center justify-center bg-slate-50 text-slate-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-inner">
                                <FaArrowRight size={12} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            {stats?.recentActivities && stats.recentActivities.length > 0 ? (
                                stats.recentActivities.map((activity, idx) => (
                                    <ActivityItem
                                        key={idx}
                                        icon={
                                            activity.type === 'HIRE' ? <FaUsers size={12} /> :
                                                activity.type === 'LEAVE' ? <FaCalendarAlt size={12} /> :
                                                    <FaCheckCircle size={12} />
                                        }
                                        type={activity.type}
                                        text={activity.text}
                                        time={activity.time}
                                    />
                                ))
                            ) : (
                                <div className="py-12 flex flex-col items-center text-slate-300 opacity-50">
                                    <FaExclamationCircle size={32} className="mb-4" />
                                    <p className="text-[10px] font-bold uppercase tracking-widest">No Active Telemetry</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {hasRole(['ROLE_ADMIN', 'ROLE_HR']) && (
                        <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-slate-200/50 border border-slate-100">
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h2 className="text-[11px] font-bold text-slate-800 uppercase tracking-widest">Out-of-Grid Personnel</h2>
                                    <p className="text-xs font-bold text-slate-400 mt-1">Personnel currently on leave status</p>
                                </div>
                                <span className="bg-amber-50 text-amber-600 px-4 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest border border-amber-100 shadow-sm">
                                    {stats?.onLeaveToday || 0} ABSENT
                                </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {stats?.onLeaveEmployees && stats.onLeaveEmployees.length > 0 ? (
                                    stats.onLeaveEmployees.map((emp, idx) => (
                                        <div key={idx} className="flex items-center gap-4 p-5 rounded-[2rem] bg-slate-50 border border-slate-100 group hover:border-blue-200 transition-all shadow-inner">
                                            <div className="h-12 w-12 rounded-2xl bg-white shadow-md flex items-center justify-center text-slate-800 font-bold text-lg">
                                                {emp.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800 uppercase tracking-tight group-hover:text-blue-600 transition-colors">{emp.name}</p>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">VACATION / LEAVE</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full py-16 flex flex-col items-center justify-center text-slate-300 border-2 border-dashed border-slate-100 rounded-[2.5rem]">
                                        <FaCalendarAlt size={40} className="mb-4 opacity-20" />
                                        <p className="text-[10px] font-bold uppercase tracking-widest">Full Personnel Synchronization</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Grid Control Sidebar */}
                <div className="space-y-10">
                    <div className="bg-slate-950 p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/20 rounded-full -mr-24 -mt-24 blur-3xl group-hover:bg-blue-600/30 transition-all duration-700"></div>
                        <h2 className="text-[11px] font-bold uppercase tracking-widest mb-8 relative z-10 text-slate-500">Operational Control</h2>
                        <div className="space-y-4 relative z-10">
                            <ActionButton
                                onClick={() => handleAttendanceAction('check-in')}
                                text={attendanceStatus ? "Shift In-Progress" : "Initialize Shift"}
                                icon={<FaClock />}
                                active={!!attendanceStatus && !attendanceStatus.checkOut}
                                disabled={!!attendanceStatus}
                            />
                            <ActionButton
                                onClick={() => handleAttendanceAction('check-out')}
                                text={attendanceStatus?.checkOut ? "Shift Completed" : "Terminate Shift"}
                                icon={<FaExclamationCircle />}
                                active={false}
                                disabled={!attendanceStatus || !!attendanceStatus.checkOut}
                                variant="outline"
                            />
                            <div className="pt-4 mt-6 border-t border-white/5">
                                <button
                                    onClick={() => navigate('/leaves')}
                                    className="w-full flex items-center justify-between group/btn text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-all"
                                >
                                    Apply For Cycle Break
                                    <FaArrowRight className="group-hover/btn:translate-x-2 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-slate-100/50 border border-slate-100">
                        <h2 className="text-[11px] font-bold text-slate-800 uppercase tracking-widest mb-8">Support Infrastructure</h2>
                        <div className="p-6 bg-blue-50/50 rounded-[2rem] border border-blue-100/50 relative overflow-hidden">
                            <div className="relative z-10">
                                <FaFireAlt className="text-blue-600 mb-4" size={20} />
                                <p className="text-xs font-bold text-slate-800 uppercase tracking-tight mb-2">Technical Blockage?</p>
                                <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-widest">Connect with HR infrastructure for rapid synchronization and override requests.</p>
                                <button className="mt-6 w-full bg-white text-blue-600 py-4 rounded-[1.5rem] text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-blue-500/5 hover:bg-blue-600 hover:text-white transition-all">Establish Channel</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, title, value, trend, color }) => {
    const colorMap = {
        blue: 'bg-blue-50 text-blue-600 border-blue-100',
        emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        amber: 'bg-amber-50 text-amber-600 border-amber-100',
        indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100'
    };

    return (
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-200/40 border border-slate-100 transition-all hover:-translate-y-2 group">
            <div className="flex flex-col gap-8">
                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center border shadow-inner group-hover:scale-110 transition-transform ${colorMap[color]}`}>
                    {React.cloneElement(icon, { size: 18 })}
                </div>
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</p>
                    <div className="flex items-baseline gap-2 mt-2">
                        <h3 className="text-4xl font-bold text-slate-800 tracking-tight">{value}</h3>
                    </div>
                    <div className="flex items-center gap-2 mt-4 bg-slate-50 w-fit px-3 py-1 rounded-full border border-slate-100 shadow-inner">
                        <div className={`h-1.5 w-1.5 rounded-full ${color === 'emerald' || color === 'blue' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{trend}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ActivityItem = ({ icon, text, time, type }) => (
    <div className="flex gap-6 p-6 rounded-[2rem] hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group">
        <div className={`h-10 w-10 flex-shrink-0 rounded-xl flex items-center justify-center shadow-inner group-hover:bg-white transition-all ${type === 'HIRE' ? 'bg-blue-50 text-blue-500' :
            type === 'LEAVE' ? 'bg-amber-50 text-amber-500' :
                'bg-emerald-50 text-emerald-500'
            }`}>
            {icon}
        </div>
        <div className="flex-1">
            <p className="text-[11px] font-bold text-slate-700 uppercase tracking-tight group-hover:text-blue-600 transition-colors leading-relaxed">{text}</p>
            <p className="text-[8px] font-bold text-slate-400 mt-2 uppercase tracking-widest">{time}</p>
        </div>
    </div>
);

const ActionButton = ({ text, icon, onClick, disabled, active, variant = 'solid' }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`w-full h-16 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all flex items-center px-8 gap-4 active:scale-95 ${disabled ? 'opacity-30 grayscale cursor-not-allowed' :
            active ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' :
                variant === 'solid' ? 'bg-white text-slate-800 hover:bg-blue-600 hover:text-white' :
                    'border border-white/10 text-white hover:bg-white/5'
            }`}
    >
        {React.cloneElement(icon, { size: 14 })}
        {text}
        {!disabled && !active && <FaArrowRight size={10} className="ml-auto opacity-30" />}
    </button>
);

export default MainDashboard;
