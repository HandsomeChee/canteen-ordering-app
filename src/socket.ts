//src/socket.ts

import { io, Socket } from 'socket.io-client';
import { Platform } from 'react-native';

const SOCKET_URL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:3000'
    : 'http://localhost:3000';

const socket: Socket = io(SOCKET_URL, {
  transports: ['websocket'],
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
});

export const connectSocket = () => {
  if (!socket.connected) socket.connect();
};

export const disconnectSocket = () => {
  if (socket.connected) socket.disconnect();
};

export const joinStudentRoom = (studentId: string) => {
  if (socket.connected) socket.emit('joinStudentRoom', studentId);
};

// ✅ NEW: Emit when admin updates menu
export const emitMenuUpdated = () => {
  if (socket.connected) {
    socket.emit('menuUpdated');
    console.log('[Socket] menuUpdated emitted');
  }
};

export default socket;

export interface OrderNotification {
  orderId: string | number;
  status: string;
  message?: string;
  timestamp: string;
}

export interface LoggedNotification {
  notification: OrderNotification;
  room?: string;
}
