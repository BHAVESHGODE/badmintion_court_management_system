import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await register(name, email, password);
        if (res.success) {
            navigate('/dashboard');
        } else {
            setError(res.message);
        }
    };

    return (
        <div className="bg-dark-950 min-h-screen grid items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-violet/20 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-lime/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>
            </div>

            <div className="relative z-10 w-full max-w-md bg-dark-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-heading font-bold uppercase tracking-wider text-white mb-2">Join the Elite</h2>
                    <p className="text-gray-400">Create your athlete profile today</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl mb-6 text-sm flex items-center justify-center">
                        {error}
                    </div>
                )}

                <form className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                            className="w-full px-5 py-4 bg-dark-800 border border-white/10 rounded-xl focus:ring-2 focus:ring-brand-lime focus:border-transparent outline-none text-white transition-all placeholder-gray-600"
                            placeholder="John Doe"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                            className="w-full px-5 py-4 bg-dark-800 border border-white/10 rounded-xl focus:ring-2 focus:ring-brand-lime focus:border-transparent outline-none text-white transition-all placeholder-gray-600"
                            placeholder="player@courtbooker.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                            className="w-full px-5 py-4 bg-dark-800 border border-white/10 rounded-xl focus:ring-2 focus:ring-brand-lime focus:border-transparent outline-none text-white transition-all placeholder-gray-600"
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="w-full bg-brand-lime text-black py-4 rounded-xl font-heading font-bold text-xl uppercase tracking-wider hover:bg-white hover:scale-[1.02] transition-all transform active:scale-95 shadow-[0_0_20px_rgba(204,255,0,0.3)] hover:shadow-[0_0_30px_rgba(204,255,0,0.5)]"
                    >
                        Register
                    </button>
                </form>

                <p className="text-center mt-8 text-gray-400">
                    Already have an account?{' '}
                    <span onClick={() => navigate('/login')} className="text-brand-lime font-bold cursor-pointer hover:underline uppercase tracking-wide">
                        Login
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Register;
