import { getRegistrationPayload } from '../utils/getResponsePayload';
import { InMemoryDatabase } from '../inMemoryDB/inMemoryDatabase';

interface RegisterUserParams {
    data: string;
    database: InMemoryDatabase
    broadcast: (response: string) => void;
}

export const registerUser = async ({ data, database, broadcast }: RegisterUserParams): Promise<void> => {
    try {
        const parsedRequest = JSON.parse(data);
        const user = await database.findUser(parsedRequest);

        const payload = !user
            ? getRegistrationPayload(await database.createUser(parsedRequest))
            : getRegistrationPayload(user);

        const response = JSON.stringify({
            type: 'reg',
            data: payload,
            id: 0,
        });

        broadcast(response);
    } catch {
        throw new Error('Registration failed');
    }
};
