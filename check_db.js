import mongoose from 'mongoose';
import { Captain } from './src/models/captain.model.js';
import { Ride } from './src/models/ride.model.js';
import dotenv from 'dotenv';
dotenv.config();

async function check() {
    await mongoose.connect(process.env.DB_CONNECT);
    const captains = await Captain.find({});
    console.log("All Captains count:", captains.length);
    const activeCaptains = await Captain.find({ status: 'active' });
    console.log("Active Captains:", activeCaptains.length);
    for (let cap of activeCaptains) {
        console.log("- ", cap.email, "Socket:", cap.socketId, "Location:", cap.location);
    }
    process.exit(0);
}
check();
