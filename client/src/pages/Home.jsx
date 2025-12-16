import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';
import BookingModal from '../components/BookingModal';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Zap, Trophy, Shield, Activity, ArrowRight, ArrowUpRight, RefreshCw, AlertCircle } from 'lucide-react';
import StarRating from '../components/StarRating';

const Home = () => {
    const [selectedCourt, setSelectedCourt] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);

    const { data: courts, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['courts'],
        queryFn: async () => {
            const res = await api.get('/courts');
            return res.data.data;
        },
    });

    const handleBookClick = (court) => {
        setSelectedCourt(court);
        setIsModalOpen(true);
    };

    return (
        <div className="bg-dark-950 min-h-screen text-white overflow-hidden">
            {/* Immersive Hero */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-dark-950 via-dark-900/50 to-primary/20 z-10"></div>
                    <video
                        autoPlay loop muted playsInline
                        className="w-full h-full object-cover opacity-40 scale-105"
                        poster="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=2000"
                    >
                        <source src="https://assets.mixkit.co/videos/preview/mixkit-badminton-player-hitting-shuttlecock-slow-motion-42637-large.mp4" type="video/mp4" />
                    </video>
                </div>

                <div className="relative z-20 container mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <motion.div
                        style={{ y: y1 }}
                        className="lg:col-span-8"
                    >
                        <motion.span
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="inline-block px-4 py-2 bg-brand-lime/10 border border-brand-lime/20 rounded-full text-brand-lime font-bold uppercase tracking-widest text-sm mb-6"
                        >
                            Pro Racket Live Status
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="text-7xl md:text-9xl font-heading font-bold leading-none uppercase tracking-tighter mb-8"
                        >
                            Dominate <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-lime to-white">Your Game</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-xl text-gray-400 max-w-2xl font-light leading-relaxed mb-10"
                        >
                            Experience world-class badminton infrastructure. Pro-grade flooring, stadium lighting, and elite coaching.
                        </motion.p>
                        <motion.button
                            onClick={() => document.getElementById('courts').scrollIntoView({ behavior: 'smooth' })}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-brand-lime text-black px-10 py-5 font-heading font-bold text-2xl uppercase tracking-wider clip-path-polygon hover:bg-white transition-colors"
                        >
                            Book Now
                        </motion.button>
                    </motion.div>

                    {/* Floating Element */}
                    <motion.div
                        style={{ y: y2 }}
                        className="hidden lg:block lg:col-span-4"
                    >
                        <div className="relative">
                            <div className="absolute -inset-4 bg-primary/30 blur-3xl rounded-full"></div>
                            <img
                                src="https://images.unsplash.com/photo-1613946890333-b78913b8296a?auto=format&fit=crop&q=80&w=800"
                                alt="Pro Racket"
                                className="relative z-10 w-full rounded-3xl shadow-2xl border border-white/10 rotate-6 hover:rotate-0 transition-transform duration-700"
                            />
                            <div className="absolute -bottom-10 -left-10 bg-dark-800/80 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-xl max-w-xs z-20">
                                <div className="flex items-center space-x-3 mb-2">
                                    <div className="w-3 h-3 bg-brand-lime rounded-full animate-pulse"></div>
                                    <span className="font-bold text-sm uppercase tracking-wider text-gray-300">Live Status</span>
                                </div>
                                <p className="font-heading text-3xl font-bold">5 Courts <span className="text-brand-lime">Available</span></p>
                                {/* Animated visualization bar */}
                                <div className="flex space-x-1 mt-3">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <div key={i} className="h-8 w-2 bg-brand-lime/20 rounded-sm overflow-hidden relative">
                                            <div className="absolute bottom-0 w-full bg-brand-lime animate-pulse-slow" style={{ height: `${Math.random() * 100}%` }}></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Bento Grid Features - As requested features are simpler, keeping this but maybe rename titles or just keep as generic 'Why Choose Us' */}

            {/* Courts Section - 3D Cards */}
            <section id="courts" className="py-32 bg-dark-950">
                <div className="container mx-auto px-6">
                    <div className="flex justify-between items-end mb-20">
                        <div>
                            <h2 className="text-7xl font-heading font-bold uppercase bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">The Arena</h2>
                            <p className="text-xl text-brand-lime mt-2 font-medium tracking-wide">Select your battleground</p>
                        </div>
                        <div className="hidden md:flex space-x-2">
                            <button className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-colors"><ArrowRight className="w-5 h-5" /></button>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center h-64 items-center">
                            <div className="w-16 h-16 border-4 border-brand-lime border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : isError ? (
                        <div className="flex flex-col items-center justify-center h-64 text-center border border-red-500/30 rounded-3xl bg-red-500/5 p-8">
                            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                            <h3 className="text-2xl font-bold text-red-500 mb-2">Failed to load courts</h3>
                            <p className="text-gray-400 mb-6 max-w-md">
                                {error?.message || "There was an issue connecting to the stadium servers."}
                            </p>
                            <button
                                onClick={() => refetch()}
                                className="flex items-center space-x-2 px-6 py-3 bg-dark-800 border border-white/10 rounded-xl hover:bg-dark-700 transition-colors"
                            >
                                <RefreshCw className="w-4 h-4" />
                                <span>Retry Connection</span>
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {courts && courts.length > 0 ? courts.map((court, idx) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    key={court._id}
                                    className="group relative h-[550px] w-full [perspective:1000px]"
                                >
                                    <div className="relative h-full w-full rounded-3xl transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                                        {/* Front */}
                                        <div className="absolute inset-0 h-full w-full rounded-3xl bg-dark-800 border border-white/5 overflow-hidden">
                                            <img
                                                src={court.image || (court.type === 'indoor' ? 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=600' : 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600')}
                                                alt={court.name}
                                                className="h-full w-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                                            <div className="absolute bottom-0 left-0 p-8 w-full">
                                                <div className="flex justify-between items-end mb-2">
                                                    <h3 className="text-4xl font-heading font-bold uppercase">{court.name}</h3>
                                                    <div className="text-right">
                                                        <p className="text-brand-lime font-bold text-xl">$150<span className="text-sm text-gray-400 font-normal">/hr</span></p>
                                                    </div>
                                                </div>

                                                <p className="text-gray-300 font-bold tracking-wider uppercase text-sm mb-4">{court.type} Court</p>

                                                <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-sm p-3 rounded-lg border border-white/10 w-fit">
                                                    <StarRating rating={5} size={4} />
                                                    <span className="text-xs text-brand-lime font-bold">(128 reviews)</span>
                                                </div>
                                            </div>
                                            {court.status !== 'active' && (
                                                <div className="absolute top-6 right-6 px-4 py-2 bg-red-500/80 backdrop-blur-md rounded-full border border-white/10">
                                                    <span className="font-bold text-white text-xs uppercase">Booked</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Back */}
                                        <div className="absolute inset-0 h-full w-full rounded-3xl bg-primary/10 backdrop-blur-3xl border border-brand-lime/30 p-10 [transform:rotateY(180deg)] [backface-visibility:hidden] flex flex-col justify-center text-center">
                                            <h3 className="text-4xl font-heading font-bold uppercase mb-6 text-white">{court.name}</h3>
                                            <div className="space-y-6 mb-10 text-gray-300">
                                                <div className="flex items-center justify-center space-x-3">
                                                    <Activity className="w-6 h-6 text-brand-lime" />
                                                    <span className="text-lg">Professional Mat</span>
                                                </div>
                                                <div className="flex items-center justify-center space-x-3">
                                                    <Zap className="w-6 h-6 text-brand-lime" />
                                                    <span className="text-lg">LED Lighting</span>
                                                </div>
                                                <div className="flex items-center justify-center space-x-3">
                                                    <Shield className="w-6 h-6 text-brand-lime" />
                                                    <span className="text-lg">Climate Control</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleBookClick(court);
                                                }}
                                                disabled={court.status !== 'active'}
                                                className={`w-full py-4 text-xl font-heading font-bold uppercase tracking-wider rounded-xl transition-all ${court.status === 'active'
                                                    ? 'bg-brand-lime text-black hover:bg-white hover:scale-105 shadow-[0_0_20px_rgba(57,255,20,0.4)]'
                                                    : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                                    }`}
                                            >
                                                {court.status === 'active' ? 'Book Now' : 'Unavailable'}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )) : (
                                <div className="col-span-3 text-center py-20 bg-white/5 rounded-3xl border border-white/10">
                                    <p className="text-xl text-gray-400">No courts currently available in the database.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 bg-black border-t border-white/10 text-center">
                <h2 className="text-9xl font-heading font-bold text-white/5 uppercase select-none">CourtBooker</h2>
                <p className="text-gray-500 mt-[-40px] relative z-10 mb-4">© 2024 CourtBooker Ultra. All rights reserved.</p>
                <div className="relative z-10 flex flex-col items-center gap-1 text-sm font-medium">
                    <p className="text-gray-400">Developed by <span className="text-brand-lime font-bold uppercase tracking-wide">Bhavesh Pradeep Gode</span></p>
                    <p className="text-gray-500 uppercase tracking-widest text-xs">NIT Jamshedpur</p>
                </div>
            </footer>

            {isModalOpen && selectedCourt && (
                <BookingModal court={selectedCourt} onClose={() => setIsModalOpen(false)} />
            )}
        </div>
    );
};

export default Home;
