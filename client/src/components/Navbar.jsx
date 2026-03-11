import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../app/features/authSlice';
import { LogOut, User, Menu, X, Home, Layout, Mail, Zap, HelpCircle, ClipboardList } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';

const Navbar = () => {
    const { user } = useSelector(state => state.auth);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const logoutUser = () => {
        navigate('/');
        dispatch(logout());
        setIsSidebarOpen(false);
    };

    const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

    const navLinks = [
        { name: 'Home', path: '/#home', icon: Home },
        { name: 'Features', path: '/#features', icon: Zap },
        { name: 'ATS Analyzer', path: '/app/ats-analyzer', icon: ClipboardList },
        { name: 'Templates', path: '/templates', icon: Layout },
        { name: 'FAQ', path: '/#faq', icon: HelpCircle },
        { name: 'Contact', path: '/contact', icon: Mail }
    ];

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <>
            <div className='fixed top-4 md:top-6 left-0 right-0 z-[100] flex justify-center px-4 md:px-8 pointer-events-none'>
                <nav className='w-full max-w-7xl bg-white/80 backdrop-blur-2xl border border-white/40 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all pointer-events-auto'>
                    <div className='px-4 md:px-10 h-14 md:h-16 flex items-center justify-between'>

                        {/* Logo Section */}
                        <div className='flex-shrink-0'>
                            <Link to='/' className='flex items-center gap-2 group'>
                                <Logo className="scale-75 md:scale-90 origin-left" />
                            </Link>
                        </div>

                        {/* Desktop Navigation Links */}
                        <div className='hidden md:flex items-center gap-8 lg:gap-10'>
                            {navLinks.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    onClick={() => item.name === 'Home' && window.scrollTo({ top: 0, behavior: 'smooth' })}
                                    className={`text-xs lg:text-sm font-bold transition-all duration-300 relative group ${location.pathname === item.path ? 'text-primary-accent' : 'text-slate-500 hover:text-primary-accent'}`}
                                >
                                    {item.name}
                                    <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary-accent transition-all duration-300 ${location.pathname === item.path ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                                </Link>
                            ))}
                        </div>

                        {/* Actions & Profile */}
                        <div className='flex items-center gap-2 md:gap-4 lg:gap-6'>
                            {!user ? (
                                <div className="hidden sm:flex items-center gap-2">
                                    <Link to='/app?state=login' className="px-5 py-2 text-slate-700 font-bold hover:text-primary-accent transition-colors text-xs lg:text-sm">
                                        Login
                                    </Link>
                                    <Link to='/app?state=register' className="px-5 py-2.5 bg-slate-900 text-white font-bold rounded-full hover:bg-primary-accent transition-all duration-300 text-xs lg:text-sm shadow-lg shadow-slate-200">
                                        Get Started
                                    </Link>
                                </div>
                            ) : (
                                <div className='flex items-center gap-2 md:gap-4'>
                                    {user?.email === 'aaftabansari034@gmail.com' && (
                                        <Link to='/admin' className='text-[10px] lg:text-xs font-black text-slate-700 hover:text-primary-accent transition-colors uppercase tracking-wider block'>
                                            Admin
                                        </Link>
                                    )}

                                    <div className='flex items-center gap-2 pl-3 md:pl-6 border-l border-slate-200/60'>
                                        <div className='hidden sm:flex flex-col items-end'>
                                            <span className='text-[10px] lg:text-xs font-black text-slate-900 truncate max-w-[100px]'>
                                                {user?.name || 'User'}
                                            </span>
                                            <span className='text-[8px] text-primary-accent font-black uppercase tracking-[0.1em]'>
                                                {user?.role || 'Member'}
                                            </span>
                                        </div>
                                        <div className='size-8 md:size-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-xs shadow-xl shadow-slate-200 ring-2 ring-white'>
                                            {userInitial}
                                        </div>
                                    </div>

                                    <button onClick={logoutUser} className='hidden sm:flex group p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-300'>
                                        <LogOut className='size-4 md:size-5' />
                                    </button>
                                </div>
                            )}

                            {/* Mobile Menu Button */}
                            <button
                                onClick={toggleSidebar}
                                className='md:hidden p-2 rounded-full bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors'
                            >
                                <Menu className='size-5' />
                            </button>
                        </div>
                    </div>
                </nav>
            </div>

            {/* Mobile Sidebar Menu */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={toggleSidebar}
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[110] md:hidden pointer-events-auto"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-[280px] bg-white z-[120] md:hidden shadow-2xl flex flex-col pointer-events-auto"
                        >
                            <div className="p-6 flex items-center justify-between border-b border-slate-50">
                                <Logo className="scale-75 origin-left" />
                                <button onClick={toggleSidebar} className="p-2 rounded-xl bg-slate-50 text-slate-600">
                                    <X className="size-5" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-2">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Navigation</p>
                                {navLinks.map((item) => (
                                    <Link
                                        key={item.name}
                                        to={item.path}
                                        onClick={toggleSidebar}
                                        className={`flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${location.pathname === item.path ? 'bg-orange-50 text-primary-accent' : 'text-slate-600 hover:bg-slate-50 active:scale-95'}`}
                                    >
                                        <item.icon className="size-5" />
                                        <span>{item.name}</span>
                                    </Link>
                                ))}

                                <div className="pt-6 mt-6 border-t border-slate-50 space-y-4">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Account</p>
                                    {!user ? (
                                        <div className="space-y-3">
                                            <Link to="/app?state=login" onClick={toggleSidebar} className="flex items-center gap-4 p-4 rounded-2xl font-bold text-slate-600 hover:bg-slate-50">
                                                <User className="size-5" />
                                                <span>Login</span>
                                            </Link>
                                            <Link to="/app?state=register" onClick={toggleSidebar} className="flex items-center justify-center p-4 rounded-2xl font-bold bg-slate-900 text-white shadow-xl shadow-slate-200">
                                                Get Started
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <Link to="/app" onClick={toggleSidebar} className="flex items-center gap-4 p-4 rounded-2xl font-bold text-slate-600 hover:bg-slate-50">
                                                <Layout className="size-5" />
                                                <span>Dashboard</span>
                                            </Link>
                                            {user?.email === 'aaftabansari034@gmail.com' && (
                                                <Link to="/admin" onClick={toggleSidebar} className="flex items-center gap-4 p-4 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 border-l-4 border-primary-accent/20">
                                                    <Zap className="size-5 text-primary-accent" />
                                                    <span>Admin Dashboard</span>
                                                </Link>
                                            )}
                                            <button onClick={logoutUser} className="w-full flex items-center gap-4 p-4 rounded-2xl font-bold text-red-500 hover:bg-red-50">
                                                <LogOut className="size-5" />
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="p-6 border-t border-slate-50">
                                <div className="p-6 bg-slate-50 rounded-[32px] text-center">
                                    <p className="text-xs font-bold text-slate-500 mb-4 italic">Ready to shine?</p>
                                    <Link to="/app" onClick={toggleSidebar} className="block w-full py-3 bg-primary-accent text-white font-black rounded-2xl shadow-lg shadow-orange-200 text-sm">
                                        Build Your Resume
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;