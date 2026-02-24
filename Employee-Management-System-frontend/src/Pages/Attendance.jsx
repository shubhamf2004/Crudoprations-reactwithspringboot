import React, { useEffect, useState } from 'react';
import { FaClock, FaCalendarCheck, FaUserClock, FaHistory } from 'react-icons/fa';
import { useAuth } from '../Context/AuthContext';
import api from '../api/api';
import { toast } from 'react-hot-toast';

const Attendance = () => {
    const { user } = useAuth();
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAttendance = async () => {
            if (!user?.id) return;
            try {
                const res = await api.get(`/attendance/employee/${user.id}`);
                setAttendance(res.data);
            } catch (err) {
                toast.error("Failed to load attendance logs");
                console.error("Error fetching attendance:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAttendance();
    }, [user]);

    return (
        <div className="p-8 max-w-7xl mx-auto animate-fade-in-up">
            <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-slate-800 tracking-tight mb-1">Operational Logs</h1>
                    <p className="text-slate-500 font-medium tracking-tight">Detailed tracking of daily personnel presence and shifts.</p>
                </div>
                <div className="bg-white p-5 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center gap-5">
                    <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
                        <FaHistory size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Registry Total</p>
                        <p className="text-2xl font-bold text-slate-800">{attendance.length}</p>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64 glass-panel rounded-[2rem]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-8 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Operational Date</th>
                                    <th className="px-8 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sign-In Time</th>
                                    <th className="px-8 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sign-Out Time</th>
                                    <th className="px-8 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Duration (Hrs)</th>
                                    <th className="px-8 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {attendance.length > 0 ? (
                                    attendance.map((log) => (
                                        <tr key={log.id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-8 py-5 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold">
                                                        {new Date(log.date).getDate()}
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-900">
                                                        {new Date(log.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 whitespace-nowrap">
                                                <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                                    <FaClock className="text-blue-400" />
                                                    {log.checkIn || 'N/A'}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 whitespace-nowrap">
                                                <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                                    <FaClock className="text-orange-400" />
                                                    {log.checkOut || 'Waiting...'}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 whitespace-nowrap text-sm font-bold text-slate-800">
                                                {log.workingHours ? `${log.workingHours.toFixed(2)}h` : '--'}
                                            </td>
                                            <td className="px-8 py-5 whitespace-nowrap">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${log.checkOut ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                                    {log.checkOut ? 'Completed' : 'On Going'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                                                    <FaUserClock size={32} />
                                                </div>
                                                <p className="text-gray-500 font-bold">No attendance records found.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Attendance;
