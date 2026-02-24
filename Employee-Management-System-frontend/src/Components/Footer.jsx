import React from 'react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-slate-50 border-t border-slate-100 py-16 mt-auto">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="text-center md:text-left">
                        <div className="flex items-center gap-3 justify-center md:justify-start mb-4">
                            <div className="bg-slate-950 text-white p-1.5 rounded-xl">
                                <span className="font-bold text-xs tracking-tighter">EH</span>
                            </div>
                            <h2 className="text-lg font-semibold text-slate-900 tracking-tight">EmployeeHub</h2>
                        </div>
                        <p className="text-sm text-slate-500 font-medium max-w-xs">Precision engineering for the modern global workforce ecosystem.</p>
                        <p className="text-xs text-slate-400 font-black uppercase tracking-widest mt-6">&copy; {new Date().getFullYear()} ARCHITECTURAL REGISTRY</p>
                    </div>
                    <div className="flex space-x-8">
                        <SocialLink icon={<FaGithub />} />
                        <SocialLink icon={<FaLinkedin />} />
                        <SocialLink icon={<FaTwitter />} />
                    </div>
                </div>
            </div>
        </footer>
    );
};

const SocialLink = ({ icon }) => (
    <a href="#" className="h-12 w-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-950 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
        {React.cloneElement(icon, { size: 20 })}
    </a>
);

export default Footer;
