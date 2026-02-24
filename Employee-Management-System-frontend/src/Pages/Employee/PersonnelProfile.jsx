import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBriefcase, FaCalendarAlt,
    FaLinkedin, FaTwitter, FaInstagram, FaChevronLeft, FaEllipsisH,
    FaChartLine, FaClock, FaFileAlt, FaCheckCircle, FaExclamationCircle,
    FaArrowUp, FaDownload, FaEdit, FaTimesCircle, FaHourglass, FaBuilding
} from 'react-icons/fa';
import api from '../../api/api';
import { toast } from 'react-hot-toast';

const PersonnelProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(null);
    const [leaves, setLeaves] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [empRes, leaveRes, attRes] = await Promise.all([
                    api.get(`/employee/${id}`),
                    api.get(`/leaves/employee/${id}`).catch(() => ({ data: [] })),
                    api.get(`/attendance/employee/${id}`).catch(() => ({ data: [] })),
                ]);
                setEmployee(empRes.data);
                setLeaves(Array.isArray(leaveRes.data) ? leaveRes.data : []);
                setAttendance(Array.isArray(attRes.data) ? attRes.data : []);
            } catch (error) {
                toast.error("Failed to synchronize personnel data");
                console.error("Error fetching employee details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [id]);

    // Derived stats from real data
    const leaveStats = useMemo(() => {
        const approved = leaves.filter(l => l.status === 'APPROVED');
        const pending = leaves.filter(l => l.status === 'PENDING');
        const annual = approved.filter(l => l.type === 'ANNUAL' || l.type === 'Annual');
        const casual = approved.filter(l => l.type === 'CASUAL' || l.type === 'Casual');
        const sick = approved.filter(l => l.type === 'SICK' || l.type === 'Sick');
        return {
            total: { used: approved.length, max: 20 },
            annual: { used: annual.length, max: 15 },
            casual: { used: casual.length, max: 12 },
            sick: { used: sick.length, max: 4 },
            pending: pending.length,
        };
    }, [leaves]);

    const attendanceStats = useMemo(() => {
        const now = new Date();
        const thisMonth = attendance.filter(a => {
            const d = new Date(a.date);
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        });

        const hoursThisWeek = attendance
            .filter(a => {
                const d = new Date(a.date);
                const dayOfWeek = d.getDay();
                const diff = d.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
                const monday = new Date(d.setDate(diff));
                return new Date(a.date) >= monday;
            })
            .reduce((sum, a) => sum + (a.workingHours || 0), 0);

        const avgHours = attendance.length > 0
            ? attendance.reduce((sum, a) => sum + (a.workingHours || 0), 0) / attendance.length
            : 0;

        const perfScore = avgHours >= 8.5 ? 'A+' : avgHours >= 7.5 ? 'A' : avgHours >= 6.0 ? 'B' : attendance.length > 0 ? 'C' : 'N/A';
        const perfPct = avgHours >= 8.5 ? 96 : avgHours >= 7.5 ? 87 : avgHours >= 6.0 ? 73 : 55;

        return {
            presentDays: attendance.length,
            thisMonth: thisMonth.length,
            hoursThisWeek: Math.round(hoursThisWeek * 100) / 100,
            perfScore,
            perfPct,
            avgHours: Math.round(avgHours * 100) / 100,
        };
    }, [attendance]);

    // Heatmap: last 16 weeks (Mon-Fri), each cell = 1 day
    const heatmapData = useMemo(() => {
        const attendanceMap = {};
        attendance.forEach(a => {
            if (a.date) attendanceMap[a.date] = a.workingHours || 0;
        });

        const today = new Date();
        // Go back to the Monday 16 weeks ago
        const startDate = new Date(today);
        const dayOfWeek = startDate.getDay() || 7; // 1=Mon..7=Sun
        startDate.setDate(startDate.getDate() - (dayOfWeek - 1) - 15 * 7);

        const weeks = [];
        for (let w = 0; w < 16; w++) {
            const days = [];
            for (let d = 0; d < 5; d++) { // Mon-Fri only
                const cur = new Date(startDate);
                cur.setDate(startDate.getDate() + w * 7 + d);
                const iso = cur.toISOString().split('T')[0];
                const hours = attendanceMap[iso];
                const isFuture = cur > today;
                days.push({
                    date: iso,
                    hours: hours ?? null,
                    present: iso in attendanceMap,
                    isFuture,
                    weekLabel: d === 0 ? cur.toLocaleString('en', { month: 'short', day: 'numeric' }) : null,
                });
            }
            weeks.push(days);
        }
        return weeks;
    }, [attendance]);

    // Recent leave activity
    const recentLeaves = useMemo(() => {
        return [...leaves]
            .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
            .slice(0, 4);
    }, [leaves]);

    if (loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent shadow-xl shadow-blue-500/20"></div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest animate-pulse">Synchronizing Data Assets...</p>
                </div>
            </div>
        );
    }

    if (!employee) {
        return (
            <div className="glass-panel m-8 p-20 rounded-[3rem] text-center border-slate-100">
                <FaExclamationCircle size={50} className="mx-auto text-slate-200 mb-6" />
                <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Identity Not Found</h2>
                <p className="text-slate-500 font-medium mt-2">The requested personnel record does not exist in the enterprise grid.</p>
                <button
                    onClick={() => navigate('/view/employees')}
                    className="mt-8 px-10 py-4 bg-slate-800 text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-2xl shadow-slate-800/10 active:scale-95 transition-all"
                >
                    Return to Directory
                </button>
            </div>
        );
    }

    const totalCTC = (employee.salary || 0) + (employee.transportationAllowance || 0) + (employee.mealAllowance || 0) + (employee.internetAllowance || 0);

    return (
        <div className="space-y-8 animate-fade-in-up pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="group h-12 w-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm"
                    >
                        <FaChevronLeft size={14} className="group-hover:-translate-x-0.5" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Employee Profile</h1>
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-1">
                            Directory <span className="mx-2 opacity-50">&gt;</span> {employee.name}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(`/employee/${employee.id}`)}
                        className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-blue-500/10 hover:bg-blue-700 active:scale-95 transition-all"
                    >
                        <FaEdit size={14} />
                        Edit Profile
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* LEFT: Profile Summary Card */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-8 text-center relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-blue-600 to-indigo-700 opacity-5"></div>
                        <div className="relative z-10">
                            <div className="h-28 w-28 rounded-[2rem] bg-slate-900 mx-auto flex items-center justify-center text-white text-4xl font-bold shadow-2xl shadow-slate-900/20 group-hover:scale-105 transition-transform duration-500 ring-8 ring-white">
                                {employee.name?.charAt(0).toUpperCase() || '?'}
                            </div>
                            <h2 className="text-xl font-bold text-slate-800 tracking-tight mt-5">{employee.name}</h2>
                            <p className="text-blue-600 font-bold text-[10px] uppercase tracking-wider mt-1">{employee.designation || '—'} • {employee.department || '—'}</p>

                            <div className="flex items-center justify-center gap-2 mt-4">
                                <span className="px-3 py-1.5 bg-slate-100 text-slate-500 text-[9px] font-bold uppercase tracking-widest rounded-xl border border-slate-200">
                                    {employee.employeeId || `EMP-${String(employee.id).padStart(4, '0')}`}
                                </span>
                                <span className={`px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest rounded-xl border flex items-center gap-1.5 ${employee.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                                    <div className={`h-1.5 w-1.5 rounded-full ${employee.status === 'ACTIVE' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></div>
                                    {employee.status || 'ACTIVE'}
                                </span>
                            </div>

                            <div className="mt-6 pt-6 border-t border-slate-50 space-y-4 text-left">
                                <InfoRow label="Employment Type" value={employee.employmentType || 'Full-Time'} />
                                <InfoRow label="Work Model" value={employee.workModel || 'On-Site'} />
                                <InfoRow label="Join Date" value={employee.joiningDate || 'N/A'} />
                                <InfoRow label="Experience" value={employee.experience ? `${employee.experience} yrs` : 'N/A'} />
                            </div>

                            <div className="mt-6 pt-6 border-t border-slate-50 flex justify-center gap-4">
                                {employee.linkedin && <SocialLink href={employee.linkedin} icon={<FaLinkedin size={16} />} color="hover:text-blue-600 hover:bg-blue-50" />}
                                {employee.twitter && <SocialLink href={employee.twitter} icon={<FaTwitter size={16} />} color="hover:text-sky-500 hover:bg-sky-50" />}
                                {employee.instagram && <SocialLink href={employee.instagram} icon={<FaInstagram size={16} />} color="hover:text-rose-500 hover:bg-rose-50" />}
                                {!employee.linkedin && !employee.twitter && !employee.instagram && (
                                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">No social links</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-8 space-y-5">
                        <h3 className="text-sm font-bold text-slate-800 tracking-tight uppercase">Contact Info</h3>
                        <ContactItem icon={<FaEnvelope size={12} />} label="Email" value={employee.email} />
                        <ContactItem icon={<FaPhone size={12} />} label="Phone" value={employee.phone || 'N/A'} />
                        <ContactItem icon={<FaUser size={12} />} label="Gender" value={employee.gender || 'N/A'} />
                        <ContactItem icon={<FaCalendarAlt size={12} />} label="Date of Birth" value={employee.dob || 'N/A'} />
                        <ContactItem icon={<FaMapMarkerAlt size={12} />} label="Location" value={[employee.address, employee.city].filter(Boolean).join(', ') || 'N/A'} />
                    </div>
                </div>

                {/* MIDDLE: Stats & Attendance */}
                <div className="lg:col-span-6 space-y-8">
                    {/* Leave Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <LeaveWidget label="Total Leaves" used={leaveStats.total.used} max={leaveStats.total.max} color="blue" />
                        <LeaveWidget label="Annual" used={leaveStats.annual.used} max={leaveStats.annual.max} color="emerald" />
                        <LeaveWidget label="Casual" used={leaveStats.casual.used} max={leaveStats.casual.max} color="amber" />
                        <LeaveWidget label="Sick" used={leaveStats.sick.used} max={leaveStats.sick.max} color="rose" />
                    </div>

                    {/* Attendance Performance */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 tracking-tight">Attendance Overview</h3>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="text-4xl font-bold text-slate-800 tracking-tighter">{attendanceStats.thisMonth}</span>
                                    <span className="text-[10px] font-semibold text-slate-400">Days present this month</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Perf Grade</p>
                                <p className="text-3xl font-bold text-blue-600 tracking-tighter">{attendanceStats.perfScore}</p>
                                <p className="text-[9px] font-semibold text-slate-400">Avg {attendanceStats.avgHours}h/day</p>
                            </div>
                        </div>

                        {/* Activity Heatmap — last 16 weeks */}
                        <div>
                            {/* Day labels */}
                            <div className="flex gap-1.5 mb-1.5">
                                <div className="flex flex-col gap-1.5 mr-0.5 shrink-0">
                                    {['M', 'T', 'W', 'T', 'F'].map((d, i) => (
                                        <div key={i} className="h-5 w-4 flex items-center justify-end">
                                            <span className="text-[8px] font-bold text-slate-300 uppercase">{d}</span>
                                        </div>
                                    ))}
                                </div>
                                {/* Heatmap grid */}
                                <div className="flex gap-1.5 overflow-hidden flex-1">
                                    {heatmapData.map((week, wi) => (
                                        <div key={wi} className="flex flex-col gap-1.5">
                                            {week.map((day, di) => {
                                                let bg, title;
                                                if (day.isFuture) {
                                                    bg = 'bg-slate-50 border border-slate-100';
                                                    title = day.date;
                                                } else if (!day.present) {
                                                    bg = 'bg-slate-100';
                                                    title = `${day.date} — Absent`;
                                                } else if (day.hours >= 9) {
                                                    bg = 'bg-blue-700';
                                                    title = `${day.date} — ${day.hours}h (Excellent)`;
                                                } else if (day.hours >= 7) {
                                                    bg = 'bg-blue-500';
                                                    title = `${day.date} — ${day.hours}h (Good)`;
                                                } else if (day.hours >= 4) {
                                                    bg = 'bg-blue-300';
                                                    title = `${day.date} — ${day.hours}h (Partial)`;
                                                } else {
                                                    bg = 'bg-blue-100';
                                                    title = `${day.date} — ${day.hours}h`;
                                                }
                                                return (
                                                    <div
                                                        key={di}
                                                        title={title}
                                                        className={`h-5 w-5 rounded-md cursor-default transition-transform hover:scale-125 hover:z-10 relative ${bg}`}
                                                    />
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Legend */}
                            <div className="flex items-center justify-end gap-2 mt-3">
                                <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">Less</span>
                                {['bg-slate-100', 'bg-blue-100', 'bg-blue-300', 'bg-blue-500', 'bg-blue-700'].map((c, i) => (
                                    <div key={i} className={`h-3.5 w-3.5 rounded-sm ${c}`} />
                                ))}
                                <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">More</span>
                            </div>
                        </div>
                        <div className="mt-6 grid grid-cols-3 gap-4 border-t border-slate-50 pt-6">
                            <div className="text-center">
                                <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Total Present</p>
                                <p className="text-xl font-bold text-slate-800 mt-1">{attendanceStats.presentDays}</p>
                            </div>
                            <div className="text-center border-x border-slate-50">
                                <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Hrs This Week</p>
                                <p className="text-xl font-bold text-slate-800 mt-1">{attendanceStats.hoursThisWeek}h</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Pending Leaves</p>
                                <p className={`text-xl font-bold mt-1 ${leaveStats.pending > 0 ? 'text-amber-500' : 'text-slate-800'}`}>{leaveStats.pending}</p>
                            </div>
                        </div>
                    </div>

                    {/* Leave Request History */}
                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-slate-800 tracking-tight uppercase">Leave History</h3>
                            <span className="bg-slate-50 text-slate-500 px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border border-slate-100">{leaves.length} Total</span>
                        </div>
                        {recentLeaves.length > 0 ? (
                            <div className="space-y-3">
                                {recentLeaves.map((lv, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-100 transition-all">
                                        <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${lv.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-500' : lv.status === 'PENDING' ? 'bg-amber-50 text-amber-500' : 'bg-rose-50 text-rose-500'}`}>
                                            {lv.status === 'APPROVED' ? <FaCheckCircle size={14} /> : lv.status === 'PENDING' ? <FaHourglass size={12} /> : <FaTimesCircle size={14} />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-bold text-slate-800 uppercase tracking-tight">{lv.type || 'Leave'}</p>
                                            <p className="text-[9px] font-semibold text-slate-400 mt-0.5">{lv.startDate} → {lv.endDate}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-lg text-[8px] font-semibold uppercase tracking-widest ${lv.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600' : lv.status === 'PENDING' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'}`}>
                                            {lv.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-10 flex flex-col items-center text-slate-300 border-2 border-dashed border-slate-100 rounded-[2rem]">
                                <FaCalendarAlt size={32} className="mb-3 opacity-30" />
                                <p className="text-[10px] font-bold uppercase tracking-widest">No leave records found</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT: Payroll & Info */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Payroll Summary */}
                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-8">
                        <h3 className="text-sm font-bold text-slate-800 tracking-tight uppercase mb-6">Payroll Summary</h3>
                        <div className="space-y-4">
                            <PayrollRow label="Base Salary" value={employee.salary} />
                            {(employee.transportationAllowance > 0 || employee.mealAllowance > 0 || employee.internetAllowance > 0) && (
                                <>
                                    <Divider label="Allowances" />
                                    {employee.transportationAllowance > 0 && <PayrollRow label="Transport" value={employee.transportationAllowance} small />}
                                    {employee.mealAllowance > 0 && <PayrollRow label="Meal Pool" value={employee.mealAllowance} small />}
                                    {employee.internetAllowance > 0 && <PayrollRow label="Connectivity" value={employee.internetAllowance} small />}
                                </>
                            )}
                            {(employee.healthInsurance > 0 || employee.lifeInsurance > 0) && (
                                <>
                                    <Divider label="Benefits" />
                                    {employee.healthInsurance > 0 && <PayrollRow label="Health Ins." value={employee.healthInsurance} small />}
                                    {employee.lifeInsurance > 0 && <PayrollRow label="Life Ins." value={employee.lifeInsurance} small />}
                                </>
                            )}
                            <div className="border-t border-slate-100 pt-4 mt-2 flex justify-between items-center">
                                <span className="text-[10px] font-bold text-slate-800 uppercase tracking-widest">Total Monthly CTC</span>
                                <span className="text-lg font-bold text-blue-600 tracking-tight">${totalCTC.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Professional Details */}
                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-8">
                        <h3 className="text-sm font-bold text-slate-800 tracking-tight uppercase mb-6">Professional Details</h3>
                        <div className="space-y-4">
                            <ContactItem icon={<FaBuilding size={12} />} label="Department" value={employee.department || 'N/A'} />
                            <ContactItem icon={<FaBriefcase size={12} />} label="Designation" value={employee.designation || 'N/A'} />
                            <ContactItem icon={<FaChartLine size={12} />} label="Experience" value={employee.experience ? `${employee.experience} years` : 'N/A'} />
                            <ContactItem icon={<FaCalendarAlt size={12} />} label="Joining Date" value={employee.joiningDate || 'N/A'} />
                        </div>
                    </div>

                    {/* Recent Attendance */}
                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-8">
                        <h3 className="text-sm font-bold text-slate-800 tracking-tight uppercase mb-6">Recent Attendance</h3>
                        {attendance.length > 0 ? (
                            <div className="space-y-3">
                                {[...attendance]
                                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                                    .slice(0, 5)
                                    .map((a, i) => (
                                        <div key={i} className="flex justify-between items-center p-3 rounded-2xl hover:bg-slate-50 transition-all">
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-800">{a.date}</p>
                                                <p className="text-[9px] font-bold text-slate-400 mt-0.5">
                                                    {a.checkIn || '—'} → {a.checkOut || 'Ongoing'}
                                                </p>
                                            </div>
                                            <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg border border-blue-100">
                                                {a.workingHours ? `${a.workingHours}h` : '—'}
                                            </span>
                                        </div>
                                    ))}
                            </div>
                        ) : (
                            <div className="py-8 flex flex-col items-center text-slate-300 border-2 border-dashed border-slate-100 rounded-[2rem]">
                                <FaClock size={24} className="mb-2 opacity-30" />
                                <p className="text-[9px] font-bold uppercase tracking-widest">No attendance records</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper components
const InfoRow = ({ label, value }) => (
    <div className="flex justify-between items-center">
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
        <span className="text-xs font-semibold text-slate-700">{value}</span>
    </div>
);

const ContactItem = ({ icon, label, value }) => (
    <div className="flex items-start gap-4">
        <div className="h-9 w-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shrink-0 mt-0.5">{icon}</div>
        <div className="overflow-hidden">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
            <p className="text-sm font-semibold text-slate-700 truncate">{value}</p>
        </div>
    </div>
);

const SocialLink = ({ href, icon, color }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 transition-all border border-slate-100 ${color}`}>
        {icon}
    </a>
);

const LeaveWidget = ({ label, used, max, color }) => {
    const pct = max > 0 ? Math.min(Math.round((used / max) * 100), 100) : 0;
    const circumference = 2 * Math.PI * 26;
    const strokeDashoffset = circumference - (pct / 100) * circumference;

    const colorMap = {
        blue: 'text-blue-500',
        emerald: 'text-emerald-500',
        amber: 'text-amber-500',
        rose: 'text-rose-500',
    };

    return (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 group hover:border-blue-200 transition-all text-center">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight mb-4">{label}</p>
            <div className="relative inline-flex items-center justify-center mb-3">
                <svg className="w-16 h-16 -rotate-90" viewBox="0 0 56 56">
                    <circle className="text-slate-100" strokeWidth="4" stroke="currentColor" fill="transparent" r="26" cx="28" cy="28" />
                    <circle
                        className={`${colorMap[color]} transition-all duration-1000`}
                        strokeWidth="4"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="26"
                        cx="28"
                        cy="28"
                    />
                </svg>
                <span className="absolute text-sm font-bold text-slate-800">{used}</span>
            </div>
            <p className="text-[9px] font-semibold text-slate-400">of {max} days</p>
        </div>
    );
};

const PayrollRow = ({ label, value, small }) => (
    <div className="flex justify-between items-center">
        <span className={`font-semibold text-slate-400 uppercase tracking-wider ${small ? 'text-[9px]' : 'text-[10px]'}`}>{label}</span>
        <span className={`font-bold text-slate-700 ${small ? 'text-[11px]' : 'text-xs'}`}>
            {value != null ? `$${Number(value).toLocaleString()}` : '—'}
        </span>
    </div>
);

const Divider = ({ label }) => (
    <div className="text-[8px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
        <div className="flex-1 h-[1px] bg-slate-50"></div>
        {label}
        <div className="flex-1 h-[1px] bg-slate-50"></div>
    </div>
);

export default PersonnelProfile;
