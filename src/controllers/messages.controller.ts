import { Response } from "express"
import supabase from "../utils/supabase"
import Socket from '../utils/socket';
import { 
    TypedRequestQueryWithBodyAndParams, 
    Message,
    TypedRequestBody
} from '../types';


export const sendMessageToChannel = async function (req: TypedRequestQueryWithBodyAndParams<{channel_id: string}, {user_id: string, message: string}>, res: Response) {
    const channelID = req.params.channel_id;
    const {
      user_id,
      message,
    } = req.body;

    const data = await supabase
      .from('messages')
      .upsert({ 
        channel_id: channelID,
        user_id,
        message,
        created_at: ((new Date()).toISOString()).toLocaleString()
      })
      .select(`
        *,
        users (
            id,
            username
        ),
        channels (*)
      `)

    // get the users in this chat, except for the current one
    const userChannelIds = await supabase
        .from('user_channel')
        .select('user_id')
        .eq('channel', channelID)

    if (data.error) {
        res.send(500)
    } else {
        if (userChannelIds.data && userChannelIds.data?.length > 0) {
            const userIdsForMessages = userChannelIds.data.map((item) => item.user_id).filter((item) => item !== user_id);
            Socket.sendMessageToUsers(userIdsForMessages as string[], data.data[0] as Message)
        }

        res.send(
            data.data[0]
        )
    }
}

export const getMessageByID = async function (req: TypedRequestBody<{username: string}>, res: Response) {
  // TODO - write this code
  const { data, error } = await supabase
      .from('users')
      .select()

  if (error) {
      res.send(500)
  } else {
      res.send(data[0])
  }
}

export const updateMessageByID = async function (req: TypedRequestBody<{username: string}>, res: Response) {
  // TODO - write this code
  const { data, error } = await supabase
      .from('users')
      .select()

  if (error) {
      res.send(500)
  } else {
      res.send(data[0])
  }
}

export const deleteMessageByID = async function (req: TypedRequestBody<{username: string}>, res: Response) {
  // TODO - write this code
  const { data, error } = await supabase
      .from('users')
      .select()

  if (error) {
      res.send(500)
  } else {
      res.send(data[0])
  }
}