import React, { useEffect, useState } from 'react';
import { FaCalendarAlt, FaPlus, FaCheckCircle, FaClock, FaTimesCircle, FaCheck, FaTimes } from 'react-icons/fa';
import { useAuth } from '../Context/AuthContext';
import api from '../api/api';
import { toast } from 'react-hot-toast';

const Leaves = () => {
    const { user, hasRole } = useAuth();
    const [leaves, setLeaves] = useState([]);
    const [pendingLeaves, setPendingLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newLeave, setNewLeave] = useState({
        startDate: '',
        endDate: '',
        type: 'Annual',
        reason: ''
    });

    const fetchData = async () => {
        if (!user?.id) return;
        try {
            const res = await api.get(`/leaves/employee/${user.id}`);
            setLeaves(res.data);

            if (hasRole(['ROLE_ADMIN', 'ROLE_HR'])) {
                const pendingRes = await api.get('/leaves/pending');
                setPendingLeaves(pendingRes.data);
            }
        } catch (err) {
            toast.error("Failed to load leave records");
            console.error("Error fetching leaves:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    const handleApplyLeave = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/leaves/apply/${user.id}`, newLeave);
            setShowModal(false);
            setNewLeave({ startDate: '', endDate: '', type: 'Annual', reason: '' });
            await fetchData();
            toast.success("Leave request submitted successfully");
        } catch (err) {
            toast.error(err.response?.data?.message || err.message || "Application failed");
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await api.patch(`/leaves/${id}/status?status=${status}`);
            await fetchData();
            toast.success(`Request ${status.toLowerCase()} successfully`);
        } catch (err) {
            toast.error(err.response?.data?.message || err.message || "Update failed");
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto animate-fade-in-up">
            <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-slate-800 tracking-tight mb-1">Absence Hub</h1>
                    <p className="text-slate-500 font-medium tracking-tight">Manage time-off requests, balances, and historical records.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-[1.5rem] font-bold text-sm shadow-2xl shadow-slate-900/10 active:scale-95 transition-all flex items-center gap-3"
                >
                    <FaPlus /> INITIALIZE LEAVE REQUEST
                </button>
            </div>

            {hasRole(['ROLE_ADMIN', 'ROLE_HR']) && pendingLeaves.length > 0 && (
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse"></div>
                        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Active Review Task ({pendingLeaves.length})</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {pendingLeaves.map(leave => (
                            <div key={leave.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col justify-between group">
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="text-[10px] font-bold py-1 px-3 bg-slate-900 text-white rounded-full uppercase tracking-widest">{leave.type || 'ANNUAL'}</div>
                                        <div className="text-[10px] font-bold text-slate-400">{leave.startDate} → {leave.endDate}</div>
                                    </div>
                                    <p className="text-sm font-bold text-slate-900 mb-1">{leave.employee?.name || 'Loading...'}</p>
                                    <p className="text-xs text-slate-500 font-medium mb-4 line-clamp-1">"{leave.reason}"</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleUpdateStatus(leave.id, 'APPROVED')}
                                        className="flex-1 bg-green-50 text-green-600 py-3 rounded-xl text-[10px] font-bold hover:bg-green-600 hover:text-white transition-all flex items-center justify-center gap-2"
                                    >
                                        <FaCheck /> APPROVE
                                    </button>
                                    <button
                                        onClick={() => handleUpdateStatus(leave.id, 'REJECTED')}
                                        className="flex-1 bg-red-50 text-red-600 py-3 rounded-xl text-[10px] font-bold hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2"
                                    >
                                        <FaTimes /> REJECT
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <LeaveStat title="Allocated Capacity" value="24" icon={<FaCalendarAlt />} color="bg-blue-600 shadow-blue-500/20" />
                <LeaveStat title="Utilized Days" value={leaves.filter(l => l.status === 'APPROVED').length} icon={<FaCheckCircle />} color="bg-slate-900 shadow-slate-900/20" />
                <LeaveStat title="Pending Review" value={leaves.filter(l => l.status === 'PENDING').length} icon={<FaClock />} color="bg-indigo-600 shadow-indigo-500/20" />
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden mb-12">
                <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800">Request History</h2>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-4 py-1.5 rounded-full">Record Overview</span>
                </div>
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-8 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Classification</th>
                                    <th className="px-8 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Temporal Range</th>
                                    <th className="px-8 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Review Status</th>
                                    <th className="px-8 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Administrative</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {leaves.length > 0 ? (
                                    leaves.map((leave) => (
                                        <tr key={leave.id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-8 py-6 whitespace-nowrap text-sm font-bold text-gray-900 uppercase">
                                                {leave.type || 'Annual'}
                                            </td>
                                            <td className="px-8 py-6 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-gray-900">{leave.startDate} to {leave.endDate}</span>
                                                    <span className="text-[10px] font-bold text-slate-400 mt-0.5">{leave.reason || 'No reason provided'}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 whitespace-nowrap">
                                                <StatusBadge status={leave.status} />
                                            </td>
                                            <td className="px-8 py-6 whitespace-nowrap">
                                                <button className="text-gray-400 hover:text-red-500 transition-colors">
                                                    <FaTimesCircle size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                                                    <FaCalendarAlt size={32} />
                                                </div>
                                                <p className="text-gray-500 font-bold">No leave requests found.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Leave Application Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
                    <div className="bg-white rounded-[3rem] w-full max-w-2xl shadow-2xl animate-scale-in relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32 z-0"></div>
                        <div className="p-10 border-b border-slate-50 flex items-center justify-between relative z-10">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Initialize Leave</h1>
                                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">Operational Absence Request</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="h-12 w-12 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors">
                                <FaTimes className="text-slate-400" />
                            </button>
                        </div>
                        <form onSubmit={handleApplyLeave} className="p-10 space-y-8 relative z-10">
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Commencement Date</label>
                                    <input
                                        required
                                        type="date"
                                        className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={newLeave.startDate}
                                        onChange={(e) => setNewLeave({ ...newLeave, startDate: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Conclusion Date</label>
                                    <input
                                        required
                                        type="date"
                                        className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={newLeave.endDate}
                                        onChange={(e) => setNewLeave({ ...newLeave, endDate: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Classification Type</label>
                                    <select
                                        className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={newLeave.type}
                                        onChange={(e) => setNewLeave({ ...newLeave, type: e.target.value })}
                                    >
                                        <option>Annual</option>
                                        <option>Sick</option>
                                        <option>Personal</option>
                                        <option>Bereavement</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3">Rationale / Justification</label>
                                <textarea
                                    required
                                    className="w-full bg-slate-50 border-none rounded-3xl px-6 py-5 font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none h-32 resize-none"
                                    placeholder="Provide detailed reasoning for request..."
                                    value={newLeave.reason}
                                    onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
                                />
                            </div>
                            <button className="w-full bg-slate-900 text-white py-6 rounded-[1.5rem] font-bold text-sm hover:bg-slate-800 shadow-2xl shadow-slate-900/10 active:scale-[0.98] transition-all">
                                AUTHORIZE SUBMISSION
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const LeaveStat = ({ title, value, icon, color }) => (
    <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center justify-between hover:-translate-y-1 transition-all duration-300 group">
        <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{title}</p>
            <p className="text-4xl font-bold text-slate-800">{value}</p>
        </div>
        <div className={`h-16 w-16 rounded-2xl ${color} text-white flex items-center justify-center shadow-lg group-hover:rotate-6 transition-all duration-300`}>
            {React.cloneElement(icon, { size: 24 })}
        </div>
    </div>
);

const StatusBadge = ({ status }) => {
    const styles = {
        'PENDING': 'bg-orange-50 text-orange-600 border-orange-100',
        'APPROVED': 'bg-green-50 text-green-600 border-green-100',
        'REJECTED': 'bg-red-50 text-red-600 border-red-100'
    };
    return (
        <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${styles[status] || styles['PENDING']}`}>
            {status || 'PENDING'}
        </span>
    );
};

export default Leaves;
