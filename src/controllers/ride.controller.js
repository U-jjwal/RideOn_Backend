import * as rideService from '../services/ride.service.js';
import * as mapService from '../services/maps.service.js';
import { validationResult } from 'express-validator';
import { Ride } from '../models/ride.model.js';
import { sendMessageToSocketId } from '../../socket.js';

export const createride = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {  pickup, destination, vehicleType } = req.body;

    try {
        const ride = await rideService.createRide({ user: req.user._id, pickup, destination, vehicleType });
        

        const pickupCoordinates = await mapService.getAddressCoordinate(pickup);

        // Increased radius to 20000km for testing purposes in case the browser geolocation is far from the typed address
        const captainsInRadius = await mapService.getCaptainsInTheRadius(pickupCoordinates.lat, pickupCoordinates.lng, 20000);

        console.log(`[Ride] Searching for Captains near ${pickupCoordinates.lat}, ${pickupCoordinates.lng}`);
        console.log(`[Ride] Found ${captainsInRadius.length} captains in radius.`);

        ride.otp = "";

        const rideWithUser = await Ride.findOne({ _id: ride._id }).populate('user');

        captainsInRadius.forEach(captain => {
            if (captain.socketId) {
                console.log(`[Ride] Notifying captain ${captain.email} via socket ${captain.socketId}`);
                sendMessageToSocketId(captain.socketId, {
                    event: 'new-ride',
                    data: rideWithUser
                });
            }

            res.status(201).json(ride);
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
}

export const getFare = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination } = req.query;

    try {
        const fare = await rideService.getFare(pickup, destination);
        return res.status(200).json(fare);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

export const confirmride = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;
    
    try {
        const ride = await rideService.confirmRide({ rideId, captain: req.captain });

        console.log("Confirming ride. User socket ID:", ride?.user?.socketId);
        console.log("Ride object:", ride); 
        

        if (ride.user && ride.user.socketId) {
            sendMessageToSocketId(ride.user.socketId, {
                event: 'ride-confirmed',
                data: ride
            });
            console.log("Message sent to user socket");
        } else {
            console.log("User or socketId not found");
        }

        return res.status(200).json(ride);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
}

export const startRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId, otp } = req.query;

    try {
        const ride = await rideService.startRide({ rideId, otp, captain: req.captain });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-started',
            data: ride
        });

        return res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

export const endRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await rideService.endRide({ rideId, captain: req.captain });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-ended',
            data: ride
        });

        return res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}