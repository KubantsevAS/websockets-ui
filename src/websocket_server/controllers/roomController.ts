import { InMemoryDatabase } from '../inMemoryDB/inMemoryDatabase';
import { EmptyDataRequestParams } from '../types';
import { CustomWebSocket, WsRooms } from '../types/websocket';

export const updateRoom = async ({ database, broadcast }: EmptyDataRequestParams): Promise<void> => {
    const rooms = await database.getRooms();
    const response = JSON.stringify({
        type: 'update_room',
        data: JSON.stringify(rooms),
        id: 0,
    });

    broadcast(response);
};

export const createRoom = async (
    { database, wsClient, rooms }: { database: InMemoryDatabase, wsClient: CustomWebSocket, rooms: WsRooms },
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

export const addUserToRoom = async ({
    data,
    database,
    wsClient,
    rooms,
}: { data: string, database: InMemoryDatabase, wsClient: CustomWebSocket, rooms: WsRooms }): Promise<void> => {
    const parsedRequest = JSON.parse(data);
    const { indexRoom: roomId } = parsedRequest;
    const currentUserId = wsClient.id;

    if (typeof currentUserId === 'undefined') {
        throw new Error('Creating room failed, current user not found');
    }

    const room = await database.findRoom({ roomId });

    if (!room) {
        throw new Error('Room was not found');
    }

    if (room.roomUsers.find(user => user.index === currentUserId)) {
        throw new Error('User already in the room');
    }

    if (room.roomUsers.length >= 2) {
        throw new Error('Room is occupied');
    }

    const user = await database.findUser({ index: currentUserId });

    if (!user) {
        throw new Error('Current user not found');
    }

    await database.addUserToRoom({ room, user });

    const roomCreatedByUser = rooms.get(currentUserId);

    if (roomCreatedByUser) {
        await database.deleteRoom({ roomId: roomCreatedByUser });
    }

    rooms.set(currentUserId, roomId);
};
