import { User } from '../types';
import crypto from 'crypto';

interface UserParams {
    name: string;
    password: string;
}

export class InMemoryDatabase {
    private usersMap: User[] = [];

    createUser({ name, password }: UserParams): Promise<User> {
        return new Promise(resolve => {
            const userId = crypto.randomUUID();
            const user: User = {
                name,
                password,
                index: userId,
            };
            this.usersMap.push(user);
            resolve(user);
        });
    }

    getAllUsers(): Promise<User[]> {
        return new Promise(resolve => {
            resolve(this.usersMap);
        });
    }

    findUser({ name }: UserParams): Promise<User | undefined> {
        return new Promise(resolve => {
            const user = this.usersMap.find(user => user.name === name);
            resolve(user);
        });
    }
}
