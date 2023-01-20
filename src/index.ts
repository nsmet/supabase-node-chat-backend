import express from "express";
import bodyParser from "body-parser";
import { createUser, searchUsers } from './controllers/user.controller';
import { createConversation, addMessageToConversation, getAllConversations } from './controllers/conversation.controller';
const app = express();

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

app.get("/", function (req, res) {
  res.send("Hello World");
});
 
// USER ENDPOINTS
app.post("/users/create", createUser);
app.get("/users/search", searchUsers);

// CONVERSATION ENDPOINTS
app.post("/conversations/create", createConversation);
app.get("/conversations", getAllConversations)

// SEND A MESSAGE
app.post("/conversations/:conversation_id/messages/create", addMessageToConversation)

app.listen(3000);