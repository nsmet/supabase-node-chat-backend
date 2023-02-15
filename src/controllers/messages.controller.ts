import { Response } from "express"
import supabase from "../utils/supabase"
import Socket from '../utils/socket';
import { 
  TypedRequestQueryWithParams, 
    Message,
    TypedRequestBody,
    TypedRequestQuery,
    TypedRequestQueryWithBodyAndParams
} from '../types';


export const sendMessageToChannel = async function (req: TypedRequestBody<{user_id: string, message: string,channel_id:string}>, res: Response) {
    const {
      channel_id,
      user_id,
      message,
    } = req.body;

    const messageID = await addMessage(message)
    if (!messageID){return res.sendStatus(500)}
    console.log(messageID)
    const messageUserID = await addMessageToUser(messageID,user_id)
    console.log(messageUserID)
    if (!messageUserID){return res.sendStatus(500)}
    console.log({channel_id})
    const messageChannelID = await addMessageToChannel(messageID,channel_id)
    console.log(messageChannelID)
    return res.send(messageID)
    // add message to user
    // add message to channel

    // TO DO - fix up the socket io stuff

    // get the users in this chat, except for the current one
    // const userChannelIds = await supabase
    //     .from('user_channel')
    //     .select('user_id')
    //     .eq('channel', channelID)
    // To Do: get this working again
    // if (data.error) {
    //     res.send(500)
    // } else {
    //     if (userChannelIds.data && userChannelIds.data?.length > 0) {
    //         const userIdsForMessages = userChannelIds.data.map((item) => item.user_id).filter((item) => item !== user_id);
    //         Socket.sendMessageToUsers(userIdsForMessages as string[], data.data[0] as Message)
    //     }

    //     res.send(
    //         data.data[0]
    //     )
    // }
}
const addMessage = async function (message:string) {
  try{
    const {error,data} = await supabase
      .from('messages')
      .upsert({ 
        message,
      })
      .select(`
        id
      `)
      if (error){
        console.log(error)
        return null
      }
      console.log(data)
      return data[0].id
  }catch(err){
    console.log(err)
    return null
  }
}
const addMessageToUser = async function (messageID:string, userID:string) {
    try{
      const {error,data} = await supabase
        .from('message_user')
        .upsert({ 
          message_id:messageID,
          user_id:userID
        })
        .select(`
          id
        `)
        if (error){
          console.log(error)
          return null
        }
        console.log(data)
        return data[0].id
    }catch(err){
      console.log(err)
      return null
    }
}
const addMessageToChannel = async function (messageID:string, channelID:string) {
  try{
    const {error,data} = await supabase
      .from('message_channel')
      .upsert({ 
        message_id:messageID,
        channel_id:channelID
      })
      .select(`
        id
      `)
      if (error){
        console.log(error)
        return null
      }
      console.log(data)
      return data[0].id
  }catch(err){
    console.log(err)
    return null
  }
}




export const getMessageByID = async function (req:TypedRequestQueryWithParams <{message_id: string}>, res: Response) {
  const messageID = req.params.message_id

  const { data, error } = await supabase
      .from('messages')
      .select(`*, sender:message_user(username:users(username))`)
      .eq('id', messageID)

  if (error) {
      console.log(error)
      res.sendStatus(500)
  } else {
    const message = data[0]
    const sender = message.sender as {username:{username:string}}[]
    const username = sender[0].username.username
      return res.send({
        id:message.id,
        message:message.message,
        created_at:message.created_at,
        updated_at:message.updated_at,
        username
      })

  }
}

export const updateMessageByID = async function (req: TypedRequestQueryWithBodyAndParams<{message_id: string},{new_message:string}>, res: Response) {
  const messageID = req.params.message_id
  const newMessage = req.body.new_message
  const { data, error } = await supabase
    .from('messages')
    .update({
      message: newMessage
    })
    .eq('id', messageID) 
    .select()
  if (error) {
    console.log(error)
    return res.sendStatus(500)
  } else {
    return res.send(data[0])
  }
}

export const deleteMessageByID = async function (req: TypedRequestQueryWithParams<{message_id: string}>, res: Response) {
  const message_id = req.params.message_id
  const removedMessageUser = await removeMessageUser(message_id)
  if (!removedMessageUser){return res.sendStatus(500)}
  const removedMessageChannel = await removeMessageChannel(message_id)
  if (!removedMessageChannel){return res.sendStatus(500)}
  const deletedMessage = await removeMessage(message_id)
  if (!deletedMessage){return res.sendStatus(500)}
  return res.send(deletedMessage)

  // TODO - write this code
  
}
const removeMessageUser = async function (messageID:string) { 
  const { data, error } = await supabase
  .from('message_user')
  .delete()
  .eq('message_id', messageID) 
  .select()
  if (error) {
    console.log(error)
    return null
  } else {
    console.log(data)
    return data[0]
  }
}
const removeMessageChannel = async function (messageID:string) { 
  const { data, error } = await supabase
  .from('message_channel')
  .delete()
  .eq('message_id', messageID) 
  .select()
  if (error) {
    console.log(error)
    return null
  } else {
    console.log("success")
    console.log(data)
    return data[0]
  }
}

const removeMessage = async function (messageID:string) { 
  const { data, error } = await supabase
  .from('messages')
  .delete()
  .eq('id', messageID) 
  .select()
  if (error) {
    console.log(error)
    return null
  } else {
    console.log("success")
    console.log(data)
    return data[0]
  }
}