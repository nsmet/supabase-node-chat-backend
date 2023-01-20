import { Response } from "express"
import supabase from "../utils/supabase"
import { 
    TypedRequestBody, 
    TypedRequestQuery, 
    TypedRequestQueryWithBodyAndParams, 
    TypedRequestQueryAndParams,
    User 
} from '../types';

export const getAllConversations = async function (req: TypedRequestQuery<{user_id: string}>, res: Response) {
    // get all conversations this user is attached to 
    const paticipatingConversationIds = await supabase
        .from('user_conversation')
        .select('conversation_id')
        .eq('user_id', req.query.user_id)
    
    if (!paticipatingConversationIds.data?.length) {
        return res.send([]);
    }

    const conversations = await supabase
        .from('conversations')
        .select(`
            *, 
            messages (
                message,
                created_at,

                users (
                    id,
                    username
                )
            )
        `)
        .or(`owner_user_id.eq.${req.query.user_id},or(id.in.(${paticipatingConversationIds.data.map((item: any) => item.conversation_id)}))`)

    return res.send(conversations.data)
}

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
      .select(`
        *,
        users (
            id,
            username
        )
      `)
  
    if (data.error) {
        res.send(500)
    } else {
        res.send(
            data.data[0]
        )
    }
}

export const getConversationMessages = async function (req: TypedRequestQueryAndParams<{conversation_id: string} ,{last_message_date: Date}>, res: Response) {
    const { conversation_id } = req.params;
    const { last_message_date } = req.query;

    let query = supabase
        .from('messages')
        .select(`
            message,
            created_at,

            users (
                id,
                username
            )
        `)
        .order('created_at', { ascending: true })
        .eq('conversation_id', conversation_id)
        
        if (last_message_date){
            query = query.gt('created_at', last_message_date)
        }

    const messages = await query;

    res.send(messages.data)
}