import { InMemoryDatabase } from '../inMemoryDB/inMemoryDatabase';
import { EmptyDataRequestParams } from '../types';
import { CustomWebSocket, WsRooms } from '../types/websocket';

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
    {
        database,
        wsClient,
        rooms,
    }: { database: InMemoryDatabase, wsClient: CustomWebSocket, rooms: WsRooms },
): Promise<void> => {
    const id = wsClient.id;

    if (typeof id === 'undefined') {
        throw new Error('Creating room failed, current user not found');
    }

    const user = await database.findUser({ index: id });

    if (rooms.has(id)) {
        throw new Error('Room already exists');
    }

    if (!user) {
        throw new Error('Creating room failed, current user not found');
    }

    const room = await database.createRoom(user);
    rooms.set(id, room.roomId);
};
