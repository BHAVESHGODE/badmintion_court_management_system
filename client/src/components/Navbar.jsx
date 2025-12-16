import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Menu, X, Power, Zap, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoginModal from './LoginModal';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinkClass = (path) => `text-sm font-bold uppercase tracking-widest transition-colors ${location.pathname === path
        ? 'text-brand-lime dark:text-brand-lime'
        : 'text-gray-600 dark:text-gray-300 hover:text-brand-lime dark:hover:text-brand-lime'
        }`;

    return (
        <>
            <nav className={`fixed w-full z-50 transition-all duration-500 border-b ${scrolled
                ? 'bg-white/80 dark:bg-dark-950/80 backdrop-blur-lg border-gray-200 dark:border-white/10 py-3'
                : 'bg-transparent border-transparent py-6'
                }`}>
                <div className="container mx-auto px-6">
                    <div className="flex justify-between items-center">
                        <Link to="/" className="flex items-center space-x-2 group">
                            <div className="relative">
                                <div className="absolute inset-0 bg-brand-lime blur-md opacity-20 group-hover:opacity-60 transition-opacity"></div>
                                <Zap className="w-8 h-8 text-primary dark:text-brand-lime relative z-10 transform group-hover:rotate-12 transition-transform duration-300" />
                            </div>
                            <span className="text-2xl font-heading font-bold uppercase tracking-wider text-primary dark:text-white">
                                Pro<span className="text-brand-lime">Racket</span>
                            </span>
                        </Link>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center space-x-8">
                            <Link to="/" className={navLinkClass('/')}>Home</Link>
                            <Link to="/tournaments" className={navLinkClass('/tournaments')}>Tournaments</Link>
                            <Link to="/about" className={navLinkClass('/about')}>About</Link>
                            {/* Placeholder for Courses */}
                            <Link to="/courses" className={navLinkClass('/courses')}>Courses</Link>

                            {user ? (
                                <>
                                    <Link to="/dashboard" className={navLinkClass('/dashboard')}>Bookings</Link>
                                    {user.role === 'admin' && (
                                        <Link to="/admin" className="text-sm font-bold uppercase tracking-widest text-brand-violet hover:text-brand-violet/80 transition-colors">Admin</Link>
                                    )}
                                    {user.role === 'owner' && (
                                        <Link to="/owner-dashboard" className="text-sm font-bold uppercase tracking-widest text-yellow-500 hover:text-yellow-400 transition-colors">Owner</Link>
                                    )}

                                    <div className="flex items-center space-x-4 pl-4 border-l border-gray-300 dark:border-white/10">
                                        <Link to="/profile" className="flex flex-col text-right hover:opacity-80 transition-opacity cursor-pointer">
                                            <span className="text-xs text-brand-lime font-medium uppercase tracking-wider">Profile</span>
                                            <span className="text-sm font-bold text-black dark:text-white">{user.name}</span>
                                        </Link>
                                        <button
                                            onClick={logout}
                                            className="w-10 h-10 rounded-full bg-gray-100 dark:bg-dark-800 flex items-center justify-center hover:bg-red-500/10 hover:text-red-500 transition-all border border-gray-200 dark:border-white/5 text-gray-600 dark:text-white"
                                        >
                                            <Power className="w-4 h-4" />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => setIsLoginModalOpen(true)}
                                        className="text-sm font-bold uppercase tracking-widest text-gray-600 dark:text-gray-300 hover:text-brand-lime dark:hover:text-brand-lime transition-colors"
                                    >
                                        Login
                                    </button>
                                    <Link to="/register" className="px-6 py-2 bg-brand-lime text-black font-heading font-bold text-xl uppercase tracking-wide hover:bg-white transition-all transform hover:-translate-y-1 shadow-[0_0_20px_rgba(57,255,20,0.3)] clip-path-polygon">
                                        Join Now
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile Toggle */}
                        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-black dark:text-white">
                            {isOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: '100vh' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden bg-white dark:bg-dark-950 fixed inset-0 top-[70px] z-40 p-6 overflow-y-auto"
                        >
                            <div className="flex flex-col space-y-6 pt-10">
                                <Link to="/" onClick={() => setIsOpen(false)} className="text-4xl font-heading font-bold uppercase text-black dark:text-white hover:text-brand-lime">Home</Link>
                                <Link to="/tournaments" onClick={() => setIsOpen(false)} className="text-4xl font-heading font-bold uppercase text-black dark:text-white hover:text-brand-lime">Tournaments</Link>
                                <Link to="/about" onClick={() => setIsOpen(false)} className="text-4xl font-heading font-bold uppercase text-black dark:text-white hover:text-brand-lime">About</Link>
                                <Link to="/courses" onClick={() => setIsOpen(false)} className="text-4xl font-heading font-bold uppercase text-black dark:text-white hover:text-brand-lime">Courses</Link>
                                <Link to="/contact" onClick={() => setIsOpen(false)} className="text-4xl font-heading font-bold uppercase text-black dark:text-white hover:text-brand-lime">Contact</Link>

                                <hr className="border-gray-200 dark:border-white/10" />

                                {user ? (
                                    <>
                                        <Link to="/profile" onClick={() => setIsOpen(false)} className="text-4xl font-heading font-bold uppercase text-black dark:text-white hover:text-brand-lime">My Profile</Link>
                                        <Link to="/dashboard" onClick={() => setIsOpen(false)} className="text-4xl font-heading font-bold uppercase text-black dark:text-white hover:text-brand-lime">My Bookings</Link>
                                        <button onClick={logout} className="text-xl font-bold text-red-500 text-left">Log Out</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => { setIsOpen(false); setIsLoginModalOpen(true); }} className="text-4xl font-heading font-bold uppercase text-black dark:text-white hover:text-brand-lime text-left">Login</button>
                                        <Link to="/register" onClick={() => setIsOpen(false)} className="text-4xl font-heading font-bold uppercase text-brand-lime">Join Now</Link>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
        </>
    );
};

export default Navbar;
