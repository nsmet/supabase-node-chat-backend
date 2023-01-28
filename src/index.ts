import express from "express";
import bodyParser from "body-parser";
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

import { createUser, searchUsers } from './controllers/user.controller';
import Socket from "./utils/socket";

import { 
  createConversation, 
  addMessageToConversation, 
  getAllConversations, 
  getConversationMessages 
} from './controllers/conversation.controller';

const app = express();
const server = http.createServer(app);
const ioServer = new Server(server);
Socket.getInstance(ioServer);

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(cors())

app.get("/", function (req, res) {
  res.send("Hello World");
});
 
// USER ENDPOINTS
app.post("/users/create", createUser);
app.get("/users/search", searchUsers);

// CONVERSATION ENDPOINTS
app.post("/conversations/create", createConversation);
app.get("/conversations", getAllConversations)
app.get("/conversations/:conversation_id/messages", getConversationMessages)

// SEND A MESSAGE
app.post("/conversations/:conversation_id/messages/create", addMessageToConversation)

server.listen(3000);