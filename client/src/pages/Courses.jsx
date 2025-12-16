import { motion } from 'framer-motion';
import { Shield, Zap, Star } from 'lucide-react';

const Courses = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-dark-950 transition-colors duration-300 pt-32 pb-20">
            <div className="container mx-auto px-6">
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block px-4 py-2 bg-brand-violet/10 text-brand-violet rounded-full text-sm font-bold uppercase tracking-wider mb-6"
                    >
                        Elevate Your Game
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-heading font-black text-black dark:text-white mb-6 uppercase"
                    >
                        Pro <span className="text-brand-lime">Coaching</span>
                    </motion.h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Learn from world-class instructors. From beginner basics to advanced tactics.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { title: "Beginner Foundations", level: "Beginner", icon: Shield, color: "text-blue-500", bg: "bg-blue-500/10" },
                        { title: "Advanced Tactics", level: "Advanced", icon: Zap, color: "text-brand-lime", bg: "bg-brand-lime/10" },
                        { title: "Pro Masterclass", level: "Elite", icon: Star, color: "text-brand-violet", bg: "bg-brand-violet/10" }
                    ].map((course, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + idx * 0.1 }}
                            className="bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-white/5 p-8 rounded-3xl group hover:border-brand-lime/50 transition-colors"
                        >
                            <div className={`w-14 h-14 ${course.bg} ${course.color} rounded-2xl flex items-center justify-center mb-6`}>
                                <course.icon size={28} />
                            </div>
                            <h3 className="text-3xl font-heading font-bold text-black dark:text-white mb-2 uppercase">{course.title}</h3>
                            <div className="flex justify-between items-center mt-6">
                                <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">{course.level}</span>
                                <button className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg font-bold uppercase text-sm hover:scale-105 transition-transform">
                                    Join
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Courses;
