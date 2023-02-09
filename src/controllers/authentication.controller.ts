import {  Response,Request } from "express"
import jwt from 'jsonwebtoken'
import { 
    TypedRequestBody, 
} from '../types';
import { newAPIKey,isValidAPIKey } from "../utils/auth";




export const getServerAPIKey = async (req:TypedRequestBody<{username:string}>, res:Response) => {
    const username = req.body.username
    if (!username){
      return res.status(400).json({ error: 'No username sent!' });
    }
    //TO DO need to  do the validation on supabase side
    //TO DO Need to put the key in a more secure place etc. and hash it
    const apiKey = await newAPIKey(username)
    return res.send(apiKey)
  }

  export const getChatToken = async (req: Request, res: Response) => {
    const jwtKey = process.env.SECRET_JWT_KEY
    if (!req.headers.authorization) {
      return res.status(403).json({ error: 'No server key sent!' });
    }
    if (!jwtKey) throw new Error("No JWT key found")
    const username = req.body.username
    if (!username){
      return res.status(403).json({error:"No username"})
    }
    const apikey = req.headers.authorization.split(' ')[1]
  
    const isValid = await isValidAPIKey(username,apikey)
    if (!isValid){
      return res.status(400).json({ error: 'Invalid API key' });
    }
  
    const team = "tinder";
    const claims = { team,username }
    const token = await jwt.sign(claims, jwtKey,{
      expiresIn:60
    })
    return res.send(token)
  }