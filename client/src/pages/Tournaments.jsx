import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Trophy, Users, X, CreditCard, Check } from 'lucide-react';

const Tournaments = () => {
    const [selectedTournament, setSelectedTournament] = useState(null);
    const [isRegistering, setIsRegistering] = useState(false);

    const tournaments = [
        {
            id: 1,
            name: "City Open 2024",
            date: "Aug 15-20",
            prize: "$5,000",
            level: "Pro",
            description: "The biggest city tournament of the year. Open to all professional players.",
            entryFee: "$50"
        },
        {
            id: 2,
            name: "Summer Slam",
            date: "Sept 01-02",
            prize: "$1,000",
            level: "Amateur",
            description: "A fun weekend tournament for amateur players to showcase their skills.",
            entryFee: "$25"
        },
        {
            id: 3,
            name: "Junior League",
            date: "Sept 10",
            prize: "Trophies",
            level: "Junior",
            description: "Developing the next generation of champions. Under-18 category.",
            entryFee: "Free"
        },
    ];

    const handleRegister = (t) => {
        setSelectedTournament(t);
        setIsRegistering(true);
    };

    return (
        <div className="min-h-screen bg-white dark:bg-dark-950 transition-colors duration-300 pt-32 pb-20">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-block px-3 py-1 mb-4 bg-brand-lime/10 text-brand-lime rounded-full text-xs font-bold uppercase tracking-wider"
                        >
                            Upcoming Comps
                        </motion.div>
                        <h1 className="text-5xl md:text-7xl font-heading font-black text-black dark:text-white mb-4 uppercase">
                            Upcoming <span className="text-brand-lime">Events</span>
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400">Compete for glory and prizes.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {tournaments.map((t, index) => (
                        <motion.div
                            key={t.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-white/5 p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between group hover:border-brand-lime/50 transition-colors relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Trophy size={100} className="text-brand-lime" />
                            </div>
                            <div className="flex items-center gap-6 mb-6 md:mb-0 w-full md:w-auto relative z-10">
                                <div className="bg-white dark:bg-dark-800 p-6 rounded-2xl text-center min-w-[100px] border border-gray-100 dark:border-white/5">
                                    <span className="block text-sm font-bold text-gray-500 uppercase tracking-widest">{t.date.split(' ')[0]}</span>
                                    <span className="block text-3xl font-black text-black dark:text-white">{t.date.split(' ')[1].split('-')[0]}</span>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-black dark:text-white mb-2 group-hover:text-brand-lime transition-colors">{t.name}</h3>
                                    <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
                                        <span className="flex items-center gap-1"><Trophy size={14} className="text-yellow-500" /> {t.prize}</span>
                                        <span className="flex items-center gap-1"><Users size={14} className="text-brand-violet" /> {t.level}</span>
                                    </div>
                                    <p className="text-gray-400 text-sm mt-2">{t.description}</p>
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto relative z-10">
                                <button onClick={() => handleRegister(t)} className="w-full md:w-auto px-8 py-3 bg-brand-violet text-white rounded-xl font-bold uppercase tracking-wider hover:bg-brand-violet/80 transition-all shadow-lg shadow-brand-violet/20">
                                    Register Team
                                </button>
                                <button onClick={() => setSelectedTournament(t)} className="w-full md:w-auto px-8 py-3 bg-white dark:bg-dark-800 text-black dark:text-white border border-gray-200 dark:border-white/10 rounded-xl font-bold uppercase tracking-wider hover:bg-brand-lime hover:text-black hover:border-transparent transition-all">
                                    View Details
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Event Modal */}
            <AnimatePresence>
                {(selectedTournament || isRegistering) && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => { setSelectedTournament(null); setIsRegistering(false); }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl bg-dark-900 border border-white/10 p-8 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
                        >
                            <button
                                onClick={() => { setSelectedTournament(null); setIsRegistering(false); }}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-20"
                            >
                                <X size={24} />
                            </button>

                            {isRegistering ? (
                                <div>
                                    <h2 className="text-3xl font-heading font-bold uppercase text-white mb-2">Register Team</h2>
                                    <p className="text-brand-lime font-bold mb-6">for {selectedTournament?.name}</p>

                                    <form className="space-y-4" onSubmit={(e) => {
                                        e.preventDefault();
                                        alert('Simulating Payment & Registration...');
                                        setTimeout(() => {
                                            alert('Registration Confirmed! Email sent.');
                                            setIsRegistering(false);
                                            setSelectedTournament(null);
                                        }, 1000);
                                    }}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Team Name</label>
                                                <input type="text" required className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-xl focus:border-brand-lime outline-none text-white" placeholder="The Smashers" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Captain Name</label>
                                                <input type="text" required className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-xl focus:border-brand-lime outline-none text-white" placeholder="John Doe" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Player Emails (Comma separated)</label>
                                            <input type="text" required className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-xl focus:border-brand-lime outline-none text-white" placeholder="p1@example.com, p2@example.com" />
                                        </div>

                                        <div className="bg-dark-800 p-4 rounded-xl border border-white/5 mt-4">
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="text-gray-400">Entry Fee</span>
                                                <span className="text-2xl font-bold text-white">{selectedTournament?.entryFee}</span>
                                            </div>
                                            <button type="submit" className="w-full bg-brand-lime text-black py-4 rounded-xl font-heading font-bold text-xl uppercase tracking-wider hover:bg-white transition-all flex items-center justify-center gap-2">
                                                <CreditCard size={20} /> Pay & Register
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            ) : (
                                <div>
                                    <h2 className="text-4xl font-heading font-bold uppercase text-white mb-4">{selectedTournament?.name}</h2>
                                    <div className="flex gap-4 mb-6">
                                        <span className="px-3 py-1 bg-brand-lime/20 text-brand-lime rounded-lg text-sm font-bold uppercase">{selectedTournament?.level}</span>
                                        <span className="px-3 py-1 bg-yellow-500/20 text-yellow-500 rounded-lg text-sm font-bold uppercase">Prize: {selectedTournament?.prize}</span>
                                    </div>

                                    <div className="space-y-6 text-gray-300">
                                        <p className="text-lg">{selectedTournament?.description}</p>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-dark-800 p-4 rounded-xl">
                                                <span className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Date</span>
                                                <span className="block text-xl font-bold text-white">{selectedTournament?.date}</span>
                                                <button onClick={() => alert('Added to Calendar simulation')} className="text-xs text-brand-violet mt-2 flex items-center gap-1 hover:underline"><Calendar size={12} /> Add to Calendar</button>
                                            </div>
                                            <div className="bg-dark-800 p-4 rounded-xl">
                                                <span className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Location</span>
                                                <span className="block text-xl font-bold text-white">CourtBooker Arena</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 flex gap-4">
                                        <button onClick={() => setIsRegistering(true)} className="flex-1 bg-brand-lime text-black py-4 rounded-xl font-heading font-bold text-xl uppercase tracking-wider hover:bg-white transition-all">
                                            Register Now
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Tournaments;
