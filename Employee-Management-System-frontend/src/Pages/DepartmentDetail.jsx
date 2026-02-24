import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    FaBuilding, FaUsers, FaChevronLeft, FaSearch, FaEdit,
    FaTrash, FaEnvelope, FaPhone, FaDotCircle, FaTimes, FaCheckCircle
} from 'react-icons/fa';
import { useAuth } from '../Context/AuthContext';
import api from '../api/api';
import { toast } from 'react-hot-toast';

const DepartmentDetail = () => {
    const { name } = useParams();
    const navigate = useNavigate();
    const { hasRole } = useAuth();

    const [employees, setEmployees] = useState([]);
    const [dept, setDept] = useState(null);
    const [allDepts, setAllDepts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [editForm, setEditForm] = useState({ name: '', description: '' });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [empRes, deptRes] = await Promise.all([
                    api.get('/getEmployee'),
                    api.get('/departments'),
                ]);
                const empList = Array.isArray(empRes.data) ? empRes.data : [];
                const deptList = Array.isArray(deptRes.data) ? deptRes.data : [];
                setEmployees(empList);
                setAllDepts(deptList);

                const matched = deptList.find(d => d.name === decodeURIComponent(name));
                if (matched) {
                    setDept(matched);
                    setEditForm({ name: matched.name, description: matched.description || '' });
                }
            } catch (err) {
                toast.error("Failed to synchronize department data");
                console.error('Error fetching department detail:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [name]);

    const deptEmployees = useMemo(() =>
        employees.filter(e => e.department === decodeURIComponent(name)),
        [employees, name]
    );

    const filtered = useMemo(() =>
        deptEmployees.filter(e =>
            (e.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (e.designation?.toLowerCase() || '').includes(searchTerm.toLowerCase())
        ),
        [deptEmployees, searchTerm]
    );

    const activeCount = deptEmployees.filter(e => e.status === 'ACTIVE').length;

    const handleEdit = async (e) => {
        e.preventDefault();
        if (!dept) return;
        setSaving(true);
        try {
            const updatePromise = api.patch(`/departments/${dept.id}`, editForm);

            toast.promise(updatePromise, {
                loading: 'Updating record...',
                success: () => {
                    setDept(prev => ({ ...prev, ...editForm }));
                    setShowEditModal(false);
                    return 'Department updated successfully';
                },
                error: (err) => `Update failed: ${err.response?.data?.message || err.message}`
            });
        } catch (err) {
            toast.error('An unexpected error occurred');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!dept) return;

        toast((t) => (
            <div className="flex flex-col gap-3">
                <p className="text-xs font-bold text-slate-800 uppercase tracking-widest">Confirm Deletion?</p>
                <p className="text-[10px] text-slate-500 font-medium">This will purge the department node. Personnel will remain unlinked.</p>
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
                            try {
                                await api.delete(`/departments/${dept.id}`);
                                toast.success("Department node purged");
                                navigate('/departments');
                            } catch (err) {
                                toast.error(`Deletion failed: ${err.response?.data?.message || err.message}`);
                            }
                        }}
                        className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest"
                    >
                        Confirm Purge
                    </button>
                </div>
            </div>
        ), { duration: 6000, position: 'top-center' });
    };

    if (loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in-up pb-12">


            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-5">
                    <button
                        onClick={() => navigate('/departments')}
                        className="group h-12 w-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm"
                    >
                        <FaChevronLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">{dept?.name || decodeURIComponent(name)}</h1>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1">
                            Departments <span className="mx-2 opacity-40">&gt;</span> {dept?.name || name}
                        </p>
                    </div>
                </div>

                {hasRole(['ROLE_ADMIN']) && dept && (
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowEditModal(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all"
                        >
                            <FaEdit size={12} /> Edit
                        </button>
                        <button
                            onClick={handleDelete}
                            className="flex items-center gap-2 px-6 py-3 bg-rose-50 text-rose-600 border border-rose-100 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-rose-600 hover:text-white active:scale-95 transition-all"
                        >
                            <FaTrash size={12} /> Delete
                        </button>
                    </div>
                )}
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Headcount', value: deptEmployees.length, color: 'text-slate-800' },
                    { label: 'Active Personnel', value: activeCount, color: 'text-emerald-600' },
                    { label: 'On Leave', value: deptEmployees.length - activeCount, color: 'text-amber-500' },
                    { label: 'Description', value: dept?.description ? dept.description.substring(0, 22) + (dept.description.length > 22 ? '…' : '') : 'N/A', color: 'text-slate-400', small: true },
                ].map((s, i) => (
                    <div key={i} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">{s.label}</p>
                        <p className={`text-2xl font-bold tracking-tight ${s.small ? 'text-sm' : ''} ${s.color}`}>{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Employee Directory */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                {/* Search Bar */}
                <div className="p-6 border-b border-slate-50 flex items-center gap-4">
                    <div className="relative flex-1">
                        <FaSearch size={12} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                        <input
                            type="text"
                            placeholder="Search personnel by name or role..."
                            className="w-full pl-12 pr-6 py-4 bg-slate-50 rounded-2xl text-xs font-semibold text-slate-700 placeholder-slate-300 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-200 transition-all"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 shrink-0">
                        {filtered.length} Records
                    </span>
                </div>

                {/* Table */}
                {filtered.length > 0 ? (
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50/60 border-b border-slate-100">
                                <th className="px-8 py-5 text-left text-[9px] font-bold text-slate-400 uppercase tracking-widest">Employee</th>
                                <th className="px-8 py-5 text-left text-[9px] font-bold text-slate-400 uppercase tracking-widest">Contact</th>
                                <th className="px-8 py-5 text-left text-[9px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-right text-[9px] font-bold text-slate-400 uppercase tracking-widest">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filtered.map((emp, i) => (
                                <tr
                                    key={emp.id}
                                    onClick={() => navigate(`/employee/details/${emp.id}`)}
                                    className="group hover:bg-slate-50/60 cursor-pointer transition-all"
                                >
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-11 w-11 rounded-[1.1rem] bg-slate-800 flex items-center justify-center text-white text-base font-bold shadow-lg shadow-slate-800/10 group-hover:scale-105 transition-transform">
                                                {emp.name?.charAt(0).toUpperCase() || '?'}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{emp.name}</p>
                                                <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest mt-1">{emp.designation || 'Specialist'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-slate-500 text-[11px] font-bold">
                                                <FaEnvelope size={9} className="text-slate-300" /> {emp.email}
                                            </div>
                                            {emp.phone && (
                                                <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold">
                                                    <FaPhone size={9} className="text-slate-300" /> {emp.phone}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-bold uppercase tracking-widest w-fit border ${emp.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                                            <div className={`h-1.5 w-1.5 rounded-full ${emp.status === 'ACTIVE' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                                            {emp.status || 'ACTIVE'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button
                                            onClick={e => { e.stopPropagation(); navigate(`/employee/details/${emp.id}`); }}
                                            className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 text-[9px] font-bold text-slate-500 uppercase tracking-widest hover:bg-blue-600 hover:text-white hover:border-transparent transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            View Profile
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="py-20 flex flex-col items-center text-slate-300">
                        <FaUsers size={40} className="mb-4 opacity-30" />
                        <p className="text-[10px] font-bold uppercase tracking-widest">
                            {deptEmployees.length === 0 ? 'No employees assigned to this department' : 'No results match your search'}
                        </p>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {showEditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl">
                        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Edit Department</h2>
                            <button onClick={() => setShowEditModal(false)} className="h-10 w-10 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400 transition-all">
                                <FaTimes size={14} />
                            </button>
                        </div>
                        <form onSubmit={handleEdit} className="p-8 space-y-6">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Department Name</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full bg-slate-50 rounded-2xl px-6 py-4 font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none border-none transition-all"
                                    value={editForm.name}
                                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Description</label>
                                <textarea
                                    className="w-full bg-slate-50 rounded-2xl px-6 py-4 font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none border-none h-28 resize-none transition-all"
                                    value={editForm.description}
                                    onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full bg-slate-800 text-white py-5 rounded-2xl font-bold text-sm hover:bg-slate-700 shadow-xl active:scale-95 transition-all disabled:opacity-50"
                            >
                                {saving ? 'Saving…' : 'Save Changes'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DepartmentDetail;
