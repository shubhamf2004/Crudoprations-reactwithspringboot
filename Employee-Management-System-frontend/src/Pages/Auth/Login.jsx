import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaLock, FaSignInAlt } from 'react-icons/fa';
import { useAuth } from '../../Context/AuthContext';
import { toast } from 'react-hot-toast';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const result = await login(email, password);
            if (result && !result.pending) {
                toast.success('Session established successfully');
                navigate('/view');
            } else if (result && result.pending) {
                const msg = result.message || 'Your account is pending admin approval.';
                toast.error(msg);
                setError(msg);
            } else {
                toast.error('Invalid email or password');
                setError('Invalid email or password');
            }
        } catch (err) {
            toast.error('Security authorization failed');
            setError('An error occurred during login. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Visual Decor */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl -mr-64 -mt-64 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl -ml-64 -mb-64 animate-pulse delay-700"></div>

            <div className="max-w-md w-full space-y-8 bg-white/70 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-white/40 relative z-10">
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-slate-800 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-slate-800/10 rotate-3 transition-transform duration-500">
                        <FaLock size={28} />
                    </div>
                    <h2 className="mt-8 text-4xl font-bold text-slate-800 tracking-tight">Access Secured</h2>
                    <p className="mt-2 text-slate-500 font-medium">Enterprise Management System v2.0</p>
                </div>
                <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Authority</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                    <FaUser size={14} />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 placeholder-slate-400 text-slate-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all font-medium"
                                    placeholder="Enter corporate email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Secure Passkey</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                    <FaLock size={14} />
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 placeholder-slate-400 text-slate-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all font-medium"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-xs font-bold text-center bg-red-50 py-3 rounded-2xl border border-red-100 animate-shake">
                            {error}
                        </div>
                    )}

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-2xl text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-all shadow-2xl shadow-slate-900/10 active:scale-[0.98] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            <span className="absolute right-6 inset-y-0 flex items-center">
                                <FaSignInAlt className="h-4 w-4 text-slate-400 group-hover:text-white transition-colors" />
                            </span>
                            {loading ? 'AUTHORIZING...' : 'ESTABLISH SESSION'}
                        </button>
                    </div>

                    <div className="text-center pt-4 border-t border-slate-50">
                        <span className="text-slate-400 text-xs font-medium">New to the enterprise?</span>{' '}
                        <Link to="/signup" className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-tight">
                            Request Credentials
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
