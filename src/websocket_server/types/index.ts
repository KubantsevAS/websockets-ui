export type IndexId = number | string;

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
