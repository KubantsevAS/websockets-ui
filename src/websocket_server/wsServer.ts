import { WebSocketServer, WebSocket } from 'ws';
import { InMemoryDatabase } from './inMemoryDB/inMemoryDatabase';
import {
    registerUser,
    updateWinners,
    updateRoom,
    createRoom,
} from './controllers/userController';
import { CustomWebSocket } from './types/websocket';
import { IndexId } from './types';

export class wsServer {
    port: number;
    server: WebSocketServer;
    database: InMemoryDatabase;
    private sessions: Map<string, CustomWebSocket>;

    constructor(wsPort: number) {
        this.port = wsPort;
        this.server = new WebSocketServer({ port: this.port });
        this.database = new InMemoryDatabase();
        this.sessions = new Map();
    }

    init(): void {
        this.server.on('connection', (wsClient: CustomWebSocket) => {
            wsClient.on('message', async (message: string) => {
                try {
                    this.#handleRequestMessage(message, wsClient);
                } catch (error) {
                    console.error(error);
                }
            });

            wsClient.on('close', () => {
                if (wsClient.id) {
                    this.sessions.delete(wsClient.id.toString());
                }
            });
        });
    }

    #handleRequestMessage(message: string, wsClient: CustomWebSocket): void {
        const request = JSON.parse(String(message));
        const { type, data } = request;

        const requestTypeMap = {
            reg: (data: string): void => {
                registerUser({
                    data,
                    database: this.database,
                    broadcastToUser: this.#broadcastToUser.bind(this),
                    wsClient,
                    sessions: this.sessions,
                });

                updateRoom({
                    database: this.database,
                    broadcast: this.#broadcast.bind(this),
                });
                updateWinners({
                    database: this.database,
                    broadcast: this.#broadcast.bind(this),
                });
            },
            create_room: (): void => {
                createRoom({
                    database: this.database,
                    wsClient,
                });
                updateRoom({
                    database: this.database,
                    broadcast: this.#broadcast.bind(this),
                });
            },
            add_user_to_room: (): void => {},
            create_game: (data: string): undefined => {console.log(data);},
            start_game: (data: string): undefined => {console.log(data);},
            turn: (data: string): undefined => {console.log(data);},
            attack: (data: string): undefined => {console.log(data);},
            finish: (data: string): undefined => {console.log(data);},
            update_room: (data: string): undefined => {console.log(data);},
        };

        if (!Object.prototype.hasOwnProperty.call(requestTypeMap, type)) {
            throw new Error('Unknown request type');
        }

        (requestTypeMap as Record<string, (data: string) => void>)[type](data);
    }

    #broadcast(response: string): void {
        this.server.clients.forEach((client: WebSocket) => {
            client.send(response);
        });
    }

    #broadcastToUser(userId: IndexId, response: string): void {
        const client = this.sessions.get(userId.toString());
        if (client) {
            client.send(response);
        }
    }
}
