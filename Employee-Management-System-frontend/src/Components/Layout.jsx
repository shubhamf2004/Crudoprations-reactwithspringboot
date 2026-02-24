import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import { useAuth } from '../Context/AuthContext';
import { MdMenu, MdClose } from 'react-icons/md';
import { useState, useEffect } from 'react';

const Layout = ({ children }) => {
    const { user } = useAuth();
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Close mobile menu on route change could be added in a separate hook if needed
    // or passed down. For now, we'll just handle the state here.

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-700 overflow-x-hidden">
            {user && (
                <>
                    {/* Mobile Backdrop */}
                    {isMobileMenuOpen && (
                        <div
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                    )}

                    <Sidebar
                        isCollapsed={isSidebarCollapsed}
                        setIsCollapsed={setIsSidebarCollapsed}
                        isMobileOpen={isMobileMenuOpen}
                        setIsMobileOpen={setIsMobileMenuOpen}
                    />
                </>
            )}

            <div className={`flex flex-col flex-1 min-h-screen transition-all duration-300 ease-in-out ${user
                ? (isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72')
                : ''
                }`}>

                {user ? (
                    /* Dashboard Top Bar (Mobile Only or Desktop with breadcrumbs) */
                    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 bg-white/80 backdrop-blur-md border-b border-slate-100 lg:hidden">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsMobileMenuOpen(true)}
                                className="p-2 text-slate-500 hover:bg-slate-50 rounded-xl transition-colors"
                            >
                                <MdMenu size={24} />
                            </button>
                            <span className="text-sm font-bold text-slate-800 uppercase tracking-widest">EmployeeHub</span>
                        </div>
                    </header>
                ) : (
                    <Header />
                )}

                <main className={`flex-grow ${user ? 'p-4 md:p-8 lg:p-10' : 'container mx-auto px-4 py-8'}`}>
                    <div className={user ? 'max-w-7xl mx-auto' : ''}>
                        {children}
                    </div>
                </main>
                {!user && <Footer />}
            </div>
        </div>
    );
};

export default Layout;
