import React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';

const NoMatch = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <FaExclamationTriangle className="text-amber-500 text-6xl mb-6 opacity-80" />
      <h1 className="text-4xl font-bold text-slate-800 tracking-tight mb-3">Terminal Error: 404</h1>
      <p className="text-slate-500 font-medium text-lg mb-10 max-w-md uppercase tracking-tight">
        The requested resource is off-grid or has been purged from the intelligence network.
      </p>
      <Link
        to="/"
        className="inline-flex items-center justify-center px-10 py-4.5 bg-blue-600 text-white text-xs font-bold uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-500/10 hover:bg-blue-700 transition-all active:scale-95 no-underline hover:no-underline"
      >
        Re-establish Uplink
      </Link>
    </div>
  );
};

export default NoMatch;
