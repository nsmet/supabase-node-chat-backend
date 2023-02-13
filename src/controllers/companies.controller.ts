import {  Response } from "express"
import { 
    TypedRequestBody, 
} from '../types';
import supabase from "../utils/supabase"

export const createNewCompany = async (req:TypedRequestBody<{name:string,user_id:string}>, res:Response) => {
    const name = req.body.name
    const userID = req.body.user_id

    // create new app in supabase
    try {
        const { data, error } = await supabase
        .from('companies')
        .upsert({ 
          name: name,
          owner_user_id: userID
         })
        .select()
        if (error) {
            console.log(error)
            return res.status(500).json({error:"Could not create company"})
        } else {
            console.log(data)
            res.send(data[0])
        }
    }catch(err) {
        console.log(err)
        return res.status(500).json({error:"Could not create company"})
    }
  }