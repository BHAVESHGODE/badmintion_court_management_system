const PricingRule = require('../models/PricingRule');
const Court = require('../models/Court');
const Equipment = require('../models/Equipment');
const Coach = require('../models/Coach');

// Helper to check if date is weekend (Sat/Sun)
const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // 0=Sun, 6=Sat
};

// Helper to check if time is within range
const isTimeInRange = (timeStr, startStr, endStr) => {
    // Simple string comparison for HH:mm if format is consistent "HH:mm"
    return timeStr >= startStr && timeStr < endStr;
};

exports.calculatePrice = async ({ courtId, equipmentIds, coachId, date, startTime, endTime }) => {
    let totalPrice = 0;
    const breakdown = [];

    // 1. Court Price
    const court = await Court.findById(courtId);
    if (!court) throw new Error('Court not found');

    let courtPrice = court.basePrice; // Per hour base

    // Calculate duration in hours
    // Assuming startTime and endTime are Date objects or ISO strings we parse?
    // User input should probably be "18:00", "19:00" on a specific Date.
    // We'll simplify: startTime and endTime are part of the 'date' or just hours?
    // Requirement says: "Select date -> view slots". "User selects time slot".
    // Let's assume Booking has startTime/endTime as Dates.

    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationHours = (end - start) / (1000 * 60 * 60);

    if (durationHours <= 0) throw new Error('Invalid duration');

    breakdown.push({ item: 'Court Base Price', cost: courtPrice * durationHours, quantity: durationHours });

    // 2. Fetch Active Pricing Rules
    // We need to match rules.
    // "Peak hours (6-9 PM)" -> 18:00 to 21:00.
    // "Weekends"

    const rules = await PricingRule.find({ enabled: true }).sort('priority');

    let multiplier = 1.0;
    let additions = 0;

    for (const rule of rules) {
        let apply = false;

        // Check Date/Day condition
        if (rule.conditions.days && rule.conditions.days.length > 0) {
            const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][start.getDay()];
            if (rule.conditions.days.includes(dayName)) {
                apply = true;
            } else {
                apply = false; // Reset if day doesn't match but rule specifies days?
                // Logic: if rule has days, MUST match. If no days, match always? OR generic rule.
                // Let's assume complex rules: AND logic within a rule.
                continue;
            }
        }

        // Check Time condition (overlap)
        if (rule.conditions.startTime && rule.conditions.endTime) {
            // Convert booking start/end to HH:mm
            const bookingStartH = start.getHours();
            const ruleStartH = parseInt(rule.conditions.startTime.split(':')[0]);
            const ruleEndH = parseInt(rule.conditions.endTime.split(':')[0]);

            // Simple check: if booking overlaps with rule window
            // For exact slot booking, say 18:00-19:00.
            if (bookingStartH >= ruleStartH && bookingStartH < ruleEndH) {
                apply = true;
            } else {
                continue; // Time mismatch
            }
        }

        // Check Court Type
        if (rule.conditions.courtType) {
            if (court.type === rule.conditions.courtType) {
                apply = true;
            } else {
                continue;
            }
        }

        if (apply) {
            if (rule.type === 'multiplier') {
                multiplier *= rule.value;
                breakdown.push({ item: `Rule: ${rule.name}`, cost: 0, note: `x${rule.value}` });
            } else if (rule.type === 'fixed_addition') {
                additions += rule.value;
                breakdown.push({ item: `Rule: ${rule.name}`, cost: rule.value });
            }
        }
    }

    let finalCourtPrice = (courtPrice * durationHours * multiplier) + additions;
    breakdown.push({ item: 'Court Final Price (adjustments applied)', cost: finalCourtPrice });

    totalPrice += finalCourtPrice;

    // 3. Equipment
    if (equipmentIds && equipmentIds.length > 0) {
        // equipmentIds might be array of { id, quantity } or just ids?
        // Let's assume array of { item: id, quantity: n }
        for (const eq of equipmentIds) {
            const item = await Equipment.findById(eq.item);
            if (item) {
                const cost = item.price * eq.quantity;
                totalPrice += cost;
                breakdown.push({ item: `${item.name} x${eq.quantity}`, cost });
            }
        }
    }

    // 4. Coach
    if (coachId) {
        const coach = await Coach.findById(coachId);
        if (coach) {
            const cost = coach.hourlyRate * durationHours;
            totalPrice += cost;
            breakdown.push({ item: `Coach: ${coach.name}`, cost });
        }
    }

    return { totalPrice, breakdown };
};
