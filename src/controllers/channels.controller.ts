import { Response, Request } from "express"
import supabase from "../utils/supabase"
import Socket from '../utils/socket';
import { 
    TypedRequestBody, 
    TypedRequestQuery, 
    TypedRequestQueryAndParams,
    TypedRequestQueryWithBodyAndParams
} from '../types';
import { extractDataFromJWT } from "../utils/auth";

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

export const createChannel = async function (req: TypedRequestBody<{participant_ids: string[], group_name: string}>, res: Response) {
    
    if (!req.body) return res.sendStatus(400)
    if (!req.body.participant_ids || !req.body.group_name) return res.sendStatus(400)
    if(!req.body.participant_ids.length) return res.sendStatus(400)

    const data = extractDataFromJWT(req as Request)
    console.log(data)

    if (!data) return res.sendStatus(401);
    const {userID,appID} = data
    const {
      participant_ids,
      group_name,
    } = req.body;

    // first create the channel 
    const channel = await addChannel(group_name,userID)
    if (!channel) return res.sendStatus(500)
    const channelID = channel[0].id
    const channelApp = await addChannelToApp(channelID, appID)
    
    if (!channelApp) return res.sendStatus(500)
    
    const participantsInChannel = await addParticipantsToChannel(channelID, participant_ids)
    if (!participantsInChannel) return res.sendStatus(500)
    else return res.send(channel)
    // TO DO - bring this back without errors
    
    // const participants: User[] = [];
    //      const conv: Channel = {
    //          ...channel[0],
    //          participants
    //      };

    //      Socket.notifyUsersOnChannelCreate(participant_ids as string[], conv)
    //      return res.send(conv);
}

const addChannel = async function(name:string,userID:string) {
    const channel = await supabase
        .from('channels')
        .upsert({ 
        name: name,
        owner_user_id:userID
    })
        .select()

    if (channel.error) {
        return null
    }
    else return channel.data
}
const addChannelToApp = async function(channelID:string, appID:string) {
    const channel = await supabase
        .from('channel_app')
        .upsert({ 
            channel_id: channelID,
            app_id: appID
    })
        .select()

    if (channel.error) {
        return null
    }
    else return channel.data
}
const addParticipantsToChannel = async function(channelID:string, participantIDs:string[]) {

    try{
        await participantIDs.map(async paricipantID => {
            console.log({paricipantID})
            const {data,error} = await supabase
            .from('user_channel')
            .upsert({
                user_id: paricipantID,
                channel_id: channelID
            })
            .select()
            if (error) {
                console.log(error)
                return false
            }
            if (data){
                return true
            }
        })

    }catch(err){
        console.log(err)
        return false
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
// this feels a bit crap
export const getChannelByID = async function (req: TypedRequestQueryAndParams<{channel_id: string} ,{last_message_date: Date}>, res: Response) {
    // TODO - write this code
    console.log('get channel by id')
    const { channel_id } = req.params;
    const { last_message_date } = req.query;
    try {
        const {error,data} = await supabase
        .from('channels')
        .select(`
            name,
            my_messages:message_channel(
                id,
                messages:messages(
                    id,
                    message,
                    who_sent:message_user(
                        user_id:users(
                            username
                        )
                    )
                )
            )
        `)
        // .order('created_at', { ascending: true })
        .eq('id', channel_id)
        // TO DO - add messages onto query
        // if (last_message_date){
        //     query = query.gt('created_at', last_message_date)
        // }

        if (error){
            console.log(error)
            res.sendStatus(500)
        }
        else {
            console.log(data)
            const transformedData = transformData(data)
            console.log(transformedData)
            res.send(transformedData)
        }

    // res.send(messages.data)
    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }

    
}

export const updateChannelByID = async function (req: TypedRequestQueryWithBodyAndParams<{channel_id: string} ,{name:string;owner_user_id:string}>, res: Response) {    
    const { channel_id } = req.params;
    const {name,owner_user_id} = req.body
    const {error,data} = await supabase
        .from('channels')
        .update({name:name,owner_user_id:owner_user_id})
        .eq('id', channel_id)
        .select()
    if (error){
        console.log(error)
        res.sendStatus(500)
    }else {
        console.log({data})
        res.send(data)
    }

}



export const deleteChannelByID = async function (req: TypedRequestQueryAndParams<{channel_id: string} ,{last_message_date: Date}>, res: Response) {
    const { channel_id:channelID } = req.params;
    const deletedChannelMessages = await removeChannelMessage(channelID)
    if (!deletedChannelMessages) return res.sendStatus(500)
    if (deletedChannelMessages.length === 0){res.status(500).send("No matching channels");}
    const deletedChannelApp = await removeChannelApp(channelID)
    console.log({deletedChannelApp})
    if (!deletedChannelApp) return res.sendStatus(500)
    const deletedChannel = await removeChannel(channelID)
    console.log({deletedChannel})
    if (!deletedChannel) return res.sendStatus(500)
    return res.send(deletedChannel)
}

const removeChannel = async function(channelID:string) {
    const {error,data} = await supabase
        .from('channels')
        .delete()
        .eq('id', channelID)
        .select()
    if (error){
        console.log(error)
        return null
    }else {
        console.log({data})
        return data
    }
}
const removeChannelMessage = async function(channelID:string) {
    const {error,data} = await supabase
        .from('message_channel')
        .delete()
        .eq('channel_id', channelID)
        .select()
    if (error){
        console.log(error)
        return null
    }else {
        console.log({data})
        return data
    }
}
const removeChannelApp = async function(channelID:string) {
    const {error,data} = await supabase
        .from('channel_app')
        .delete()
        .eq('channel_id', channelID)
        .select()
    if (error){
        console.log(error)
        return null
    }else {
        console.log({data})
        return data
    }
}



function transformData(dataReceived: any[]): any {
    const transformedData = dataReceived.map((group) => {
      return group.my_messages.map((message:any) => {
        return {
          name: group.name,
          id: message.id,
          messages: message.messages.message,
          username: message.messages.who_sent[0].user_id.username,
        };
      });
    });
  
    // Flatten the transformed data into a single array
    return [].concat.apply([], transformedData);
  }


//function to transform dataReceived into desiredFormat
