import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBuilding,
    FaIdBadge, FaWallet, FaClock, FaCalendarDay, FaVenusMars,
    FaArrowLeft, FaCheckCircle, FaTimesCircle, FaEdit,
    FaBriefcase, FaLinkedin, FaTwitter, FaInstagram
} from "react-icons/fa";
import api from "../../api/api";
import { toast } from "react-hot-toast";
import { FaHeart, FaPlane, FaWifi, FaCoffee, FaDumbbell, FaGraduationCap } from "react-icons/fa";

const UpdateUser = () => {
    const [currentTab, setCurrentTab] = useState('identity');
    const [saving, setSaving] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        department: "",
        designation: "",
        salary: "",
        joiningDate: "",
        status: "",
        gender: "",
        dob: "",
        address: "",
        city: "",
        experience: ""
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        })
    };

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await api.get(`/employee/${id}`);
                setFormData(response.data);
            } catch (error) {
                console.error("User fetching error", error);
            }
        }
        fetchEmployees();
    }, [id])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.patch(`/employee/${id}`, formData);
            toast.success("Employee updated successfully");
            navigate("/view/employees");
        } catch (error) {
            toast.error("Failed to update employee");
            console.error("Error updating user:", error);
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-10 flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-800 tracking-tight mb-2 uppercase">Edit Employee Details</h1>
                        <p className="text-slate-500 font-medium tracking-tight">Updating metadata for <span className="text-blue-600 font-bold">{formData.name}</span>.</p>
                    </div>
                    <button
                        onClick={() => navigate('/view/employees')}
                        className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm"
                    >
                        <FaArrowLeft size={20} />
                    </button>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                    {/* Tab Navigation */}
                    <div className="flex border-b border-slate-100 bg-slate-50/50 p-2 gap-1">
                        {[
                            { id: 'identity', label: 'Identity', icon: <FaUser /> },
                            { id: 'professional', label: 'Professional', icon: <FaBuilding /> },
                            { id: 'benefits', label: 'Benefits', icon: <FaWallet /> }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setCurrentTab(tab.id)}
                                className={`flex-1 flex items-center justify-center gap-2 py-4 px-4 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all ${currentTab === tab.id
                                    ? 'bg-white text-blue-600 shadow-sm border border-slate-100'
                                    : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'
                                    }`}
                            >
                                {tab.icon} {tab.label}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Tab Content */}
                        <div className="p-8 lg:p-12 min-h-[400px]">
                            {currentTab === 'identity' && (
                                <div className="space-y-8 animate-fade-in-up">
                                    <SectionHeader icon={<FaIdBadge className="text-blue-500" />} title="Primary Identity & Habitat" />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormInput icon={<FaUser />} label="Full Name" name="name" value={formData.name} onChange={handleInputChange} />
                                        <FormInput icon={<FaEnvelope />} label="Email Address" name="email" type="email" value={formData.email} onChange={handleInputChange} />
                                        <FormInput icon={<FaPhone />} label="Phone Number" name="phone" value={formData.phone} onChange={handleInputChange} />
                                        <FormInput icon={<FaMapMarkerAlt />} label="City" name="city" value={formData.city} onChange={handleInputChange} />
                                        <FormInput icon={<FaCalendarDay />} label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleInputChange} />
                                        <FormSelect
                                            icon={<FaVenusMars />}
                                            label="Gender"
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleInputChange}
                                            options={[
                                                { value: '', label: 'Select Gender' },
                                                { value: 'Male', label: 'Male' },
                                                { value: 'Female', label: 'Female' },
                                                { value: 'Other', label: 'Other / Non-Binary' }
                                            ]}
                                        />
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                                <FaMapMarkerAlt size={10} /> Physical Address
                                            </label>
                                            <textarea
                                                name="address"
                                                placeholder="Update street address..."
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                className="block w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/50 transition-all font-medium min-h-[120px] shadow-inner"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-slate-50">
                                        <SectionHeader icon={<FaLinkedin className="text-blue-600" />} title="Social Identity" />
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                                            <FormInput icon={<FaLinkedin />} label="LinkedIn" name="linkedin" value={formData.linkedin} onChange={handleInputChange} />
                                            <FormInput icon={<FaTwitter />} label="Twitter" name="twitter" value={formData.twitter} onChange={handleInputChange} />
                                            <FormInput icon={<FaInstagram />} label="Instagram" name="instagram" value={formData.instagram} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {currentTab === 'professional' && (
                                <div className="space-y-8 animate-fade-in-up">
                                    <SectionHeader icon={<FaBuilding className="text-indigo-500" />} title="Employment & Role" />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormInput icon={<FaIdBadge />} label="Employee ID" name="employeeId" value={formData.employeeId} onChange={handleInputChange} />
                                        <FormInput icon={<FaBuilding />} label="Department" name="department" value={formData.department} onChange={handleInputChange} />
                                        <FormInput icon={<FaBriefcase />} label="Designation" name="designation" value={formData.designation} onChange={handleInputChange} />
                                        <FormSelect
                                            icon={<FaClock />}
                                            label="Employment Type"
                                            name="employmentType"
                                            value={formData.employmentType}
                                            onChange={handleInputChange}
                                            options={[
                                                { value: 'Full-Time', label: 'Full-Time Permanent' },
                                                { value: 'Part-Time', label: 'Part-Time' },
                                                { value: 'Contract', label: 'Contractor' },
                                                { value: 'Intern', label: 'Internship' }
                                            ]}
                                        />
                                        <FormSelect
                                            icon={<FaMapMarkerAlt />}
                                            label="Work Model"
                                            name="workModel"
                                            value={formData.workModel}
                                            onChange={handleInputChange}
                                            options={[
                                                { value: 'Office', label: 'Office Presence' },
                                                { value: 'Remote', label: 'Remote First' },
                                                { value: 'Hybrid', label: 'Hybrid Configuration' }
                                            ]}
                                        />
                                        <FormSelect
                                            icon={<FaClock />}
                                            label="Current Status"
                                            name="status"
                                            value={formData.status}
                                            onChange={handleInputChange}
                                            options={[
                                                { value: 'ACTIVE', label: 'Active Personnel' },
                                                { value: 'INACTIVE', label: 'Inactive / Offboarded' },
                                                { value: 'ON_LEAVE', label: 'Temporary Leave' }
                                            ]}
                                        />
                                        <FormInput icon={<FaCalendarDay />} label="Joining Date" name="joiningDate" type="date" value={formData.joiningDate} onChange={handleInputChange} />
                                        <FormInput icon={<FaClock />} label="Previous Experience" name="experience" value={formData.experience} onChange={handleInputChange} />
                                    </div>
                                </div>
                            )}

                            {currentTab === 'benefits' && (
                                <div className="space-y-8 animate-fade-in-up">
                                    <SectionHeader icon={<FaWallet className="text-emerald-500" />} title="Financials & Subsidies" />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormInput icon={<FaWallet />} label="Base Annual Salary" name="salary" type="number" value={formData.salary} onChange={handleInputChange} />
                                        <FormInput icon={<FaPlane />} label="Transportation Allowance" name="transportationAllowance" type="number" value={formData.transportationAllowance} onChange={handleInputChange} />
                                        <FormInput icon={<FaCoffee />} label="Meal Allowance" name="mealAllowance" type="number" value={formData.mealAllowance} onChange={handleInputChange} />
                                        <FormInput icon={<FaWifi />} label="Internet/Remote Allowance" name="internetAllowance" type="number" value={formData.internetAllowance} onChange={handleInputChange} />
                                        <FormInput icon={<FaHeart />} label="Health Insurance" name="healthInsurance" type="number" value={formData.healthInsurance} onChange={handleInputChange} />
                                        <FormInput icon={<FaShieldAlt />} label="Life Insurance" name="lifeInsurance" type="number" value={formData.lifeInsurance} onChange={handleInputChange} />
                                        <FormInput icon={<FaGraduationCap />} label="Training Allocation" name="trainingProgram" type="number" value={formData.trainingProgram} onChange={handleInputChange} />
                                        <FormInput icon={<FaDumbbell />} label="Fitness Benefit" name="fitnessMembership" type="number" value={formData.fitnessMembership} onChange={handleInputChange} />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sticky Bottom Actions */}
                        <div className="p-6 lg:p-10 border-t border-slate-100 bg-slate-50/30 flex gap-4">
                            <button
                                type="button"
                                onClick={() => navigate('/view/employees')}
                                className="flex-1 bg-white text-slate-500 py-4 lg:py-5 rounded-2xl font-bold text-xs hover:bg-slate-50 hover:text-slate-900 transition-all uppercase tracking-widest border border-slate-200 flex items-center justify-center gap-2"
                            >
                                <FaTimesCircle /> Discard Changes
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className={`flex-[2] py-4 lg:py-5 rounded-2xl font-bold text-xs transition-all uppercase tracking-[0.2em] flex items-center justify-center gap-2 group ${saving
                                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                    : 'bg-slate-900 text-white hover:bg-blue-600 shadow-xl shadow-blue-500/10'
                                    }`}
                            >
                                {saving ? (
                                    <>
                                        <div className="h-4 w-4 border-2 border-slate-400 border-t-white rounded-full animate-spin"></div>
                                        Synchronizing...
                                    </>
                                ) : (
                                    <>
                                        <FaCheckCircle className="group-hover:scale-110 transition-transform" /> Commit Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

const SectionHeader = ({ icon, title }) => (
    <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
        <div className="h-12 w-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center">
            {icon}
        </div>
        <h3 className="text-[11px] font-bold text-slate-800 uppercase tracking-widest">{title}</h3>
    </div>
);

const FormInput = ({ icon, label, ...props }) => (
    <div className="space-y-2">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
            {React.cloneElement(icon, { size: 10 })} {label}
        </label>
        <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-300 group-focus-within:text-blue-500 transition-colors">
                {React.cloneElement(icon, { size: 16 })}
            </div>
            <input
                {...props}
                className="block w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 placeholder-slate-300 text-slate-900 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/50 transition-all font-bold text-sm shadow-inner"
            />
        </div>
    </div>
);

const FormSelect = ({ icon, label, options, ...props }) => (
    <div className="space-y-2">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
            {React.cloneElement(icon, { size: 10 })} {label}
        </label>
        <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-300 group-focus-within:text-blue-500 transition-colors">
                {React.cloneElement(icon, { size: 16 })}
            </div>
            <select
                {...props}
                className="block w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 text-slate-900 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/50 transition-all font-bold text-sm shadow-inner appearance-none cursor-pointer"
            >
                {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
        </div>
    </div>
);

export default UpdateUser;
