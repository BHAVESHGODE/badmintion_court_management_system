import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

const Contact = () => {
    const [formState, setFormState] = useState({ name: '', email: '', message: '' });
    const [isSending, setIsSending] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSending(true);
        // Simulate email sending
        setTimeout(() => {
            setIsSending(false);
            setIsSent(true);
            setFormState({ name: '', email: '', message: '' });
            setTimeout(() => setIsSent(false), 3000); // Reset success message after 3s
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-white dark:bg-dark-950 transition-colors duration-300 pt-32 pb-20">
            <div className="container mx-auto px-6">
                <div className="text-center mb-20">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-heading font-black text-black dark:text-white mb-6 uppercase"
                    >
                        Get in <span className="text-brand-violet">Touch</span>
                    </motion.h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400">Have questions? We're here to help.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 gap-6">
                            <a href="mailto:support@courtbooker.com" className="block group">
                                <div className="bg-gray-50 dark:bg-dark-900 p-8 rounded-3xl border border-gray-200 dark:border-white/5 transition-all group-hover:border-brand-lime">
                                    <div className="flex items-center gap-6 mb-4">
                                        <div className="bg-brand-lime/20 p-4 rounded-full text-brand-lime">
                                            <Mail size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-black dark:text-white">Email Us</h3>
                                            <p className="text-gray-600 dark:text-gray-400 group-hover:text-brand-lime transition-colors">support@courtbooker.com</p>
                                        </div>
                                    </div>
                                </div>
                            </a>

                            <a href="tel:+15551234567" className="block group">
                                <div className="bg-gray-50 dark:bg-dark-900 p-8 rounded-3xl border border-gray-200 dark:border-white/5 transition-all group-hover:border-brand-violet">
                                    <div className="flex items-center gap-6 mb-4">
                                        <div className="bg-brand-violet/20 p-4 rounded-full text-brand-violet">
                                            <Phone size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-black dark:text-white">Call Us</h3>
                                            <p className="text-gray-600 dark:text-gray-400 group-hover:text-brand-violet transition-colors">+1 (555) 123-4567</p>
                                        </div>
                                    </div>
                                </div>
                            </a>

                            <div className="bg-gray-50 dark:bg-dark-900 p-8 rounded-3xl border border-gray-200 dark:border-white/5">
                                <div className="flex items-center gap-6 mb-4">
                                    <div className="bg-blue-500/20 p-4 rounded-full text-blue-500">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-black dark:text-white">Visit HQ</h3>
                                        <p className="text-gray-600 dark:text-gray-400">123 Sports Ave, NY</p>
                                    </div>
                                </div>
                                <div className="rounded-xl overflow-hidden h-48 mt-4 border border-gray-200 dark:border-white/10">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.119763973046!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1650000000000!5m2!1sen!2s"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen=""
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    ></iframe>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="bg-white dark:bg-dark-900 p-8 md:p-10 rounded-3xl shadow-2xl border border-gray-200 dark:border-white/5 relative overflow-hidden">
                        {isSent && (
                            <div className="absolute inset-0 bg-brand-lime/90 flex flex-col items-center justify-center z-10 p-10 text-center animate-in fade-in zoom-in duration-300">
                                <CheckCircle size={64} className="text-black mb-4" />
                                <h3 className="text-3xl font-heading font-bold uppercase text-black">Message Sent!</h3>
                                <p className="text-black font-medium">We'll get back to you shortly.</p>
                            </div>
                        )}
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Name</label>
                                <input
                                    required
                                    className="w-full p-4 bg-gray-50 dark:bg-dark-800 border-none rounded-xl text-black dark:text-white focus:ring-2 focus:ring-brand-lime outline-none transition-all"
                                    placeholder="John Doe"
                                    value={formState.name}
                                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Email</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full p-4 bg-gray-50 dark:bg-dark-800 border-none rounded-xl text-black dark:text-white focus:ring-2 focus:ring-brand-lime outline-none transition-all"
                                    placeholder="john@example.com"
                                    value={formState.email}
                                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Message</label>
                                <textarea
                                    required
                                    className="w-full p-4 bg-gray-50 dark:bg-dark-800 border-none rounded-xl text-black dark:text-white h-32 focus:ring-2 focus:ring-brand-lime outline-none transition-all"
                                    placeholder="How can we help?"
                                    value={formState.message}
                                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                                />
                            </div>
                            <button
                                disabled={isSending}
                                className="w-full bg-black dark:bg-white text-white dark:text-black font-bold py-4 rounded-xl uppercase tracking-wider hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSending ? (
                                    <>Sending...</>
                                ) : (
                                    <>Send Message <Send size={18} /></>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
