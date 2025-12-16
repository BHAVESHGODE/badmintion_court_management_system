import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LoginModal = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await login(email, password);
        if (res.success) {
            onClose();
            navigate('/dashboard');
        } else {
            setError(res.message);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-md bg-dark-900 border border-white/10 p-8 rounded-3xl shadow-2xl overflow-hidden"
                >
                    {/* Background Effects */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-lime/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>

                    <div className="text-center mb-8 relative z-10">
                        <h2 className="text-3xl font-heading font-bold uppercase tracking-wider text-white mb-2">Welcome Back</h2>
                        <p className="text-gray-400">Enter your credentials to access the arena</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl mb-6 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form className="space-y-4 relative z-10">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                                className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-xl focus:ring-1 focus:ring-brand-lime focus:border-brand-lime outline-none text-white transition-all placeholder-gray-600"
                                placeholder="player@courtbooker.com"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                                className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-xl focus:ring-1 focus:ring-brand-lime focus:border-brand-lime outline-none text-white transition-all placeholder-gray-600"
                                placeholder="••••••••"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="w-full bg-brand-lime text-black py-3 rounded-xl font-heading font-bold text-lg uppercase tracking-wider hover:bg-white hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(57,255,20,0.3)] mt-2"
                        >
                            Login
                        </button>
                    </form>

                    <p className="text-center mt-6 text-gray-400 text-sm relative z-10">
                        Don't have an account?{' '}
                        <button
                            onClick={() => {
                                onClose();
                                navigate('/register');
                            }}
                            className="text-brand-lime font-bold hover:underline uppercase tracking-wide ml-1"
                        >
                            Join Now
                        </button>
                    </p>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default LoginModal;
