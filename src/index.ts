import express, { NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

import { createUser, searchUsers, getAllUsers, getUserByID, updateCurrentUser, deleteUserByID, connectUser, deleteCurrentUser } from './controllers/users.controller';
import Socket from "./utils/socket";

import { 
  createChannel as createChannel, 
  deleteChannelByID, 
  getAllChannels, 
  getChannelByID, 
  getChannelMessages as getMessagesInAChannel, 
  updateChannelByID
} from './controllers/channels.controller';
import { deleteMessageByID, getMessageByID, sendMessageToChannel, updateMessageByID } from "./controllers/messages.controller";
import { getServerAPIKey,getChatToken } from "./controllers/authentication.controller";
import { secureClientRoutesWithJWTs } from "./utils/auth";
import { createNewApp,deleteAppByID } from "./controllers/apps.controller";
import { createNewCompany } from "./controllers/companies.controller";
import { createDeveloper } from "./controllers/developers.controller";

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

// DEVELOPERS ENDPOINTS
app.post("/developers", createDeveloper) // done

// AUTHENTICATION ENDPOINTS
app.get("/get-server-api-key", getServerAPIKey); // done 
app.get("/get-chat-token",getChatToken);   // done (with some checks needed)

// USER ENDPOINTS
app.get("/users", getAllUsers); // Think its working 
app.post("/users", createUser); // working
app.put("/users", updateCurrentUser ); // working
app.get("/users/:user_id", getUserByID); //  working
app.delete("/users", deleteCurrentUser); // working (need to double check though)

// TO DO - need to do these ones
// app.delete("/users/:user_id",deleteUserByID);
// app.put("/users/:user_id",updateUserByID);

// CHANNEL ENDPOINTS
app.post("/channels", createChannel); // working
app.get("/channels/:channel_id", getChannelByID); // kind of working except messages
app.put("/channels/:channel_id", updateChannelByID); // done 
app.delete("/channels/:channel_id", deleteChannelByID); // done
app.get("/channels", getAllChannels) // need to make changes
app.get("/channels/:channel_id/messages", getMessagesInAChannel)

app.post("/channels/:channel_id/users/:user_id", () => console.log("join a channel"));

// Messages
app.post("/messages", sendMessageToChannel) // done
app.get("/messages/:message_id",getMessageByID); // done 
app.put("/messages/:message_id", updateMessageByID); // done 
app.delete("/messages/:message_id", deleteMessageByID); // done

// App
app.post("/apps",createNewApp) // done
app.delete("/apps/:app_id", deleteAppByID); // need to do 

// Companies
app.post("/companies", createNewCompany); // dont need now 

// Unclear parts
app.post("/users/connect", connectUser);
app.get("/users/search?q=:query", searchUsers);


server.listen(3000);