/**
 * Socket.IO service — manages all real-time event logic in one place.
 * Keeps the server entry point clean.
 */
let io = null;

export const initializeSocket = (socketIoInstance) => {
    io = socketIoInstance;

    io.on("connection", (socket) => {
        console.log(`[Socket] Connected: ${socket.id}`);

        // Join a role-based or user-specific room
        socket.on("join_room", (room) => {
            socket.join(room);
            console.log(`[Socket] ${socket.id} joined room: ${room}`);
        });

        // Agent location broadcast
        socket.on("agent_location", (data) => {
            const { orderId, location } = data;
            if (orderId && location) {
                io.to(`customer_order_${orderId}`).emit("agent_location_update", {
                    orderId,
                    location,
                });
            }
        });

        socket.on("disconnect", () => {
            console.log(`[Socket] Disconnected: ${socket.id}`);
        });
    });
};

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.IO not initialized. Call initializeSocket first.");
    }
    return io;
};

// Emit helpers
export const emitToRoom = (room, event, data) => {
    getIO().to(room).emit(event, data);
};

export const emitToAll = (event, data) => {
    getIO().emit(event, data);
};
