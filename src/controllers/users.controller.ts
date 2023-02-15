import { Response,Request } from "express"
import supabase from "../utils/supabase"
import { TypedRequestBody, TypedRequestQuery, TypedRequestQueryWithParams } from "../types"
import { extractDataFromJWT } from "../utils/auth"

export const createUser = async function (req: TypedRequestBody<{username: string;app_id:string}>, res: Response) {
    // TO DO - need app ID from JWT
    
    const userID = await addUser(req.body.username)
    if (!userID) return res.sendStatus(500)
    const appUserID = await addUserToApp(userID,req.body.app_id)
    if (!appUserID) return res.sendStatus(500)
    return res.send(userID)
}
const addUser = async function(username:string){
    const { data, error } = await supabase
        .from('users')
        .upsert({ 
            username: username,
        })
        .select()
    if (error) {
        return null
    } else {
        return data[0].id
    }
}
const addUserToApp = async function(userID:string,appID:string){
    const { data, error } = await supabase
        .from('user_app')
        .upsert({ 
            user_id: userID,
            app_id: appID
        })
        .select()
    if (error) {
        return null
    } else {
        return data[0].id
    }
}

// Create a new user_app entry
// create user_app entry

export const getAllUsers = async function (req: Request, res: Response) {
    const dataFromJWT = extractDataFromJWT(req as Request)
    console.log(dataFromJWT)
    if (!dataFromJWT) return res.sendStatus(401);
    const {appID} = dataFromJWT
    const { data, error } = await supabase
    .from('user_app')
    .select(`users(*)`)
    .eq('app_id', appID)

    if (error) {
        return res.sendStatus(500)
    } else {
        return res.send(data)
    }
}
export const getUserByID = async function (req: TypedRequestQueryWithParams<{user_id: string}>, res: Response) {
    const userID = req.params.user_id
    const { data, error } = await supabase
    .from('users')
    .select()
    .eq('id', userID)
    if (error) {
        res.sendStatus(500)
    } else {
        res.send(data[0])
    }
}
export const updateCurrentUser = async function (req: TypedRequestBody<{new_username: string}>, res: Response) {
    // Note these are for updating the current user
    // If we want to update a user by ID, we need an admin route
    const dataFromJWT = extractDataFromJWT(req as Request)
    if (!dataFromJWT) return res.sendStatus(401);
    const {userID} = dataFromJWT

    const newUsername = req.body.new_username

    try {
        const { data, error } = await supabase
        .from('users')
        .update({
            username: newUsername
        })
        .eq('id', userID)
        .select()

    if (error) {
        console.log(error)
        return res.sendStatus(400)
    } else {
        console.log(data)

        return res.sendStatus(200)
    }
    }catch(err){
        console.log(err)
        return  res.sendStatus(401)
    }
  
}
export const deleteUserByID = async function (req: TypedRequestQueryWithParams<{user_id: string}>, res: Response) {
    console.log("came in to delete")
    console.log(req.params)
    const userID = req.params.user_id
    console.log({userID})
    try{
        const { data, error } = await supabase
            .from('users')
            .delete()
            .eq('id', userID)
        if (error) {
            console.log(error)
            return res.sendStatus(500)
        } else {
            return res.send(data[0])
        }
        }catch(err){
            console.log(err)
            return res.sendStatus(500)
        }
}
export const deleteCurrentUser = async function (req:Request, res: Response) {
    const dataFromJWT = extractDataFromJWT(req as Request)
    if (!dataFromJWT) return res.sendStatus(401);
    const {userID} = dataFromJWT

    const removedFromApp = await removeUserFromApp(userID)
    if (!removedFromApp) return res.sendStatus(500)
    const removedUser = await removeUser(userID)
    if (!removedUser) return res.sendStatus(500)
    return res.sendStatus(200)
}
const removeUser = async function(userID:string){
    try{
        const { data, error } = await supabase
            .from('users')
            .delete()
            .eq('id', userID)
            .select()
        if (error) {
            console.log(error)
            return null
        } else {
            return data[0]
        }
        }catch(err){
            console.log(err)
            return null
        }
}
const removeUserFromApp = async function(userID:string){
    try{
        const { data, error } = await supabase
            .from('user_app')
            .delete()
            .eq('user_id', userID)
            .select()
        if (error) {
            console.log(error)
            return null
        } else {
            console.log(data)
            return data[0]
        }
        }catch(err){
            console.log(err)
            return null
        }
}



export const searchUsers =   async function (req: TypedRequestQuery<{user_id: string, q: string}>, res: Response) {
    // To do - make sure matches what I put in api
    // To do - make sure they are in the same app
    let query = supabase
      .from('users')
      .select();
    
    if (req.query.q) {
        query = query.like('username', `%${req.query.q}%`)
    }

    query = query.neq('id', req.query.user_id)
    .limit(50);
  
    const { data, error } = await query;
    
    if (error) {
        return res.sendStatus(500)
    } else {
        return res.send(data)
    }
}

export const connectUser = async function (req: TypedRequestBody<{username: string}>, res: Response) {
    // TODO - write this code
    const { data, error } = await supabase
        .from('users')
        .upsert({ 
            username: req.body.username,
            created_at: ((new Date()).toISOString()).toLocaleString()
        })
        .select()

    if (error) {
        return res.sendStatus(500)
    } else {
        return res.send(data[0])
    }
}