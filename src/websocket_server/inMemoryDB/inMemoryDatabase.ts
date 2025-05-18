import {
    IndexId,
    Room,
    User,
    Winner,
} from '../types';
import crypto from 'crypto';

interface UserParams {
    name: string;
    password: string;
}

export class InMemoryDatabase {
    private users: User[] = [];
    private winners: Winner[] = [];
    private rooms: Room[] = [];

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

    findUser({ index }: { index: IndexId }): Promise<User | undefined> {
        return new Promise(resolve => {
            const user = this.users.find(user => user.index === index);
            resolve(user);
        });
    }

    getWinners(): Promise<Winner[]> {
        return new Promise(resolve => {
            resolve(this.winners);
        });
    }

    getRooms(): Promise<Room[]> {
        return new Promise(resolve => {
            resolve(this.rooms);
        });
    }

    createRoom(user: User): Promise<Room> {
        return new Promise(resolve => {
            const roomId = crypto.randomUUID();
            const roomUsers = [{
                name: user.name,
                index: user.index,
            }];
            const room = { roomId, roomUsers };
            this.rooms.push(room);
            resolve(room);
        });
    }

    // findRoom({ index }: { index: IndexId }): Promise<Room | undefined> {
    //     const user = this.rooms.find(room => room.roomUsers.);
    // }
}
