import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBuilding, FaUsers, FaArrowRight, FaPlus, FaTimes } from 'react-icons/fa';
import { useAuth } from '../Context/AuthContext';
import api from '../api/api';
import { toast } from 'react-hot-toast';

const Departments = () => {
    const { hasRole } = useAuth();
    const [departments, setDepartments] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newDept, setNewDept] = useState({ name: '', description: '' });
    const navigate = useNavigate();

    const fetchDepartments = async () => {
        try {
            const [deptRes, empRes] = await Promise.all([
                api.get('/departments'),
                api.get('/getEmployee'),
            ]);
            setDepartments(Array.isArray(deptRes.data) ? deptRes.data : []);
            setEmployees(Array.isArray(empRes.data) ? empRes.data : []);
        } catch (err) {
            toast.error("Failed to fetch departments");
            console.error("Error fetching departments:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/departments', newDept);
            setShowModal(false);
            setNewDept({ name: '', description: '' });
            fetchDepartments();
            toast.success("Department authorized and initialized");
        } catch (err) {
            toast.error(err.response?.data?.message || err.message || "Failed to create department");
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto animate-fade-in-up">
            <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-slate-800 tracking-tight mb-1">Corporate Structure</h1>
                    <p className="text-slate-500 font-medium">Overview of departments, personnel distribution, and operational units.</p>
                </div>
                {hasRole(['ROLE_ADMIN']) && (
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-blue-600 font-bold hover:bg-blue-500 text-white px-8 py-4 rounded-[1.5rem] text-sm shadow-xl shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-3"
                    >
                        <FaPlus /> INITIALIZE DEPARTMENT
                    </button>
                )}
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64 glass-panel rounded-[2rem]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {departments.map((dept) => {
                        const headcount = employees.filter(e => e.department === dept.name).length;
                        const active = employees.filter(e => e.department === dept.name && e.status === 'ACTIVE').length;
                        return (
                            <div
                                key={dept.id}
                                onClick={() => navigate(`/departments/${encodeURIComponent(dept.name)}`)}
                                className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden cursor-pointer"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>

                                <div className="relative z-10">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="h-14 w-14 bg-slate-800 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-slate-800/10 group-hover:rotate-6 transition-all">
                                            <FaBuilding size={22} />
                                        </div>
                                        <div className="text-right">
                                            <p className="text-3xl font-bold text-slate-800 tracking-tight">{headcount}</p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Personnel</p>
                                        </div>
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-800 mb-1 truncate">{dept.name}</h2>
                                    <p className="text-xs text-slate-400 font-medium mb-6 line-clamp-2">{dept.description || 'No description provided.'}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-1.5 text-[9px] font-bold text-emerald-600 uppercase tracking-widest">
                                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            {active} Active
                                        </span>
                                        <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                                            View Team →
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Create Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl animate-scale-in">
                        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">New Department</h2>
                            <button onClick={() => setShowModal(false)} className="h-10 w-10 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400">
                                <FaTimes />
                            </button>
                        </div>
                        <form onSubmit={handleCreate} className="p-8 space-y-6">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Department Name</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="e.g. Strategic Analysis"
                                    value={newDept.name}
                                    onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Objective / Description</label>
                                <textarea
                                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all h-32 resize-none"
                                    placeholder="Describe the department's primary function..."
                                    value={newDept.description}
                                    onChange={(e) => setNewDept({ ...newDept, description: e.target.value })}
                                />
                            </div>
                            <button className="w-full bg-slate-800 text-white py-5 rounded-2xl font-bold text-sm hover:bg-slate-700 shadow-xl shadow-slate-800/10 active:scale-95 transition-all">
                                AUTHORIZE CREATION
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Departments;
