import express, { Response } from "express";
import bodyParser from "body-parser";
import { createClient } from '@supabase/supabase-js'

import { 
  TypedRequestBody, 
  TypedRequestQuery,
  TypedRequestQueryWithBodyAndParams
 } from "./types";

 import { Database } from "./supabase.types";
import { User } from './types';

const supabase = createClient<Database>(process.env.SUPABASE_PROJECT_URL as string, process.env.SUPABASE_PUBLIC_ANON as string);
const app = express();

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());


app.get("/", function (req, res) {
  res.send("Hello World");
});
 
// CREATE A NEW USER
app.post("/create-user", async function (req: TypedRequestBody<{username: string}>, res: Response) {
  const { data, error } = await supabase
    .from('users')
    .upsert({ 
      username: req.body.username,
      created_at: new Date().toLocaleString()
     })
    .select()

    if (error) {
      res.send(500)
    } else {
      res.send(data[0])
    }
});

// SEARCH USERS
app.get("/search-users", async function (req: TypedRequestQuery<{user_id: string, q: string}>, res: Response) {
  const { data, error } = await supabase
    .from('users')
    .select()
    .like('username', `%${req.query.q}%`)
    .neq('id', req.query.user_id)
    .limit(10)

    if (error) {
      res.send(500)
    } else {
      res.send(data)
    }
});

// START A NEW CONVERSATION
app.post("/start-conversation", async function (req: TypedRequestBody<{owner_id: string, participant_ids: string[], group_name: string}>, res: Response) {
  const {
    owner_id,
    participant_ids,
    group_name,
  } = req.body;

  // first create the conversation 
  const conversation = await supabase
    .from('conversations')
    .upsert({ 
      name: group_name,
      owner_user_id: owner_id,
      created_at: new Date().toLocaleString()
     })
    .select()

    if (conversation.error) {
      res.send(500)
    }

    let participants: User[] = [];

    if (participant_ids.length > 1 && conversation.data?.length) {
      // attach all our users to this conversation
      const pivotData = await supabase
        .from('user_conversation')
        .upsert(participant_ids.map((participant_id) => {
          return { 
            user_id: participant_id, 
            conversation_id: conversation.data[0].id
          }
        }))
        .select()

        if (pivotData.data?.length) {
          // find our actual users 
          const actualParticipantUsers = await supabase
            .from('users')
            .select()
            .in('id', participant_ids)

          if (actualParticipantUsers.data?.length) participants = actualParticipantUsers.data;
        }
    }

    if (conversation.error) {
      res.send(500)
    } else {
      res.send({
        ...conversation.data[0],
        participants
      })
    }
});

// SEND A MESSAGE
app.post("/conversations/:conversation_id", async function (req: TypedRequestQueryWithBodyAndParams<{conversation_id: string}, {user_id: string, message: string}>, res: Response) {
  const conversationid = req.params.conversation_id;
  const {
    user_id,
    message,
  } = req.body;

  const data = await supabase
    .from('messages')
    .upsert({ 
      conversation_id: conversationid,
      user_id,
      message,
      created_at: new Date().toLocaleString()
    })
    .select()

    if (data.error) {
      res.send(500)
    } else {
      res.send(
        data.data[0]
      )
    }
})  
app.listen(3000);