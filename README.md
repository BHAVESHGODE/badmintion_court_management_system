# Badminton Court Management System
## Deliverables

### 1. Setup Instructions

#### Prerequisites
- Node.js & npm
- MongoDB (Local or Atlas URI)

#### Installation

1.  **Clone the repository**:
    ```bash
    git clone <https://github.com/BHAVESHGODE/badmintion_court_management_system>
    cd badminton-court-management-system
    ```

2.  **Server Setup**:
    ```bash
    cd server
    npm install
    
    # Create .env file
    # MONGO_URI=mongodb://localhost:27017/badminton_db
    # JWT_SECRET=your_jwt_secret
    # PORT=5000
    
    # Run Seeder (Populate Database)
    node src/utils/seeder.js
    
    # Start Server
    npm run dev
    ```

3.  **Client Setup**:
    ```bash
    cd client
    npm install
    npm run dev
    ```

### 2. Assumptions Made

1.  **Authentication**: Users must be logged in to book courts. There are three roles: `user`, `admin`, and `owner`.
2.  **Booking Slots**: Bookings are made in 1-hour slots.
3.  **Currency**: All prices are in a standard unit (e.g., INR) but stored as numbers.
4.  **Availability**: Courts are generally available; maintenance status blocks bookings.
5.  **Payment**: Actual payment gateway integration is mocked; bookings are confirmed immediately upon request if valid.
6.  **Timezone**: The system assumes local server time for "Peak Hours" logic for simplicity (ideal implementation would handle UTC/User TZ).

### 3. Database Design & Pricing Engine Approach

#### Database Design
The database is built on **MongoDB** using **Mongoose** for ODM. The schema is normalized enough for data integrity but takes advantage of NoSQL's flexibility for configuration.

*   **User**: Handles authentication and authorization. Stores `role` (user/admin/owner), `skillLevel`, and profile data.
*   **Court**: Represents the inventory. Fields include `type` (indoor/outdoor), `status` (active/maintenance), `basePrice`, and reference to an `owner`.
*   **Booking**: The central transaction record. It links `User`, `Court`, and optionally booked `Coach` or `Equipment`. It captures the `startTime`, `endTime`, and the final calculated `totalPrice`.
*   **PricingRule**: Stores dynamic pricing logic. Instead of hardcoding logic, we store rules as data. Fields include `type` (multiplier/fixed), `value`, and `conditions` (time range, days).
*   **Coach & Equipment**: Ancillary resources that can be attached to bookings. Coaches have specific availability slots.

#### Pricing Engine Approach
The pricing engine is designed to be **dynamic and configuration-driven** rather than hardcoded.

1.  **Base Calculation**: The engine starts with the `Court`'s `basePrice`.
2.  **Rule Application**: It fetches all active `PricingRule` documents.
    *   The engine iterates through these rules.
    *   It checks if the booking's context (Day of Week, Time of Day, Court Type) matches the rule's `conditions`.
    *   **Example**: `Peak Hours (6-9 PM)` has a condition `{ startTime: '18:00', endTime: '21:00' }`. If the booking falls in this window, the multiplier (e.g., 1.2x) is applied.
3.  **Layering**: Rules can be applied in sequence. For example, a "Weekend" multiplier (1.1x) and a "Peak Hour" multiplier (1.2x) could stack (User pays 1.32x base) or apply additively depending on business logic (currently multiplicative).
4.  **Add-ons**: Finally, the costs of selected Coaches (hourly rate) and Equipment (per session/unit) are added to the total.

This approach allows the admin to change pricing strategies (e.g., add a "Holiday Surcharge") simply by adding a new record in the database, without deploying new code.

## Project Structure

- `client/`: React + Vite frontend (Tailwind CSS)
- `server/`: Express + MongoDB backend
