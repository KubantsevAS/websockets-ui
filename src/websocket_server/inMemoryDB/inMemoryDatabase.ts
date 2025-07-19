import {
    Game,
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
    private games: Game[] = [];

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

    findRoom({ roomId }: { roomId: IndexId }): Promise<Room | undefined> {
        return new Promise(resolve => {
            const room = this.rooms.find(room => room.roomId === roomId);
            resolve(room);
        });
    }

    addUserToRoom({ room, user }: { room: Room; user: User; }): Promise<Room> {
        return new Promise(resolve => {
            room.roomUsers.push(user);
            resolve(room);
        });
    }

    deleteRoom({ roomId }: { roomId: IndexId }): Promise<void> {
        return new Promise(resolve => {
            this.rooms = this.rooms.filter(room => room.roomId !== roomId);
            resolve();
        });
    }

    createGame(game: Game): Promise<Game> {
        return new Promise(resolve => {
            this.games.push(game);
            resolve(game);
        });
    }
}
