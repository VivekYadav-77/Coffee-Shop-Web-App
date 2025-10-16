import io from 'socket.io-client';
const backendaddress = import.meta.env.VITE_API_URL

export const socket = io(`${backendaddress}`);