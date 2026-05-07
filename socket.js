import { Server } from 'socket.io';
import { User } from './src/models/user.model.js';
import { Captain} from './src/models/captain.model.js';

let io;

export function initializeSocket(server) {
    io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);


        socket.on('join', async (data) => {
            const { userId, userType } = data;

            console.log("data  ",data)
            
            
            
            // console.log(`[Socket] ${userType} ${userId} joined with socket ${socket.id}`);

            try {
                if (userType === 'user') {
                await User.findByIdAndUpdate(userId, { socketId: socket.id, status: 'active' }, { new: true });
                console.log(`[Socket] Updated user ${userId} with socketId ${socket.id}`);
            } else if (userType === 'captain') {
                await Captain.findByIdAndUpdate(userId, { socketId: socket.id, status: 'active' }, { new: true });
                console.log(`[Socket] Updated captain ${userId} with socketId ${socket.id}`);
            }
            } catch (err) {
                console.error(`[Socket] Error updating ${userType}:`, err);
            }
        });


        socket.on('update-location-captain', async (data) => {
            const { userId, location } = data;

            if (!location || !location.lat || !location.lng) {
                return socket.emit('error', { message: 'Invalid location data' });
            }

            await Captain.findByIdAndUpdate(userId, {
                location: {
                    lat: location.lat,
                    lng: location.lng
                }
            });
        });

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
}

export const sendMessageToSocketId = (socketId, messageObject) => {

    console.log(messageObject);

    if (io) {
        io.to(socketId).emit(messageObject.event, messageObject.data);
    } else {
        console.log('Socket.io not initialized.');
    }
}