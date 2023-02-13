import  { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import crypto from 'crypto'

import { UserPayLoad } from "../types";
import supabase from "../utils/supabase"

async function verifyToken(token:string) {
    const jwtKey = process.env.SECRET_JWT_KEY
    if (!jwtKey) throw new Error("No JWT key found")
    if (!token) return false
    try{
      const {team,username,appID} = await jwt.verify(token,jwtKey) as UserPayLoad
      if (!team){
        return false
      }
      if (!username){
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

export const secureClientRoutesWithJWTs = async (req:Request, res:Response, next:NextFunction) =>{
    const nonSecureRoutes = ['/get-chat-token','/get-server-api-key']
    if (nonSecureRoutes.includes(req.path)){
      return next()
    }
    if (!req.headers.authorization) {
      return res.status(403).json({ error: 'No credentials sent!' });
    }
    const jwt = req.headers.authorization.split(' ')[1]
    const isVerified = await verifyToken(jwt)
  
    if (!isVerified){
      return res.status(401).json({ error: 'Invalid token' });
    }
  
    next();
  }
  
export const newAPIKey = async function (keyDetails:{userID:string,appID:string,companyID:string}) {
    const {userID, appID,companyID} = keyDetails
    const newKey = crypto.randomUUID();

    try{
        const {data, error } = await supabase
        .from('api_keys')
        .upsert({ key: newKey,app_id:appID,company_id:companyID,owner_user_id:userID,name:"new API key"})
        .eq('app_id', appID)
        if (error){
            console.log(error)
        }
        else{
            console.log(data)
            return newKey
        }
    }catch(err){
        console.log(err)
    }
}
export const isValidAPIKey = async function (appID:string, receivedAPIKey:string) {
  try{
    console.log({appID})
    console.log({receivedAPIKey})
        const { data, error } = await supabase
        .from('api_keys')
        .select('key')
        .eq('app_id', appID)
        .eq('key', receivedAPIKey)
        if (error){
            console.log(error)
            return false
        }
        else{
            if (data.length === 0) {
              console.log("No api key found")
              return false
            }
            if (data.length > 1) {
              console.log("MORE THAN ONE API KEY FOUND")
              return false
            }
            const storedAPIKey = data[0].key
            return receivedAPIKey === storedAPIKey
        }
    }catch(err){
        return false
    }
}