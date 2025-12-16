const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Court = require('../models/Court');
const PricingRule = require('../models/PricingRule');
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

const seedData = async () => {
    try {
        await connectDB();

        await User.deleteMany();
        await Court.deleteMany();
        await PricingRule.deleteMany();

        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'password123',
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
            password: 'password123',
            role: 'user',
            bio: 'Just started playing. Looking for partners.',
            skillLevel: 'Beginner',
            membershipTier: 'Silver'
        });

        await Court.insertMany(courts);
        await PricingRule.insertMany(rules);

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
