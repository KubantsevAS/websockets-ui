import { WebSocketServer, WebSocket } from 'ws';
import { InMemoryDatabase } from './inMemoryDB/inMemoryDatabase';
import {
    registerUser,
    updateWinners,
} from './controllers/userController';
import {
    updateRoom,
    createRoom,
    addUserToRoom,
} from './controllers/roomController';
import { CustomWebSocket, WsRooms, WsSessions } from './types/websocket';
import { IndexId } from './types';

export class wsServer {
    port: number;
    server: WebSocketServer;
    database: InMemoryDatabase;
    private sessions: WsSessions;
    private rooms: WsRooms;

    constructor(wsPort: number) {
        this.port = wsPort;
        this.server = new WebSocketServer({ port: this.port });
        this.database = new InMemoryDatabase();
        this.sessions = new Map();
        this.rooms = new Map;
    }

    init(): void {
        this.server.on('connection', (wsClient: CustomWebSocket) => {
            wsClient.on('message', async (message: string) => {
                try {
                    await this.#handleRequestMessage(message, wsClient);
                } catch (error) {
                    console.error('Error handling message:', error);
                }
            });

            wsClient.on('close', () => {
                if (wsClient.id) {
                    this.sessions.delete(wsClient.id.toString());
                }
            });

            wsClient.on('error', (error) => {
                console.error('WebSocket error:', error);
                if (wsClient.id) {
                    this.sessions.delete(wsClient.id.toString());
                }
            });
        });
    }

    async #handleRequestMessage(message: string, wsClient: CustomWebSocket): Promise<void> {
        const request = JSON.parse(String(message));
        const { type, data } = request;

        const requestTypeMap = {
            reg: async (data: string): Promise<void> => {
                await registerUser({
                    data,
                    database: this.database,
                    broadcastToUser: this.#broadcastToUser.bind(this),
                    wsClient,
                    sessions: this.sessions,
                });

                await updateRoom({
                    database: this.database,
                    broadcast: this.#broadcast.bind(this),
                });

                await updateWinners({
                    database: this.database,
                    broadcast: this.#broadcast.bind(this),
                });
            },
            create_room: async (): Promise<void> => {
                await createRoom({
                    database: this.database,
                    wsClient,
                    rooms: this.rooms,
                });

                await updateRoom({
                    database: this.database,
                    broadcast: this.#broadcast.bind(this),
                });
            },
            add_user_to_room: async (data: string): Promise<void> => {
                await addUserToRoom({
                    data,
                    database: this.database,
                    wsClient,
                    rooms: this.rooms,
                });

                await updateRoom({
                    database: this.database,
                    broadcast: this.#broadcast.bind(this),
                });
            },
            create_game: async (data: string): Promise<undefined> => {console.log(data);},
            start_game: async (data: string): Promise<undefined> => {console.log(data);},
            turn: async (data: string): Promise<undefined> => {console.log(data);},
            attack: async (data: string): Promise<undefined> => {console.log(data);},
            finish: async (data: string): Promise<undefined> => {console.log(data);},
            update_room: async (data: string): Promise<undefined> => {console.log(data);},
        };

        if (!Object.prototype.hasOwnProperty.call(requestTypeMap, type)) {
            throw new Error('Unknown request type');
        }

        await (requestTypeMap as Record<string, (data: string) => Promise<void>>)[type](data);
    }

    #broadcast(response: string): void {
        this.server.clients.forEach((client: WebSocket) => {
            if (this.#isConnectionOpen(client)) {
                try {
                    client.send(response);
                } catch (error) {
                    console.error('Error broadcasting to client:', error);
                }
            }
        });
    }

    #broadcastToUser(userId: IndexId, response: string): void {
        const client = this.sessions.get(userId.toString());
        if (client && this.#isConnectionOpen(client)) {
            try {
                client.send(response);
            } catch (error) {
                console.error('Error sending message to user:', error);
                this.sessions.delete(userId.toString());
            }
        }
    }

    #isConnectionOpen(client: WebSocket): boolean {
        return client.readyState === WebSocket.OPEN;
    }
}
