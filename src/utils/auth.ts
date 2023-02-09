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
      const {team,username} = await jwt.verify(token,jwtKey) as UserPayLoad
      if (!team){
        return false
      }
      if (!username){
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

  

export const newAPIKey = async function (username:string) {
    const newKey = crypto.randomUUID();
    try{
        const {data, error } = await supabase
        .from('users')
        .update({ apikey: newKey })
        .eq('username', username)
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
export const isValidAPIKey = async function (username:string, apikey:string) {

    try{
        const { data, error } = await supabase
        .from('users')
        .select('apikey')
        .eq('username', username)
        if (error){
            
            return false
        }
        else{
            if (data.length === 0) return false
            const storedAPIKey = data[0].apikey
            return apikey === storedAPIKey
        }
    }catch(err){
        return false
    }
}