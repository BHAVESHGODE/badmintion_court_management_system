const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Court = require('../models/Court');
const PricingRule = require('../models/PricingRule');
const Coach = require('../models/Coach');
const Equipment = require('../models/Equipment');
const connectDB = require('../config/db');

dotenv.config();

const courts = [
    { name: 'Court A (Indoor)', type: 'indoor', basePrice: 150, averageRating: 4.9, ratingCount: 128 },
    { name: 'Court B (Indoor)', type: 'indoor', basePrice: 150, averageRating: 4.7, ratingCount: 85 },
    { name: 'Court C (Outdoor)', type: 'outdoor', basePrice: 100, averageRating: 4.2, ratingCount: 42 },
];

const rules = [
    {
        name: 'Peak Hours (6-9 PM)',
        type: 'multiplier',
        value: 1.2,
        conditions: { startTime: '18:00', endTime: '21:00' },
        priority: 1
    },
    {
        name: 'Weekend Surcharge',
        type: 'multiplier',
        value: 1.1,
        conditions: { days: ['Saturday', 'Sunday'] },
        priority: 2
    },
];

const coaches = [
    {
        name: 'Mike Smith',
        hourlyRate: 300,
        specialization: 'Singles Tactics',
        availability: [
            { day: 'Monday', slots: [{ startTime: '18:00', endTime: '21:00' }] },
            { day: 'Wednesday', slots: [{ startTime: '18:00', endTime: '21:00' }] }
        ]
    },
    {
        name: 'Sarah Jones',
        hourlyRate: 400,
        specialization: 'Doubles Strategy',
        availability: [
            { day: 'Saturday', slots: [{ startTime: '09:00', endTime: '13:00' }] },
            { day: 'Sunday', slots: [{ startTime: '09:00', endTime: '13:00' }] }
        ]
    }
];

const equipment = [
    { name: 'Yonex Astrox 99', type: 'racket', quantity: 10, price: 50, status: 'available' },
    { name: 'Li-Ning T-Shirt', type: 'shoes', quantity: 5, price: 100, status: 'available' }, // Assuming shoes/apparel
    { name: 'Mavis 350 Shuttlecock', type: 'shuttlecock', quantity: 50, price: 200, status: 'available' }
];

const seedData = async () => {
    try {
        await connectDB();

        await User.deleteMany();
        await Court.deleteMany();
        await PricingRule.deleteMany();
        await Coach.deleteMany();
        await Equipment.deleteMany();

        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'password123',
            role: 'admin',
            bio: 'Head of Operations. I love badminton!',
            skillLevel: 'Pro',
            membershipTier: 'Platinum'
        });

        await User.create({
            name: 'John Doe',
            email: 'user@example.com',
            password: 'password123',
            role: 'user',
            bio: 'Just started playing. Looking for partners.',
            skillLevel: 'Beginner',
            membershipTier: 'Silver'
        });

        // Add owner to courts
        const courtsWithOwner = courts.map(court => ({ ...court, owner: admin._id }));

        await Court.insertMany(courtsWithOwner);
        await PricingRule.insertMany(rules);
        await Coach.insertMany(coaches);
        await Equipment.insertMany(equipment);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await connectDB();
        await User.deleteMany();
        await Court.deleteMany();
        await PricingRule.deleteMany();
        await Coach.deleteMany();
        await Equipment.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    seedData();
}
