import { io } from 'socket.io-client';
import { getUser } from './authService';

const socket = io('http://localhost:5000');

socket.on('connect', () => {
  const user = getUser();
  if(user) {
    socket.emit('join', user._id);
  }
});

export default socket;
