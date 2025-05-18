import { WebSocket } from 'ws';
import { IndexId } from '.';

export type CustomWebSocket = WebSocket & {
    id?: string | number;
};

export type WsSessions = Map<IndexId, CustomWebSocket>;

export type WsRooms = Map<IndexId, IndexId>;
