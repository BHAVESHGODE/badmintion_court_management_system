import { motion } from 'framer-motion';

const About = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-dark-950 transition-colors duration-300">
            {/* Hero Section */}
            <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0 bg-dark-950/20 dark:bg-black/50"></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-lime/20 rounded-full blur-[120px] animate-pulse"></div>

                <div className="relative z-10 text-center px-4">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-6xl md:text-8xl font-heading font-black text-black dark:text-white mb-6 uppercase tracking-tighter"
                    >
                        We Are <span className="text-brand-lime">CourtBooker</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
                    >
                        Redefining the way athletes connect, compete, and conquer.
                    </motion.p>
                </div>
            </div>

            {/* Content Section */}
            <div className="container mx-auto px-6 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-4xl font-heading font-bold text-black dark:text-white mb-6 uppercase">Our Mission</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                            At CourtBooker, we believe that access to premium sports facilities should be seamless, inspiring, and accessible to everyone. We are bridging the gap between state-of-the-art courts and the passionate athletes who use them.
                        </p>
                        <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                            Founded in 2024, we set out to eliminate the friction of phone calls and clunky booking systems. Today, we empower thousands of players to book, play, and track their progress with AI-driven insights.
                        </p>
                    </div>
                    <div className="relative h-96 bg-gray-200 dark:bg-dark-900 rounded-3xl overflow-hidden shadow-2xl skew-y-3 transform hover:skew-y-0 transition-transform duration-500">
                        <div className="absolute inset-0 bg-gradient-to-tr from-brand-lime/20 to-brand-violet/20 flex items-center justify-center">
                            <span className="text-gray-500 font-bold uppercase">[ Premium Image Placeholder ]</span>
                        </div>
                    </div>
                </div>

                {/* Team Section */}
                <div className="mt-32 text-center">
                    <h2 className="text-4xl font-heading font-bold text-black dark:text-white mb-16 uppercase">The Team</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="group cursor-pointer">
                                <div className="h-80 bg-gray-200 dark:bg-dark-900 rounded-2xl mb-6 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                                </div>
                                <h3 className="text-2xl font-bold text-black dark:text-white group-hover:text-brand-lime transition-colors">Member Name</h3>
                                <p className="text-brand-violet font-bold uppercase tracking-wider text-sm">Co-Founder</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
