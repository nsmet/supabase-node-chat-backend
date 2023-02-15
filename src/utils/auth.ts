import  { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import crypto from 'crypto'

import { UserPayLoad } from "../types";
import supabase from "../utils/supabase"

function verifyToken(token:string) {
    const jwtKey = process.env.SECRET_JWT_KEY
    if (!jwtKey) throw new Error("No JWT key found")
    if (!token) return false
    try{
      const {userID,companyID,appID} = jwt.verify(token,jwtKey) as UserPayLoad
      if (!companyID){
        return false
      }
      if (!userID){
        return false
      }
      if (!appID){
        return false
      }
      return true
    }catch(err){
        return false
    }
  
  }


export function extractDataFromJWT (req:Request) {
  if (!req.headers.authorization) throw new Error("No JWT found")
  const token = req.headers.authorization.split(' ')[1]
  const jwtKey = process.env.SECRET_JWT_KEY
  if (!jwtKey) throw new Error("No JWT key found")
  if (!token) return false


  const {userID,companyID,appID} =  jwt.verify(token,jwtKey) as UserPayLoad
  return ({userID,companyID,appID})
}

export const secureClientRoutesWithJWTs = async (req:Request, res:Response, next:NextFunction) =>{
  // TO DO  - need to make sure these routes are secure
  const nonSecureRoutes = ['/get-chat-token','/get-server-api-key',"/apps","/companies","/developers"]
  console.log(req.path.split("/"))
  const initialPath = req.path.split("/")[1]
  if (initialPath === "apps" && req.method === "DELETE"){
    return next()
  }
  // TO DO - need to put this behind API key & server only.
  if (req.path === "/users" && req.method === "POST"){
    return next()
  }   
  
  if (nonSecureRoutes.includes(req.path)){
      return next()
    }
    if (!req.headers.authorization) {
      return res.status(403).json({ error: 'No credentials sent!' });
    }
    const jwt = req.headers.authorization.split(' ')[1]
    const isVerified = verifyToken(jwt)
  
    if (!isVerified){
      return res.status(401).json({ error: 'Invalid token' });
    }
    next();
  }
  
export const newAPIKey = async function (keyDetails:{userID:string,appID:string,companyID:string}) {
    const {userID, appID} = keyDetails
    const newKey = crypto.randomUUID();
    const APIKeyID = await addAPIKey(newKey)
    if (!APIKeyID){
      return null
    }
    const APIKeyToDeveloperID = await linkAPIKeyToDeveloper(APIKeyID,userID)
    if (!APIKeyToDeveloperID){
      return null
    }
    const APIKeyToApp = await linkAPIKeyToApp(APIKeyID,appID)
    if (!APIKeyToApp){
      return null
    }
    return newKey
}

const addAPIKey = async function(newKey:string):Promise<string|null>{
  
  try{
    const {data, error } = await supabase
    .from('api_keys')
    .upsert({ api_key: newKey,name:"new API key"})
    .select()
    if (error){
        console.log(error)
        return null
    }
    else{
        console.log(data)
        return data[0].id
    }
}catch(err){
    console.log(err)
    return null
}
}
const linkAPIKeyToDeveloper = async function(apiKeyID:string,developerID:string):Promise<string|null>{
  try{
    const {data, error } = await supabase
    .from('api_key_developer')
    .upsert({ api_key_id: apiKeyID,developer_id:developerID})
    .select()
    if (error){
        console.log(error)
        return null
    }
    else{
        console.log(data)
        return data[0].id
    }
}catch(err){
    console.log(err)
    return null
}
}

const linkAPIKeyToApp = async function(apiKeyID:string,appID:string):Promise<string|null>{
  try{
    const {data, error } = await supabase
    .from('api_key_app')
    .upsert({ api_key_id: apiKeyID,app_id:appID})
    .select()
    if (error){
        console.log(error)
        return null
    }
    else{
        console.log(data)
        return data[0].id
    }
}catch(err){
    console.log(err)
    return null
}
}

export const isValidAPIKey = async function (appID:string, receivedAPIKey:string) {
  try{
        const { data, error } = await supabase
        .from('api_key_app')
        .select(`api_keys(
          api_key
        )`)
        .eq('app_id', appID)
        if (error){
            console.log(error)
            return false
        }
        else{
            if (data.length === 0) {
              console.log("No api key found")
              return false
            }
            const isAuthenticated = data.some((item:any) => item.api_keys.api_key === receivedAPIKey)
            return isAuthenticated
        }
    }catch(err){
        return false
    }
}