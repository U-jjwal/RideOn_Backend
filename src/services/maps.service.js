import axios from 'axios';
import { Captain } from '../models/captain.model.js';

export const getAddressCoordinate = async (address) => {
    const apiKey = process.env.GOOGLE_MAPS_API
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        if (response.data.status === 'OK') {
            const location = response.data.results[ 0 ].geometry.location;
            return {
                lat: location.lat,
                lng: location.lng
            };
        } else if (response.data.status === 'ZERO_RESULTS') {
            throw new Error('No coordinates found for this address');
        } else {
            console.error("Google Maps API Error:", response.data);
            throw new Error(`Unable to fetch coordinates: ${response.data.status}`);
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
    
}


export const getDistancetime = async (origin, destination) => {

    if (!origin || !destination) {
        throw new Error('Origin and destination are required');
    }

    const apiKey = process.env.GOOGLE_MAPS_API;

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);

        if (response.data.status === 'OK') {

            if (response.data.rows[0].elements[0].status === 'ZERO_RESULTS') {
                throw new Error('No routes found');
            }

            return response.data.rows[0].elements[0];

        } else {
            console.error("Google Maps API Error:", response.data);
            throw new Error(`Unable to fetch distance and time: ${response.data.status}`);
        }

    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const getAutoCompleteSuggestions = async (input) => {
     if (!input) {
        throw new Error('query is required');
    }

    const apiKey = process.env.GOOGLE_MAPS_API;
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        if (response.data.status === 'OK') {
            return response.data.predictions.map(prediction => prediction.description).filter(value => value);
        } else if (response.data.status === 'ZERO_RESULTS') {
            return [];
        } else {
            console.error("Google Maps API Error:", response.data);
            throw new Error(`Unable to fetch suggestions: ${response.data.status}`);
        }
    } catch (err) {
        console.error(err);
        throw err;
    } 
    
}

export const getCaptainsInTheRadius = async (lat, lng, radius) => {
    // radius in km
    // Fetch all active captains and filter by distance manually or via MongoDB.
    // For simplicity and since we don't have a 2d/2dsphere index on location: {lat, lng},
    // we fetch all active captains and calculate distance manually.
    
    const captains = await Captain.find({ status: 'active' });

    const captainsInRadius = captains.filter(captain => {
        if (!captain.location || !captain.location.lat || !captain.location.lng) return false;
        
        const R = 6371; // Radius of the earth in km
        const dLat = (captain.location.lat - lat) * (Math.PI / 180);
        const dLng = (captain.location.lng - lng) * (Math.PI / 180);
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat * (Math.PI / 180)) * Math.cos(captain.location.lat * (Math.PI / 180)) * 
            Math.sin(dLng / 2) * Math.sin(dLng / 2); 
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
        const distance = R * c; // Distance in km

        return distance <= radius;
    });

    return captainsInRadius;
}