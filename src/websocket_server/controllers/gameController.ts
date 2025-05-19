import { InMemoryDatabase } from '../inMemoryDB/inMemoryDatabase';
import { Game, IndexId } from '../types';

interface CreateGameParams {
    data: string;
    database: InMemoryDatabase,
    broadcastToUser: (userId : IndexId, response: string) => void;
}

export const createGame = async ({
    data,
    database,
    broadcastToUser,
}: CreateGameParams): Promise<void> => {
    const parsedRequest = JSON.parse(data);
    const { indexRoom: roomId } = parsedRequest;

    const room = await database.findRoom({ roomId });

    if (!room) {
        throw new Error('Room was not found');
    }

    const { roomUsers } = room;
    const [firstUser, secondUser] = roomUsers;

    const firstUserGame = await database.createGame({ idGame: roomId, idPlayer: firstUser.index });
    const secondUserGame = await database.createGame({ idGame: roomId, idPlayer: secondUser.index });

    const createResponse = (game: Game): string => JSON.stringify({
        type: 'create_game',
        data: JSON.stringify(game),
        id: 0,
    });

    const firstUserResponse = createResponse(firstUserGame);
    const secondUserResponse = createResponse(secondUserGame);

    broadcastToUser(firstUser.index, firstUserResponse);
    broadcastToUser(secondUser.index, secondUserResponse);
};
