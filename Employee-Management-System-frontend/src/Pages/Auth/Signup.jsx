import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaLock, FaUserPlus } from 'react-icons/fa';
import { useAuth } from '../../Context/AuthContext';
import { toast } from 'react-hot-toast';

const Signup = () => {
    const { signup } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'ROLE_USER'
    });
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const message = await signup(formData);
            toast.success(message || 'Registration successful! Awaiting administrative approval.');
            navigate('/login');
        } catch (err) {
            toast.error(err.message || 'Signup failed. Please try again.');
            setError(err.message || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Visual Decor */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl -ml-64 -mt-64 animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl -mr-64 -mb-64 animate-pulse delay-700"></div>

            <div className="max-w-xl w-full space-y-8 bg-white/70 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-white/40 relative z-10">
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-slate-800 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-slate-800/10 -rotate-3 transition-transform duration-500">
                        <FaUser size={28} />
                    </div>
                    <h2 className="mt-8 text-4xl font-bold text-slate-800 tracking-tight">Onboarding Portal</h2>
                    <p className="mt-2 text-slate-500 font-medium">Initialize your enterprise identity</p>
                </div>

                <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Identity Handle</label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                className="block w-full px-4 py-4 bg-slate-50 border border-slate-100 placeholder-slate-400 text-slate-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all font-medium"
                                placeholder="Username"
                                value={formData.username}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Official Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="block w-full px-4 py-4 bg-slate-50 border border-slate-100 placeholder-slate-400 text-slate-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all font-medium"
                                placeholder="name@enterprise.com"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Security Key</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="block w-full px-4 py-4 bg-slate-50 border border-slate-100 placeholder-slate-400 text-slate-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all font-medium"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Strategic Role</label>
                            <select
                                name="role"
                                className="block w-full px-4 py-4 bg-slate-50 border border-slate-100 text-slate-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all font-medium appearance-none"
                                value={formData.role}
                                onChange={handleInputChange}
                            >
                                <option value="ROLE_USER">Standard Personnel</option>
                                <option value="ROLE_HR">HR Specialist</option>
                                <option value="ROLE_ADMIN">System Administrator</option>
                            </select>
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-xs font-bold text-center bg-red-50 py-3 rounded-2xl border border-red-100 italic">
                            {error}
                        </div>
                    )}

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-2xl text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-all shadow-2xl shadow-slate-900/10 active:scale-[0.98] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'INITIALIZING...' : 'GENERATE CREDENTIALS'}
                        </button>
                    </div>

                    <div className="text-center pt-4 border-t border-slate-50">
                        <span className="text-slate-400 text-xs font-medium">Already registered?</span>{' '}
                        <Link to="/login" className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-tight">
                            Execute Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;
