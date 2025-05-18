import { wsServer } from './wsServer';

const WS_PORT = 3000;

const battleshipServer = new wsServer(WS_PORT);
battleshipServer.init();
