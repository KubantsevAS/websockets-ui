import { getRegistrationPayload } from '../utils/getResponsePayload';
import { InMemoryDatabase } from '../inMemoryDB/inMemoryDatabase';
import { CustomWebSocket, WsSessions } from '../types/websocket';
import { EmptyDataRequestParams, IndexId } from '../types';

interface RegisterUserRequest {
    data: string;
    database: InMemoryDatabase
    broadcastToUser: (userId : IndexId, response: string) => void;
    wsClient: CustomWebSocket;
    sessions: WsSessions;
}

export const registerUser = async ({
    data,
    database,
    broadcastToUser,
    wsClient,
    sessions,
}: RegisterUserRequest): Promise<void> => {
    const parsedRequest = JSON.parse(data);
    const user = await database.findUser(parsedRequest) || await database.createUser(parsedRequest);

    Object.defineProperty(wsClient, 'id', {
        value: user.index,
        writable: false,
        enumerable: true,
    });

    sessions.set(user.index, wsClient);

    const response = JSON.stringify({
        type: 'reg',
        data: getRegistrationPayload(user),
        id: 0,
    });

    broadcastToUser(user.index, response);
};

export const updateWinners = async ({ database, broadcast }: EmptyDataRequestParams): Promise<void> => {
    const winners = await database.getWinners();
    const response = JSON.stringify({
        type: 'update_winners',
        data: JSON.stringify(winners),
        id: 0,
    });

    broadcast(response);
};
