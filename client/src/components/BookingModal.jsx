import { useState, useEffect } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import api from '../utils/api';
import { X, Calendar, Clock, DollarSign, ArrowRight, ArrowLeft, CheckCircle, Package, User, Sparkles, Brain } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const BookingModal = ({ court, onClose }) => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [step, setStep] = useState(1);
    const [isScanning, setIsScanning] = useState(false);

    // Form State
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    // These would usually come from API
    const [equipmentList, setEquipmentList] = useState([
        { _id: 'e1', name: 'Pro Yonex Racket', price: 150, image: 'https://images.unsplash.com/photo-1613946890333-b78913b8296a?w=400' },
        { _id: 'e2', name: 'Shuttlecock (Tube)', price: 400, image: 'https://images.unsplash.com/photo-1627844654924-42b7857185ae?w=400' },
        { _id: 'e3', name: 'Court Shoes', price: 100, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' }
    ]);
    const [coachList, setCoachList] = useState([
        { _id: 'c1', name: 'David Chen', rate: 500, spec: 'Advanced Tactics', image: 'https://randomuser.me/api/portraits/men/32.jpg' },
        { _id: 'c2', name: 'Sarah Jones', rate: 450, spec: 'Beginners', image: 'https://randomuser.me/api/portraits/women/44.jpg' }
    ]);

    const [selectedEquipment, setSelectedEquipment] = useState([]); // [{ item: id, quantity: 1 }]
    const [selectedCoach, setSelectedCoach] = useState(null);

    const [totalPrice, setTotalPrice] = useState(0);

    // AI Query
    const { data: recommendations } = useQuery({
        queryKey: ['recommendations', user?.id, court._id],
        queryFn: async () => {
            const res = await api.post('/recommendations', {
                courtId: court._id,
                startTime: startTime || '12:00'
            });
            return res.data.data;
        },
        enabled: step === 2 && !!user, // Only fetch when on step 2
    });

    useEffect(() => {
        if (step === 2) {
            setIsScanning(true);
            const timer = setTimeout(() => setIsScanning(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [step]);


    const handleBooking = useMutation({
        mutationFn: async (bookingData) => {
            const res = await api.post('/bookings', bookingData);
            return res.data;
        },
        onSuccess: () => {
            setStep(5); // Success Step (re-indexed)
            queryClient.invalidateQueries(['bookings']);
        },
        onError: (err) => {
            alert(err.response?.data?.message || 'Booking Failed');
        }
    });

    const calculateTotal = () => {
        if (!startTime || !endTime) return 0;
        const s = parseInt(startTime.split(':')[0]);
        const e = parseInt(endTime.split(':')[0]);
        const duration = e - s;
        if (duration <= 0) return 0;

        let total = court.basePrice * duration;

        // Peak Mock
        if (s >= 18 && s < 21) total *= 1.2;

        // Equipment
        selectedEquipment.forEach(eq => {
            const item = equipmentList.find(i => i._id === eq.item) ||
                // Check recommendations too in case items come from there exclusively
                recommendations?.find(r => r.item._id === eq.item)?.item;

            if (item) total += item.price * eq.quantity;
        });

        // Coach
        if (selectedCoach) {
            const coach = coachList.find(c => c._id === selectedCoach) ||
                recommendations?.find(r => r.item._id === selectedCoach)?.item;
            if (coach) total += (coach.rate || coach.hourlyRate) * duration;
        }

        return Math.round(total);
    };

    useEffect(() => {
        setTotalPrice(calculateTotal());
    }, [date, startTime, endTime, selectedEquipment, selectedCoach, recommendations]);


    const toggleEquipment = (id) => {
        const existing = selectedEquipment.find(e => e.item === id);
        if (existing) {
            setSelectedEquipment(selectedEquipment.filter(e => e.item !== id));
        } else {
            setSelectedEquipment([...selectedEquipment, { item: id, quantity: 1 }]);
        }
    };

    const toggleCoach = (id) => {
        setSelectedCoach(selectedCoach === id ? null : id);
    };

    const nextStep = () => {
        if (step === 1 && (!date || !startTime || !endTime)) {
            alert("Please select date and time");
            return;
        }
        setStep(step + 1);
    };

    const submitBooking = () => {
        if (!user) {
            alert('Please login');
            return; // Redirect logic usually
        }

        const start = new Date(`${date}T${startTime}`);
        const end = new Date(`${date}T${endTime}`);

        handleBooking.mutate({
            courtId: court._id,
            date: start.toISOString(),
            startTime: start.toISOString(),
            endTime: end.toISOString(),
            equipmentIds: selectedEquipment,
            coachId: selectedCoach
        });
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-dark-900 border border-white/10 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-white"
            >
                {/* Header */}
                <div className="px-8 py-6 border-b border-white/10 flex justify-between items-center bg-dark-800/50">
                    <div>
                        <h2 className="text-3xl font-heading font-bold uppercase tracking-wide text-white">{step === 5 ? 'Booking Confirmed' : `Book ${court.name}`}</h2>
                        {step < 5 && <p className="text-sm text-gray-400 font-medium">Step {step} of 4</p>}
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
                </div>

                {/* Dynamic Progress Bar */}
                {step < 5 && (
                    <div className="h-1 bg-dark-800 w-full">
                        <div
                            className="h-full bg-brand-lime transition-all duration-500 ease-out shadow-[0_0_10px_rgba(204,255,0,0.5)]"
                            style={{ width: `${(step / 4) * 100}%` }}
                        />
                    </div>
                )}

                {/* Content */}
                <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Select Date</label>
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-xl focus:ring-2 focus:ring-brand-lime outline-none text-white appearance-none"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Start Time</label>
                                        <select
                                            value={startTime}
                                            onChange={(e) => setStartTime(e.target.value)}
                                            className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-xl outline-none text-white focus:ring-2 focus:ring-brand-lime"
                                        >
                                            <option value="">Select</option>
                                            {Array.from({ length: 14 }, (_, i) => i + 8).map(h => (
                                                <option key={h} value={`${h}:00`}>{h}:00</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">End Time</label>
                                        <select
                                            value={endTime}
                                            onChange={(e) => setEndTime(e.target.value)}
                                            className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-xl outline-none text-white focus:ring-2 focus:ring-brand-lime"
                                        >
                                            <option value="">Select</option>
                                            {Array.from({ length: 14 }, (_, i) => i + 9).map(h => (
                                                <option key={h} value={`${h}:00`}>{h}:00</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2-ai"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center h-full min-h-[300px]"
                            >
                                {isScanning ? (
                                    <>
                                        <div className="relative mb-8">
                                            <div className="w-24 h-24 rounded-full border-4 border-brand-violet border-t-transparent animate-spin"></div>
                                            <Brain className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-brand-violet w-10 h-10 animate-pulse" />
                                        </div>
                                        <h3 className="text-2xl font-heading font-bold uppercase text-white animate-pulse">Analyzing Profile...</h3>
                                        <p className="text-gray-400 mt-2">Matching your skill level with optimal gear</p>
                                    </>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="w-full space-y-6"
                                    >
                                        <div className="text-center mb-6">
                                            <Sparkles className="w-8 h-8 text-brand-lime mx-auto mb-2" />
                                            <h3 className="text-2xl font-heading font-bold uppercase text-white">AI Recommendations</h3>
                                            <p className="text-gray-400">Curated for <span className="text-brand-lime font-bold">{user?.skillLevel || 'Global'}</span> Players</p>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4">
                                            {recommendations?.map((rec, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.1 }}
                                                    onClick={() => rec.type === 'Coach' ? toggleCoach(rec.item._id) : toggleEquipment(rec.item._id)}
                                                    className={`bg-dark-800 p-4 rounded-2xl border border-white/5 hover:bg-white/5 cursor-pointer flex items-center justify-between transition-colors
                                                        ${(rec.type === 'Coach' ? selectedCoach === rec.item._id : selectedEquipment.find(e => e.item === rec.item._id)) ? 'border-brand-lime bg-brand-lime/5' : ''}
                                                    `}
                                                >
                                                    <div className="flex items-center space-x-4">
                                                        <img src={rec.item.image || rec.item.profileImage} alt={rec.item.name} className="w-16 h-16 rounded-xl object-cover" />
                                                        <div>
                                                            <div className="flex items-center space-x-2">
                                                                <span className="font-bold text-white text-lg">{rec.item.name}</span>
                                                                <span className="text-xs px-2 py-0.5 rounded bg-brand-violet/20 text-brand-violet border border-brand-violet/30 uppercase">{rec.type}</span>
                                                            </div>
                                                            <p className="text-xs text-brand-lime font-medium mt-1">{rec.reason}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-bold text-white">₹{rec.item.price || rec.item.rate}</div>
                                                        {(rec.type === 'Coach' ? selectedCoach === rec.item._id : selectedEquipment.find(e => e.item === rec.item._id)) ?
                                                            <CheckCircle className="w-6 h-6 text-brand-lime mt-1" /> :
                                                            <div className="w-6 h-6 rounded-full border border-white/20 mt-1"></div>
                                                        }
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                {/* Equipment */}
                                <div>
                                    <h3 className="font-heading font-bold text-2xl mb-4 flex items-center text-white"><Package className="w-6 h-6 mr-2 text-brand-lime" /> Add Extras</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        {equipmentList.map(item => (
                                            <div
                                                key={item._id}
                                                onClick={() => toggleEquipment(item._id)}
                                                className={`border rounded-2xl p-3 cursor-pointer transition-all hover:bg-white/5 ${selectedEquipment.find(e => e.item === item._id) ? 'border-brand-lime bg-brand-lime/10 shadow-[0_0_15px_rgba(204,255,0,0.2)]' : 'border-white/10 bg-dark-800'
                                                    }`}
                                            >
                                                <img src={item.image} alt={item.name} className="w-full h-24 object-cover rounded-xl mb-3 grayscale hover:grayscale-0 transition-all" />
                                                <div className="font-bold text-sm text-white">{item.name}</div>
                                                <div className="text-gray-400 text-xs mt-1">₹{item.price} <span className="text-white/30">/ session</span></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Coach */}
                                <div>
                                    <h3 className="font-heading font-bold text-2xl mb-4 flex items-center text-white"><User className="w-6 h-6 mr-2 text-brand-lime" /> Hire a Coach</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {coachList.map(coach => (
                                            <div
                                                key={coach._id}
                                                onClick={() => toggleCoach(coach._id)}
                                                className={`border rounded-2xl p-4 cursor-pointer flex items-center space-x-4 transition-all hover:bg-white/5 ${selectedCoach === coach._id ? 'border-brand-lime bg-brand-lime/10 shadow-[0_0_15px_rgba(204,255,0,0.2)]' : 'border-white/10 bg-dark-800'
                                                    }`}
                                            >
                                                <img src={coach.image} alt={coach.name} className="w-12 h-12 rounded-full object-cover border-2 border-white/10" />
                                                <div>
                                                    <div className="font-bold text-white">{coach.name}</div>
                                                    <div className="text-xs text-gray-400 uppercase tracking-wide">{coach.spec}</div>
                                                    <div className="text-brand-lime font-bold text-sm mt-1">₹{coach.rate}/hr</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="bg-dark-800 p-6 rounded-2xl border border-white/10 space-y-4">
                                    <div className="flex justify-between border-b border-white/5 pb-4">
                                        <div className="flex flex-col">
                                            <span className="text-gray-400 text-xs uppercase tracking-wider">Date</span>
                                            <span className="font-heading font-bold text-xl text-white">{date}</span>
                                        </div>
                                        <div className="flex flex-col text-right">
                                            <span className="text-gray-400 text-xs uppercase tracking-wider">Time</span>
                                            <span className="font-heading font-bold text-xl text-white">{startTime} - {endTime}</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-gray-300">Court Base Rate</span>
                                        <span className="font-bold text-white">₹{court.basePrice} x {(parseInt((endTime || '0').split(':')[0]) - parseInt((startTime || '0').split(':')[0]))} hrs</span>
                                    </div>

                                    {selectedEquipment.length > 0 && (
                                        <div className="pt-2">
                                            <p className="text-xs font-bold text-brand-lime uppercase tracking-wider mb-2">Extras</p>
                                            {selectedEquipment.map(eq => {
                                                // Check both lists
                                                let item = equipmentList.find(i => i._id === eq.item);
                                                if (!item && recommendations) item = recommendations.find(r => r.item._id === eq.item)?.item;

                                                return (
                                                    <div key={eq.item} className="flex justify-between text-sm mb-1">
                                                        <span className="text-gray-300">{item?.name || 'Item'}</span>
                                                        <span className="text-white font-medium">₹{item?.price}</span>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )}

                                    {selectedCoach && (
                                        <div className="pt-2">
                                            <div className="flex justify-between text-sm">
                                                {/* Find coach in list or recs */}
                                                <span className="text-gray-300">Coach ({(() => {
                                                    let c = coachList.find(c => c._id === selectedCoach);
                                                    if (!c && recommendations) c = recommendations.find(r => r.item._id === selectedCoach)?.item;
                                                    return c?.name;
                                                })()})</span>
                                                <span className="text-white font-medium">₹{(() => {
                                                    let c = coachList.find(c => c._id === selectedCoach);
                                                    if (!c && recommendations) c = recommendations.find(r => r.item._id === selectedCoach)?.item;
                                                    return c?.rate || c?.hourlyRate;
                                                })()}/hr</span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                                        <span className="font-heading font-bold text-2xl text-white uppercase">Total</span>
                                        <span className="font-heading font-bold text-4xl text-brand-lime text-glow">₹{totalPrice}</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 5 && (
                            <motion.div
                                key="step5"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="flex flex-col items-center justify-center py-10 text-center"
                            >
                                <div className="w-24 h-24 bg-brand-lime/10 rounded-full flex items-center justify-center mb-6 text-brand-lime animate-pulse border border-brand-lime/20">
                                    <CheckCircle className="w-12 h-12" />
                                </div>
                                <h2 className="text-4xl font-heading font-bold text-white mb-2 uppercase tracking-wide">Booking Confirmed!</h2>
                                <p className="text-gray-400 max-w-xs mx-auto mb-10">Your court has been reserved. Prepare for glory.</p>
                                <button
                                    onClick={onClose}
                                    className="bg-white text-black px-10 py-4 rounded-xl font-heading font-bold text-xl uppercase tracking-wider hover:bg-brand-lime transition-colors"
                                >
                                    Back to Arena
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer Actions */}
                {step < 5 && (
                    <div className="px-8 py-6 border-t border-white/10 flex justify-between bg-dark-800/50 backdrop-blur-md">
                        {step > 1 ? (
                            <button
                                onClick={() => setStep(step - 1)}
                                className="px-6 py-3 rounded-xl font-bold text-gray-400 hover:text-white hover:bg-white/5 transition flex items-center uppercase tracking-wider text-sm"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" /> Back
                            </button>
                        ) : <div></div>}

                        <button
                            onClick={step === 4 ? submitBooking : nextStep}
                            disabled={handleBooking.isPending || (step === 2 && isScanning)}
                            className="px-8 py-3 rounded-xl font-bold bg-brand-lime text-black hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all flex items-center disabled:opacity-50 uppercase tracking-wider font-heading text-lg"
                        >
                            {handleBooking.isPending ? 'Processing...' : (step === 4 ? 'Confirm & Pay' : 'Next Step')}
                            {!handleBooking.isPending && step !== 4 && <ArrowRight className="w-4 h-4 ml-2" />}
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default BookingModal;
