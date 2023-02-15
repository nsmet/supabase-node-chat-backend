import {  Response,Request } from "express"
import jwt from 'jsonwebtoken'
import { 
    TypedRequestBody, 
} from '../types';
import { newAPIKey,isValidAPIKey } from "../utils/auth";
import supabase from "../utils/supabase";

export const getServerAPIKey = async (req:TypedRequestBody<{appID:string}>, res:Response) => {
    // Get that from Supabase Auth
  const devID = "b29c513b-4e9d-4479-8b36-c9eb9ca7f870"
    // CompanyID should come from the users auth id?
    const companyID = "d17f074e-baa9-4391-b24e-0c41f7944553"
    const appID = req.body.appID

    if (!devID){
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
    const apiKey = await newAPIKey({userID: devID,appID,companyID})
    if (!apiKey){
      return res.status(400).json({ error: 'Could not generate API key!' });
    }
    return res.send(apiKey)
  }

  async function getCompanyIDFromAppID (appID:string) {
    try{
      console.log("looking up ",appID)
      const { data, error } = await supabase
      .from('company_app')
      .select('company_id')
      .eq('app_id', appID)
      if (error){
          console.log(error)
          return false
      }
      else{
          if (data.length === 0) {
            throw new Error("No company id found")
          }
          if (data.length > 1) {
            throw new Error("MORE THAN ONE APP found")
          }
          const companyID = data[0].company_id
          return companyID
      }
  }catch(err){
    console.log(err)
    throw new Error("Issue get")
  }
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

    const companyID = await getCompanyIDFromAppID(appID)
    console.log(companyID)

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
      expiresIn:60000 // TO DO - need to make this longer & revokable and renewable
    })
    return res.send(token)
  }