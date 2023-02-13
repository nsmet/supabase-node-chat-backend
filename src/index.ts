import express, { NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

import { createUser, searchUsers, getAllUsers, getUserByID, updateUserByID, deleteUserByID, connectUser } from './controllers/user.controller';
import Socket from "./utils/socket";

import { 
  createChannel as createChannel, 
  deleteChannelByID, 
  getAllChannels as getAllChannels, 
  getChannelByID, 
  getChannelMessages as getMessagesInAChannel, 
  updateChannelByID
} from './controllers/channel.controller';
import { deleteMessageByID, getMessageByID, sendMessageToChannel, updateMessageByID } from "./controllers/message.controller";
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
  return res.send("Thanks for using our chat API. Please check out our docs");
});
// AUTHENTICATION ENDPOINTS
app.get("/get-server-api-key", getServerAPIKey);
app.get("/get-chat-token",getChatToken);

// USER ENDPOINTS
app.get("/users", getAllUsers);
app.post("/users", createUser);
app.get("/users/:user_id", getUserByID);
app.put("users/:user_id", updateUserByID );
app.delete("users/:user_id", deleteUserByID);

// CHANNEL ENDPOINTS
app.post("/channels", createChannel);
app.get("channels/:channel_id", getChannelByID);
app.put("channels/:channel_id", updateChannelByID);
app.delete("channels/:channel_id", deleteChannelByID);
app.get("/channels", getAllChannels)
app.get("/channels/:channel_id/messages", getMessagesInAChannel)

app.post("/channels/:channel_id/users/:user_id", () => console.log("join a channel"));

// Messages
app.post("/messages", sendMessageToChannel)
app.get("messages/:message_id",getMessageByID);
app.put("messages/:message_id", updateMessageByID);
app.delete("messages/:message_id", deleteMessageByID);

// Unclear parts
app.post("users/connect", connectUser);
app.get("/users/search?q=:query", searchUsers);


server.listen(3000);