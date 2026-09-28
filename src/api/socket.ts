import { io, Socket } from 'socket.io-client';
import { ENV } from '../config/environment';

let socket: Socket | null = null;

export function getSocket() {
  if (!socket) {
    socket = io(ENV.REMOTE_API_URL, {
      transports: ['websocket'],
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      timeout: 10000,
    });
  }

  return socket;
}