import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Plus, MapPin, Activity, DollarSign } from 'lucide-react';

const OwnerDashboard = () => {
    const { user } = useAuth();
    const [courts, setCourts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);

    // Form state for new court
    const [newCourt, setNewCourt] = useState({
        name: '',
        type: 'indoor',
        basePrice: '',
        amenities: []
    });

    useEffect(() => {
        fetchMyCourts();
    }, []);

    const fetchMyCourts = async () => {
        try {
            const { data } = await api.get('/courts/mine');
            if (data.success) {
                setCourts(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch courts', error);
        }
        setLoading(false);
    };

    const handleAddCourt = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/courts', newCourt);
            if (data.success) {
                setCourts([...courts, data.data]);
                setShowAddModal(false);
                setNewCourt({ name: '', type: 'indoor', basePrice: '', amenities: [] });
            }
        } catch (error) {
            alert('Failed to add court: ' + error.response?.data?.message);
        }
    };

    if (loading) return <div className="text-white text-center mt-20">Loading Dashboard...</div>;

    return (
        <div className="min-h-screen bg-dark-950 p-6 md:p-10 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-violet/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-[120px]"></div>
            </div>

            <div className="relative z-10 container mx-auto">
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-heading font-bold text-white mb-2">Owner Dashboard</h1>
                        <p className="text-gray-400">Welcome back, <span className="text-yellow-500">{user?.name}</span></p>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 bg-yellow-500 text-black px-6 py-3 rounded-xl font-bold hover:bg-white transition-all shadow-[0_0_15px_rgba(234,179,8,0.3)]"
                    >
                        <Plus size={20} />
                        Add New Court
                    </button>
                </header>

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-dark-900/50 backdrop-blur-xl border border-white/5 p-6 rounded-2xl">
                        <div className="flex items-center gap-4 text-gray-400 mb-2">
                            <Activity size={18} />
                            <span className="uppercase text-xs font-bold tracking-wider">Active Courts</span>
                        </div>
                        <p className="text-3xl font-bold text-white">{courts.length}</p>
                    </div>
                    {/* Placeholder Stats */}
                    <div className="bg-dark-900/50 backdrop-blur-xl border border-white/5 p-6 rounded-2xl">
                        <div className="flex items-center gap-4 text-gray-400 mb-2">
                            <Activity size={18} />
                            <span className="uppercase text-xs font-bold tracking-wider">Total Bookings</span>
                        </div>
                        <p className="text-3xl font-bold text-white">0</p>
                    </div>
                    <div className="bg-dark-900/50 backdrop-blur-xl border border-white/5 p-6 rounded-2xl">
                        <div className="flex items-center gap-4 text-gray-400 mb-2">
                            <DollarSign size={18} />
                            <span className="uppercase text-xs font-bold tracking-wider">Revenue</span>
                        </div>
                        <p className="text-3xl font-bold text-white">$0</p>
                    </div>
                </div>

                {/* Courts Grid */}
                <section>
                    <h2 className="text-2xl font-bold text-white mb-6">My Courts</h2>
                    {courts.length === 0 ? (
                        <div className="text-center py-20 bg-dark-900/30 rounded-3xl border border-white/5 border-dashed">
                            <p className="text-gray-500 mb-4">You haven't added any courts yet.</p>
                            <button onClick={() => setShowAddModal(true)} className="text-yellow-500 font-bold hover:underline">Add your first court</button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {courts.map(court => (
                                <motion.div
                                    key={court._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-dark-900/60 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:border-yellow-500/50 transition-colors group"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="bg-dark-800 p-3 rounded-xl">
                                            <Activity className="text-yellow-500" size={24} />
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${court.status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                            {court.status}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">{court.name}</h3>
                                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                                        <MapPin size={14} />
                                        <span className="capitalize">{court.type} Court</span>
                                    </div>
                                    <div className="pt-4 border-t border-white/5 flex justify-between items-center text-sm">
                                        <span className="text-white font-bold">${court.basePrice}/hr</span>
                                        <button className="text-gray-400 hover:text-white transition-colors">Manage</button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </section>
            </div>

            {/* Simple Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-dark-900 border border-white/10 p-8 rounded-3xl w-full max-w-md relative">
                        <button onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
                        <h2 className="text-2xl font-bold text-white mb-6">Add New Court</h2>
                        <form onSubmit={handleAddCourt} className="space-y-4">
                            <input
                                className="w-full bg-dark-800 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-yellow-500"
                                placeholder="Court Name"
                                value={newCourt.name}
                                onChange={e => setNewCourt({ ...newCourt, name: e.target.value })}
                                required
                            />
                            <select
                                className="w-full bg-dark-800 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-yellow-500"
                                value={newCourt.type}
                                onChange={e => setNewCourt({ ...newCourt, type: e.target.value })}
                            >
                                <option value="indoor">Indoor</option>
                                <option value="outdoor">Outdoor</option>
                            </select>
                            <input
                                type="number"
                                className="w-full bg-dark-800 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-yellow-500"
                                placeholder="Base Price ($)"
                                value={newCourt.basePrice}
                                onChange={e => setNewCourt({ ...newCourt, basePrice: e.target.value })}
                                required
                            />
                            <button type="submit" className="w-full bg-yellow-500 text-black font-bold py-4 rounded-xl hover:bg-white transition-colors">
                                Create Court
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OwnerDashboard;
