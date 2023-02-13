import {  Response,Request } from "express"
import jwt from 'jsonwebtoken'
import { 
    TypedRequestBody, 
} from '../types';
import { newAPIKey,isValidAPIKey } from "../utils/auth";

export const getServerAPIKey = async (req:TypedRequestBody<{appID:string}>, res:Response) => {
    // Get that from Supabase Auth
    const userID = "3145fe5e-3ddd-4604-8765-76939de12dd5"
    // CompanyID should come from the users auth id?
    const companyID = "d17f074e-baa9-4391-b24e-0c41f7944553"
    const appID = req.body.appID
    console.log({appID})
    if (!userID){
      return res.status(400).json({ error: 'No username!' });
    }
    if (!appID){
      return res.status(400).json({ error: 'No appID!' });
    }
    if (!companyID){
      return res.status(400).json({ error: 'No company!' });
    }
    //TO DO need to  do the validation on supabase side
    //TO DO Need to put the key in a more secure place etc. and hash it
    const apiKey = await newAPIKey({userID,appID,companyID})
    if (!apiKey){
      return res.status(400).json({ error: 'Could not generate API key!' });
    }
    return res.send(apiKey)
  }

  export const getChatToken = async (req: Request, res: Response) => {
    const jwtKey = process.env.SECRET_JWT_KEY
    if (!req.headers.authorization) {
      return res.status(403).json({ error: 'No server key sent!' });
    }
    if (!jwtKey) throw new Error("No JWT key found")
    // Developer provides this:
    // This is not the developer user, but the end user's username
    const userID = req.body.user_id
    
    // They send along app ID
    const appID = req.body.app_id
    
    // TO DO - We figure out team from app ID
    const companyID = "123"
    if (!userID){
      return res.status(403).json({error:"No username"})
    }
    if (!appID){
      return res.status(403).json({error:"No app ID"})
    }
    if (!companyID){
      return res.status(403).json({error:"No team"})
    }

    const apikey = req.headers.authorization.split(' ')[1]
  
    const isValid = await isValidAPIKey(appID,apikey)
    if (!isValid){
      return res.status(400).json({ error: 'Invalid API key' });
    }
  
    const claims = { userID,companyID,appID }
    // To do - make async?
    const token = jwt.sign(claims, jwtKey,{
      expiresIn:600 // TO DO - need to make this longer & revokable and renewable
    })
    return res.send(token)
  }