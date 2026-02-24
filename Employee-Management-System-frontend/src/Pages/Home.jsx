import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { FaUsers, FaChartLine, FaShieldAlt, FaArrowRight } from 'react-icons/fa';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="bg-white font-sans selection:bg-blue-100 selection:text-blue-700">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden bg-slate-50 pb-20  sm:pb-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.blue.50),theme(colors.white))] opacity-40"></div>
        <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl shadow-blue-600/5 ring-1 ring-blue-50 sm:mr-28 lg:mr-32" aria-hidden="true"></div>
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl py-32 sm:py-48 lg:py-56 text-center animate-fade-in-up">
            <div className="hidden sm:mb-10 sm:flex sm:justify-center">
              <div className="relative rounded-full px-5 py-1.5 text-xs font-semibold leading-6 text-slate-500 ring-1 ring-slate-900/5 hover:ring-slate-900/10 transition-all bg-white/50 backdrop-blur-sm shadow-sm">
                Unveiling Enterprise v2.0 <Link to="#" className="font-semibold text-blue-600 ml-2">Read more <span aria-hidden="true">&rarr;</span></Link>
              </div>
            </div>
            <h1 className="text-5xl font-semibold tracking-tight text-slate-900 sm:text-7xl mb-8 leading-[1.1]">
              Elevate your workforce <br />
              <span className="text-blue-600 font-medium">with intelligence.</span>
            </h1>
            <p className="mt-8 text-xl leading-8 text-slate-500 font-medium max-w-2xl mx-auto">
              A sophisticated platform designed for modern personnel management. Track, nurture, and optimize your global team with unparalleled ease and security.
            </p>
            <div className="mt-12 flex items-center justify-center gap-x-8">
              <Link
                to={user ? "/view" : "/login"}
                className="rounded-2xl bg-slate-800 px-10 py-4.5 text-sm font-semibold text-white shadow-2xl shadow-slate-800/10 hover:bg-slate-900 transition-all transform hover:-translate-y-0.5 no-underline hover:no-underline"
              >
                {user ? "Enter Dashboard" : "Get started"}
              </Link>
              {(!user || user?.role === 'ROLE_ADMIN' || user?.role === 'ROLE_HR') && (
                <Link to="/employee" className="text-sm font-semibold leading-6 text-slate-900 flex items-center gap-2 hover:text-blue-600 transition-colors no-underline hover:no-underline group">
                  Add Personnel <FaArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-32 sm:py-40 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-24">
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-blue-600 mb-4">Ecosystem Capabilities</h2>
            <p className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl mb-6">
              Modern tools for modern teams
            </p>
            <p className="text-lg leading-8 text-slate-500 font-medium">
              We've re-engineered HR workflows to be fluid, intuitive, and highly secure.
            </p>
          </div>
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-12 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-600/5 hover:-translate-y-2 group">
                <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-800 shadow-sm group-hover:bg-slate-800 group-hover:text-white transition-colors duration-500">
                  <FaUsers className="h-6 w-6" />
                </div>
                <dt className="text-xl font-semibold leading-7 text-slate-900 mb-4">
                  Unified Records
                </dt>
                <dd className="text-base leading-7 text-slate-500 font-medium">
                  Centralize personnel data in a highly accessible repository. Real-time updates across the entire organizational network.
                </dd>
              </div>
              <div className="flex flex-col p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-600/5 hover:-translate-y-2 group">
                <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-800 shadow-sm group-hover:bg-slate-800 group-hover:text-white transition-colors duration-500">
                  <FaChartLine className="h-6 w-6" />
                </div>
                <dt className="text-xl font-semibold leading-7 text-slate-900 mb-4">
                  Analytics Hub
                </dt>
                <dd className="text-base leading-7 text-slate-500 font-medium">
                  Gain deep insights into workforce metrics and operational trends with high-fidelity visualization tools.
                </dd>
              </div>
              <div className="flex flex-col p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-600/5 hover:-translate-y-2 group">
                <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-800 shadow-sm group-hover:bg-slate-800 group-hover:text-white transition-colors duration-500">
                  <FaShieldAlt className="h-6 w-6" />
                </div>
                <dt className="text-xl font-semibold leading-7 text-slate-900 mb-4">
                  Secured Access
                </dt>
                <dd className="text-base leading-7 text-slate-500 font-medium">
                  Enterprise-grade security protocols ensuring data integrity and role-based permissions at every layer.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
