import { Server } from "socket.io";
import { SocketConnectedUsers, SocketSocketIdUserId, User, Message, Conversation } from '../types';

class Socket {
    private static _instance: Socket;

    private io;
    private users: SocketConnectedUsers = {};
    private socketIdUserId: SocketSocketIdUserId = {};

    private constructor(server: Server) {
        this.io = server;

        this.io.on('connection', (socket) => {
            console.log('a user connected');

            socket.on('join', (user: User) => {
                this.users[user.id] = {
                    socketId: socket.id,
                    socket: socket,
                    user
                }

                this.socketIdUserId[socket.id] = user.id;
            });

            socket.on('disconnect', () => {
                const userId = this.socketIdUserId[socket.id];

                if (userId) {
                    delete this.users[userId];
                    delete this.socketIdUserId[socket.id]
                }
            });
        });
    }

    public static sendMessageToUsers  (userIds: string[], message: Message) {
        userIds.forEach((item) => {
            const user = this._instance.users[item];

            if (user) {
                user.socket.emit('message', message);
            }
        })
    }

    public static notifyUsersOnConversationCreate  (userIds: string[], conversation: Conversation) {
        userIds.forEach((item) => {
            const user = this._instance.users[item];

            if (user) {
                user.socket.emit('newConversation', conversation);
            }
        })
    }

    

    static getInstance(server?: Server) {
        if (this._instance) {
            return this._instance;
        }

        if (server) {
            this._instance = new Socket(server);
            return this._instance;
        }

        return Error("Failed to init socket");
    }
}

export default Socket;