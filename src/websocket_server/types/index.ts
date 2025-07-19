import { InMemoryDatabase } from '../inMemoryDB/inMemoryDatabase';

export type IndexId = number | string;

export interface EmptyDataRequestParams {
    database: InMemoryDatabase
    broadcast: (response: string) => void;
}

export interface User {
    name: string;
    password: string;
    index: IndexId;
}

export interface Winner {
    name: string;
    wins: number;
}

export interface Room {
    roomId: IndexId;
    roomUsers: RoomUser[];
}

interface RoomUser {
    name: string;
    index: IndexId;
}

export interface Game {
    idGame: IndexId;
    idPlayer: IndexId;
}
