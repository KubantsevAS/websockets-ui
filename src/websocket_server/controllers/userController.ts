import { WebSocket } from 'ws';
import { getRegistrationPayload } from '../utils/getResponsePayload';
import { InMemoryDatabase } from '../inMemoryDB/inMemoryDatabase';
import { CustomWebSocket } from '../types/websocket';

interface RegisterUserRequest {
    data: string;
    database: InMemoryDatabase
    broadcast: (response: string) => void;
    wsClient: WebSocket;
}

interface EmptyDataRequestParams {
    database: InMemoryDatabase
    broadcast: (response: string) => void;
}

export const registerUser = async ({
    data,
    database,
    broadcast,
    wsClient,
}: RegisterUserRequest): Promise<void> => {
    try {
        const parsedRequest = JSON.parse(data);
        const user = await database.findUser(parsedRequest) || await database.createUser(parsedRequest);

        Object.defineProperty(wsClient, 'id', {
            value: user.index,
            writable: false,
            enumerable: true,
        });

        const response = JSON.stringify({
            type: 'reg',
            data: getRegistrationPayload(user),
            id: 0,
        });

        broadcast(response);
    } catch {
        throw new Error('Registration failed');
    }
};

export const updateWinners = async ({ database, broadcast }: EmptyDataRequestParams): Promise<void> => {
    try {
        const winners = await database.getWinners();
        const response = JSON.stringify({
            type: 'update_winners',
            data: JSON.stringify(winners),
            id: 0,
        });

        broadcast(response);
    } catch {
        throw new Error('Winners update failed');
    }
};

export const updateRoom = async ({ database, broadcast }: EmptyDataRequestParams): Promise<void> => {
    try {
        const rooms = await database.getRooms();
        const response = JSON.stringify({
            type: 'update_room',
            data: JSON.stringify(rooms),
            id: 0,
        });

        broadcast(response);
    } catch {
        throw new Error('Rooms update failed');
    }
};

export const createRoom = async (
    { database, wsClient }: { database: InMemoryDatabase, wsClient: WebSocket },
): Promise<void> => {
    try {
        const id = (wsClient as CustomWebSocket)?.id;

        if (typeof id === 'undefined') {
            throw new Error('Creating room failed, current user not found');
        }

        const user = await database.findUser({ index: id });

        if (!user) {
            throw new Error('Creating room failed, current user not found');
        }

        await database.createRoom(user);
    } catch {
        throw new Error('Creating room failed');
    }
};
