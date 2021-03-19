import {Socket} from 'socket.io';

const routes = {} as {[event: string]: (...args: any[]) => void};

const connectRoutes = (socket: Socket) => {
  Object.entries(routes).forEach(([event, listener]) => {
    socket.on(event, listener);
  });
};

export default connectRoutes;
