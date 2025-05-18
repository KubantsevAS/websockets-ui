import { User, Winners } from '../types';
import crypto from 'crypto';

interface UserParams {
    name: string;
    password: string;
}

export class InMemoryDatabase {
    private users: User[] = [];
    private winners: Winners[] = [];

    createUser({ name, password }: UserParams): Promise<User> {
        return new Promise(resolve => {
            const userId = crypto.randomUUID();
            const user: User = {
                name,
                password,
                index: userId,
            };
            this.users.push(user);
            this.winners.push({ name, wins: 0 });
            resolve(user);
        });
    }

    getAllUsers(): Promise<User[]> {
        return new Promise(resolve => {
            resolve(this.users);
        });
    }

    findUser({ name }: UserParams): Promise<User | undefined> {
        return new Promise(resolve => {
            const user = this.users.find(user => user.name === name);
            resolve(user);
        });
    }

    getWinners(): Promise<Winners[]> {
        return new Promise(resolve => {
            resolve(this.winners);
        });
    }
}
