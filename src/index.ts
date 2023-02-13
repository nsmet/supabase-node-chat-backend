import express, { NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

import { createUser, searchUsers } from './controllers/user.controller';
import Socket from "./utils/socket";

import { 
  createConversation as createChannel, 
  addMessageToConversation as addMessageToAChannel, 
  getAllConversations as getAllChannels, 
  getConversationMessages as getMessagesInAChannel 
} from './controllers/conversation.controller';
import { getServerAPIKey,getChatToken } from "./controllers/authentication.controller";
import { secureClientRoutesWithJWTs } from "./utils/auth";

const app = express();
const server = http.createServer(app);
const ioServer = new Server(server);
Socket.getInstance(ioServer);

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(cors())


app.use(secureClientRoutesWithJWTs);

app.get("/", function (req, res) {
  return res.send("Hello World");
});
// AUTHENTICATION ENDPOINTS
app.get("/get-server-api-key", getServerAPIKey);
app.get("/get-chat-token",getChatToken);
 
// USER ENDPOINTS
app.post("/users/create", createUser);
app.get("/users", () => console.log("get all users"));
app.post("/users", () => console.log("create new user with given username"));
app.get("/users/:user_id", () => console.log("Get data of a given user"));
app.put("users/:user_id", () => console.log("Update user data"));
app.delete("users/:user_id", () => console.log("Delete user"));

// CONVERSATION ENDPOINTS
app.post("/channels", createChannel);
app.get("channels/:channel_id", () => console.log("get channel data"));
app.put("channels/:channel_id", () => console.log("update channel data"));
app.delete("channels/:channel_id", () => console.log("delete channel"));
app.get("/channels", getAllChannels)
app.get("/channels/:channel_id/messages", getMessagesInAChannel)

app.post("/channels/:channel_id/users/:user_id", () => console.log("join a channel"));

// SEND A MESSAGE
app.post("/messages", addMessageToAChannel)
app.get("messages/:message_id", () => console.log("get message data"));
app.put("messages/:message_id", () => console.log("update message data"));
app.delete("messages/:message_id", () => console.log("delete message"));

// Unclear parts
app.post("users/connect", () => console.log("connect user to all channels"));
app.get("/users/search?q=:query", searchUsers);


server.listen(3000);