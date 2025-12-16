import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';
import { User, Shield, Zap, Medal, Edit2, Save, Camera } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        bio: '',
        skillLevel: 'Beginner',
        profileImage: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                bio: user.bio || '',
                skillLevel: user.skillLevel || 'Beginner',
                profileImage: user.profileImage || ''
            });
        }
    }, [user]);

    const updateProfile = useMutation({
        mutationFn: async (data) => {
            const res = await api.put('/auth/updatedetails', data);
            return res.data;
        },
        onSuccess: (data) => {
            // In a real app we'd update the AuthContext state too, or invalidate 'me' query.
            // Assuming AuthContext might refetch or we just rely on local state update for now if it doesn't auto-sync.
            // Ideally AuthContext should expose a method to refresh user, but we'll specific reload or just alert for now.
            alert('Profile Updated Successfully');
            setIsEditing(false);
            window.location.reload(); // Simple way to refresh context
        },
        onError: (err) => {
            alert(err.response?.data?.message || 'Update failed');
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        updateProfile.mutate(formData);
    };

    const tiers = {
        Silver: 'border-gray-400 text-gray-400 bg-gray-400/10',
        Gold: 'border-yellow-400 text-yellow-400 bg-yellow-400/10 shadow-[0_0_20px_rgba(250,204,21,0.3)]',
        Platinum: 'border-cyan-400 text-cyan-400 bg-cyan-400/10 shadow-[0_0_20px_rgba(34,211,238,0.3)]'
    };

    const currentTier = user?.membershipTier || 'Silver';
    const tierStyle = tiers[currentTier] || tiers.Silver;

    return (
        <div className="bg-dark-950 min-h-screen pt-24 pb-12 text-white relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-lime/5 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-violet/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="text-5xl font-heading font-bold uppercase tracking-wide">Player Profile</h1>
                        <p className="text-gray-400 mt-2">Manage your athlete identity and stats</p>
                    </div>
                    {!isEditing && (
                        <button onClick={() => setIsEditing(true)} className="flex items-center space-x-2 bg-dark-800 border border-white/10 px-6 py-3 rounded-xl hover:bg-white hover:text-dark-950 transition-all font-bold uppercase tracking-wider">
                            <Edit2 className="w-4 h-4" />
                            <span>Edit Profile</span>
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Player Card */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-dark-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden group"
                        >
                            {/* Card Shine Effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                            <div className="flex flex-col items-center text-center">
                                <div className="relative mb-6">
                                    <div className={`w-32 h-32 rounded-full border-4 p-1 ${currentTier === 'Gold' ? 'border-yellow-400' : 'border-brand-lime'} relative z-10 bg-dark-950`}>
                                        <img
                                            src={user?.profileImage || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'}
                                            alt="Profile"
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    </div>
                                    {/* Tier Badge */}
                                    <div className={`absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full border ${tierStyle} font-bold text-xs uppercase tracking-widest backdrop-blur-md`}>
                                        {currentTier} Member
                                    </div>
                                </div>

                                <h2 className="text-3xl font-heading font-bold uppercase mt-4 mb-1">{user?.name}</h2>
                                <p className="text-brand-lime font-medium">@{user?.role}</p>

                                <div className="w-full h-[1px] bg-white/10 my-6"></div>

                                <div className="grid grid-cols-2 gap-4 w-full">
                                    <div className="bg-dark-800/50 p-4 rounded-2xl border border-white/5">
                                        <Zap className="w-6 h-6 text-yellow-400 mb-2 mx-auto" />
                                        <div className="text-2xl font-bold font-heading">0</div>
                                        <div className="text-xs text-gray-500 uppercase tracking-wider">Matches</div>
                                    </div>
                                    <div className="bg-dark-800/50 p-4 rounded-2xl border border-white/5">
                                        <Medal className="w-6 h-6 text-brand-lime mb-2 mx-auto" />
                                        <div className="text-2xl font-bold font-heading">0%</div>
                                        <div className="text-xs text-gray-500 uppercase tracking-wider">Win Rate</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Membership Upgrade Promo */}
                        {currentTier !== 'Platinum' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="mt-8 bg-gradient-to-br from-brand-violet/20 to-dark-900 border border-brand-violet/30 rounded-3xl p-8 text-center relative overflow-hidden"
                            >
                                <div className="relative z-10">
                                    <h3 className="text-2xl font-heading font-bold uppercase mb-2">Go Platinum</h3>
                                    <p className="text-gray-300 text-sm mb-6">Unlock priority booking, exclusive equipment, and detailed analytics.</p>
                                    <button className="w-full py-3 bg-brand-violet text-white font-bold uppercase tracking-wider rounded-xl hover:bg-white hover:text-brand-violet transition-colors">
                                        Upgrade Now
                                    </button>
                                </div>
                                {/* Decor */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-violet/30 blur-[50px] rounded-full"></div>
                            </motion.div>
                        )}
                    </div>

                    {/* Right Column: Edit Form */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-dark-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8"
                        >
                            <div className="flex items-center space-x-3 mb-8">
                                <div className="w-1 h-8 bg-brand-lime rounded-full"></div>
                                <h3 className="text-2xl font-heading font-bold uppercase">Account Details</h3>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            disabled={!isEditing}
                                            className="w-full px-5 py-4 bg-dark-800 border border-white/10 rounded-xl focus:ring-2 focus:ring-brand-lime outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            disabled={!isEditing} // Email usually verified, keep editable? OK for now.
                                            className="w-full px-5 py-4 bg-dark-800 border border-white/10 rounded-xl focus:ring-2 focus:ring-brand-lime outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Skill Level</label>
                                        <select
                                            value={formData.skillLevel}
                                            onChange={(e) => setFormData({ ...formData, skillLevel: e.target.value })}
                                            disabled={!isEditing}
                                            className="w-full px-5 py-4 bg-dark-800 border border-white/10 rounded-xl focus:ring-2 focus:ring-brand-lime outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all text-white"
                                        >
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                            <option value="Pro">Pro</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Profile Image URL</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={formData.profileImage}
                                                onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })}
                                                disabled={!isEditing}
                                                className="w-full px-5 py-4 bg-dark-800 border border-white/10 rounded-xl focus:ring-2 focus:ring-brand-lime outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all pl-12"
                                                placeholder="https://..."
                                            />
                                            <Camera className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Bio</label>
                                    <textarea
                                        rows="4"
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        disabled={!isEditing}
                                        className="w-full px-5 py-4 bg-dark-800 border border-white/10 rounded-xl focus:ring-2 focus:ring-brand-lime outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all resize-none"
                                        placeholder="Tell us about your game..."
                                    />
                                </div>

                                {isEditing && (
                                    <div className="flex justify-end space-x-4 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="px-8 py-3 rounded-xl font-bold uppercase tracking-wider border border-white/10 hover:bg-white/5 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={updateProfile.isLoading}
                                            className="px-8 py-3 bg-brand-lime text-black rounded-xl font-bold uppercase tracking-wider hover:bg-white transition-colors flex items-center space-x-2"
                                        >
                                            <Save className="w-5 h-5" />
                                            <span>{updateProfile.isLoading ? 'Saving...' : 'Save Changes'}</span>
                                        </button>
                                    </div>
                                )}
                            </form>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
