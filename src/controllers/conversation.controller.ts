import { Response } from "express"
import supabase from "../utils/supabase"
import { TypedRequestBody, TypedRequestQueryWithBodyAndParams, User } from '../types';

export const createConversation = async function (req: TypedRequestBody<{owner_id: string, participant_ids: string[], group_name: string}>, res: Response) {
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
}

export const addMessageToConversation = async function (req: TypedRequestQueryWithBodyAndParams<{conversation_id: string}, {user_id: string, message: string}>, res: Response) {
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
}