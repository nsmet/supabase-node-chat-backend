import { Response } from "express"
import supabase from "../utils/supabase"
import Socket from '../utils/socket';
import { 
    TypedRequestBody, 
    TypedRequestQuery, 
    TypedRequestQueryAndParams,
    User,
    Channel
} from '../types';

export const getAllChannels = async function (req: TypedRequestQuery<{user_id: string}>, res: Response) {
    // get all channels this user is attached to 
    const paticipatingChannelIds = await supabase
        .from('user_channel')
        .select('channel_id')
        .eq('user_id', req.query.user_id)

    if (!paticipatingChannelIds.data?.length) {
        return res.send([]);
    }

    const channels = await supabase
        .from('channels')
        .select(`
            *, 
            messages (
                id,
                channel_id,
                message,
                created_at,
                users (
                    id,
                    username
                )
            )
        `)
        .or(`owner_user_id.eq.${req.query.user_id},or(id.in.(${paticipatingChannelIds.data.map((item: any) => item.channel_id)}))`)

    return res.send(channels.data)
}

export const createChannel = async function (req: TypedRequestBody<{owner_id: string, participant_ids: string[], group_name: string}>, res: Response) {
    const {
      owner_id,
      participant_ids,
      group_name,
    } = req.body;
  
    // first create the channel 
    const channel = await supabase
      .from('channels')
      .upsert({ 
        name: group_name,
        owner_user_id: owner_id,
        created_at: ((new Date()).toISOString()).toLocaleString()
       })
      .select()

    if (channel.error) {
        res.send(500)
    }

    let participants: User[] = [];

    if (participant_ids.length > 1 && channel.data?.length) {
        // attach all our users to this channel
        const pivotData = await supabase
            .from('user_channel')
            .upsert(participant_ids.map((participant_id) => {
            return { 
                user_id: participant_id, 
                channel_id: channel.data[0].id
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

    if (channel.error) {
        return res.sendStatus(500)
    } else {
        const conv: Channel = {
            ...channel.data[0],
            participants
        };

        Socket.notifyUsersOnChannelCreate(participant_ids as string[], conv)
        return res.send(conv);
    }
}

export const getChannelMessages = async function (req: TypedRequestQueryAndParams<{channel_id: string} ,{last_message_date: Date}>, res: Response) {
    const { channel_id } = req.params;
    const { last_message_date } = req.query;

    let query = supabase
        .from('messages')
        .select(`
            id,
            channel_id,
            message,
            created_at,
    
            users (
                id,
                username
            )
        `)
        .order('created_at', { ascending: true })
        .eq('channel_id', channel_id)
        
        if (last_message_date){
            query = query.gt('created_at', last_message_date)
        }

    const messages = await query;    

    res.send(messages.data)
}

export const getChannelByID = async function (req: TypedRequestQueryAndParams<{channel_id: string} ,{last_message_date: Date}>, res: Response) {
    // TODO - write this code
    const { channel_id } = req.params;
    const { last_message_date } = req.query;

    let query = supabase
        .from('messages')
        .select(`
            id,
            channel_id,
            message,
            created_at,
    
            users (
                id,
                username
            )
        `)
        .order('created_at', { ascending: true })
        .eq('channel_id', channel_id)
        
        if (last_message_date){
            query = query.gt('created_at', last_message_date)
        }

    const messages = await query;    

    res.send(messages.data)
}

export const updateChannelByID = async function (req: TypedRequestQueryAndParams<{channel_id: string} ,{last_message_date: Date}>, res: Response) {
    // TODO - write this code
    
    const { channel_id } = req.params;
    const { last_message_date } = req.query;

    let query = supabase
        .from('messages')
        .select(`
            id,
            channel_id,
            message,
            created_at,
    
            users (
                id,
                username
            )
        `)
        .order('created_at', { ascending: true })
        .eq('channel_id', channel_id)
        
        if (last_message_date){
            query = query.gt('created_at', last_message_date)
        }

    const messages = await query;    

    res.send(messages.data)
}

export const deleteChannelByID = async function (req: TypedRequestQueryAndParams<{channel_id: string} ,{last_message_date: Date}>, res: Response) {
    // TODO - write this code
    
    const { channel_id } = req.params;
    const { last_message_date } = req.query;

    let query = supabase
        .from('messages')
        .select(`
            id,
            channel_id,
            message,
            created_at,
    
            users (
                id,
                username
            )
        `)
        .order('created_at', { ascending: true })
        .eq('channel_id', channel_id)
        
        if (last_message_date){
            query = query.gt('created_at', last_message_date)
        }

    const messages = await query;    

    res.send(messages.data)
}