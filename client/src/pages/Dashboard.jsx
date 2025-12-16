import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, MapPin, Trophy, Activity, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const { user } = useAuth();

    // Mock Stats for the "Perfect" feel
    const stats = [
        { label: 'Matches Played', value: '12', icon: Trophy, bg: 'bg-brand-violet/20', color: 'text-brand-violet' },
        { label: 'Win Rate', value: '68%', icon: Activity, bg: 'bg-brand-lime/20', color: 'text-brand-lime' },
        { label: 'Upcoming', value: '2', icon: Calendar, bg: 'bg-blue-500/20', color: 'text-blue-500' },
    ];

    const { data: bookings, isLoading } = useQuery({
        queryKey: ['my-bookings'],
        queryFn: async () => {
            const res = await api.get('/bookings/my');
            return res.data.data;
        }
    });

    if (isLoading) return (
        <div className="min-h-screen bg-dark-950 pt-32 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-brand-lime border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-dark-950 pt-32 pb-20 text-white">
            <div className="container mx-auto px-6">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-heading font-black uppercase mb-2">
                            Welcome, <span className="text-brand-lime">{user?.name?.split(' ')[0]}</span>
                        </h1>
                        <p className="text-gray-400">Ready to dominate the court today?</p>
                    </div>
                    <button className="hidden md:flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-colors">
                        View Profile <ArrowRight size={16} />
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-dark-900 border border-white/5 p-6 rounded-2xl flex items-center gap-6"
                        >
                            <div className={`w-16 h-16 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                                <stat.icon size={32} />
                            </div>
                            <div>
                                <h3 className="text-4xl font-heading font-bold">{stat.value}</h3>
                                <p className="text-gray-400 text-sm uppercase tracking-wider font-bold">{stat.label}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Bookings Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-heading font-bold uppercase mb-6 flex items-center gap-3">
                        <Calendar className="text-brand-lime" /> Your Bookings
                    </h2>

                    {bookings && bookings.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4">
                            {bookings.map((booking, idx) => (
                                <motion.div
                                    key={booking._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 + (idx * 0.05) }}
                                    className="bg-dark-900 p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row justify-between items-center group hover:border-brand-lime/50 transition-colors"
                                >
                                    <div className="flex items-center gap-6 w-full md:w-auto">
                                        <div className="bg-dark-800 p-4 rounded-xl text-center min-w-[80px]">
                                            <span className="block text-xs font-bold text-gray-500 uppercase">
                                                {booking.startTime ? new Date(booking.startTime).toLocaleString('default', { month: 'short' }) : 'N/A'}
                                            </span>
                                            <span className="block text-2xl font-black text-white">
                                                {booking.startTime ? new Date(booking.startTime).getDate() : '--'}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-brand-lime transition-colors">
                                                {booking.court?.name || 'Unknown Court'}
                                            </h3>
                                            <div className="flex items-center space-x-4 text-gray-400 text-sm font-medium">
                                                <span className="flex items-center">
                                                    <Clock className="w-4 h-4 mr-1 text-brand-violet" />
                                                    {booking.startTime ? new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''} -
                                                    {booking.endTime ? new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 md:mt-0 w-full md:w-auto flex flex-row md:flex-col justify-between items-center md:items-end p-4 md:p-0 bg-white/5 md:bg-transparent rounded-xl">
                                        <div className="text-2xl font-bold text-white">₹{booking.totalPrice}</div>
                                        <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider mt-1 ${booking.status === 'confirmed' ? 'bg-brand-lime/20 text-brand-lime' :
                                                booking.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                                                    'bg-red-500/20 text-red-500'
                                            }`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-dark-900 border border-white/5 p-12 rounded-3xl text-center">
                            <div className="w-20 h-20 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-600">
                                <Calendar size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">No active bookings</h3>
                            <p className="text-gray-400 mb-6">You haven't booked any courts yet.</p>
                            <button className="px-8 py-3 bg-white text-black rounded-xl font-bold uppercase tracking-wider hover:bg-brand-lime transition-colors">
                                Book Now
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
