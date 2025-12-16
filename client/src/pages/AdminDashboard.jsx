import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';
import { useState } from 'react';
import {
    Trash2, Plus, Calendar, DollarSign, Users,
    BarChart2, TrendingUp, Activity, CheckCircle, XCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const queryClient = useQueryClient();

    const { data: courts } = useQuery({
        queryKey: ['courts'],
        queryFn: async () => (await api.get('/courts')).data.data,
    });

    const { data: analytics, isLoading: analyticsLoading } = useQuery({
        queryKey: ['admin-analytics'],
        queryFn: async () => (await api.get('/analytics')).data.data,
    });

    const deleteCourt = useMutation({
        mutationFn: async (id) => await api.delete(`/courts/${id}`),
        onSuccess: () => queryClient.invalidateQueries(['courts']),
    });

    const tabs = [
        { id: 'overview', label: 'Overview', icon: <Activity className="w-5 h-5" /> },
        { id: 'courts', label: 'Manage Courts', icon: <Calendar className="w-5 h-5" /> },
        { id: 'users', label: 'Users', icon: <Users className="w-5 h-5" /> },
        { id: 'settings', label: 'Settings', icon: <DollarSign className="w-5 h-5" /> }
    ];

    // Chart Data Preparation
    const revenueData = {
        labels: analytics?.dailyRevenue?.map(d => d._id) || [],
        datasets: [
            {
                label: 'Revenue (₹)',
                data: analytics?.dailyRevenue?.map(d => d.revenue) || [],
                borderColor: '#CCFF00', // Brand Lime
                backgroundColor: 'rgba(204, 255, 0, 0.5)',
                tension: 0.4,
            },
        ],
    };

    const bookingsData = {
        labels: analytics?.dailyRevenue?.map(d => d._id) || [],
        datasets: [
            {
                label: 'Bookings',
                data: analytics?.dailyRevenue?.map(d => d.bookings) || [],
                backgroundColor: '#7C3AED', // Brand Violet
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: { color: 'white' }
            },
            title: {
                display: false,
            },
        },
        scales: {
            y: {
                ticks: { color: '#9CA3AF' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' }
            },
            x: {
                ticks: { color: '#9CA3AF' },
                grid: { display: false }
            }
        }
    };

    return (
        <div className="pt-32 pb-20 container mx-auto px-6 max-w-7xl bg-dark-950 min-h-screen text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
                <div>
                    <h1 className="text-5xl font-heading font-bold uppercase text-white mb-2 tracking-wide">
                        Admin <span className="text-brand-lime">Center</span>
                    </h1>
                    <p className="text-gray-400">Command your empire.</p>
                </div>
                <div className="flex bg-dark-900 rounded-xl p-1 shadow-2xl border border-white/5 mt-4 md:mt-0">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all ${activeTab === tab.id
                                ? 'bg-brand-violet text-white shadow-[0_0_15px_rgba(124,58,237,0.4)]'
                                : 'text-gray-500 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {tab.icon} <span className="ml-2">{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {activeTab === 'overview' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                >
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-dark-800 p-8 rounded-3xl shadow-lg border border-white/5 relative overflow-hidden group">
                            <div className="absolute right-0 top-0 w-32 h-32 bg-brand-lime/10 blur-3xl rounded-full group-hover:bg-brand-lime/20 transition-all"></div>
                            <div className="flex items-center justify-between mb-6 relative z-10">
                                <div className="p-3 bg-dark-700 text-brand-lime rounded-2xl border border-white/5">
                                    <DollarSign className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-bold text-black bg-brand-lime px-2 py-1 rounded-full">Live</span>
                            </div>
                            <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider">Total Revenue</h3>
                            <p className="text-5xl font-heading font-bold text-white mt-2">
                                {analyticsLoading ? '...' : `₹${analytics?.totalRevenue?.toLocaleString() || 0}`}
                            </p>
                        </div>

                        <div className="bg-dark-800 p-8 rounded-3xl shadow-lg border border-white/5 relative overflow-hidden group">
                            <div className="absolute right-0 top-0 w-32 h-32 bg-brand-violet/10 blur-3xl rounded-full group-hover:bg-brand-violet/20 transition-all"></div>
                            <div className="flex items-center justify-between mb-6 relative z-10">
                                <div className="p-3 bg-dark-700 text-brand-violet rounded-2xl border border-white/5">
                                    <Calendar className="w-6 h-6" />
                                </div>
                            </div>
                            <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider">Active Courts</h3>
                            <p className="text-5xl font-heading font-bold text-white mt-2">{courts ? courts.filter(c => c.status === 'active').length : 0} <span className="text-xl text-gray-500">/ {courts?.length || 0}</span></p>
                        </div>

                        <div className="bg-dark-800 p-8 rounded-3xl shadow-lg border border-white/5 relative overflow-hidden group">
                            <div className="absolute right-0 top-0 w-32 h-32 bg-brand-pink/10 blur-3xl rounded-full group-hover:bg-brand-pink/20 transition-all"></div>
                            <div className="flex items-center justify-between mb-6 relative z-10">
                                <div className="p-3 bg-dark-700 text-brand-pink rounded-2xl border border-white/5">
                                    <BarChart2 className="w-6 h-6" />
                                </div>
                            </div>
                            <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider">Total Bookings</h3>
                            <p className="text-5xl font-heading font-bold text-white mt-2">{analyticsLoading ? '...' : (analytics?.totalBookings || 0)}</p>
                        </div>
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-dark-800 p-8 rounded-3xl shadow-lg border border-white/5 flex flex-col">
                            <h3 className="text-lg font-heading font-bold text-white mb-6 uppercase">Revenue Trend (7 Days)</h3>
                            <div className="flex-1">
                                <Line options={chartOptions} data={revenueData} />
                            </div>
                        </div>
                        <div className="bg-dark-800 p-8 rounded-3xl shadow-lg border border-white/5 flex flex-col">
                            <h3 className="text-lg font-heading font-bold text-white mb-6 uppercase">Daily Bookings</h3>
                            <div className="flex-1">
                                <Bar options={chartOptions} data={bookingsData} />
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {activeTab === 'courts' && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-dark-900 rounded-3xl shadow-lg border border-white/5 overflow-hidden"
                >
                    <div className="p-6 border-b border-white/5 flex justify-between items-center bg-dark-800/50">
                        <h2 className="text-xl font-heading font-bold uppercase tracking-wide">Court Roster</h2>
                        <button className="bg-brand-lime text-black px-6 py-2 rounded-xl text-sm font-bold uppercase flex items-center hover:bg-white transition shadow-[0_0_15px_rgba(204,255,0,0.3)]">
                            <Plus className="w-4 h-4 mr-2" /> Add Court
                        </button>
                    </div>
                    <table className="w-full text-left">
                        <thead className="bg-dark-950 text-gray-400 text-sm uppercase tracking-wider font-bold">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Price/Hr</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {courts && courts.map(court => (
                                <tr key={court._id} className="hover:bg-white/5 transition">
                                    <td className="px-6 py-4 font-heading font-bold text-xl text-white">{court.name}</td>
                                    <td className="px-6 py-4 text-gray-300 capitalize font-medium">{court.type}</td>
                                    <td className="px-6 py-4 text-brand-lime font-bold">₹{court.basePrice}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${court.status === 'active' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                                            }`}>
                                            {court.status === 'active' ? 'Active' : 'Maintenance'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => deleteCourt.mutate(court._id)}
                                            className="text-gray-500 hover:text-red-500 transition p-2 hover:bg-white/5 rounded-full"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </motion.div>
            )}
        </div>
    );
};

export default AdminDashboard;
