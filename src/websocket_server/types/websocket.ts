import { WebSocket } from 'ws';

export type CustomWebSocket = WebSocket & {
    id?: string | number;
};
