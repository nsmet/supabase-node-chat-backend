import {  Response } from "express"
import { 
    TypedRequestBody, TypedRequestQueryWithParams, 
} from '../types';
import supabase from "../utils/supabase"

export const createNewApp = async (req:TypedRequestBody<{name:string,user_id:string}>, res:Response) => {
    const name = req.body.name
    const userID = req.body.user_id
    // TODO - need to get companyID myself from user.
    const companyID = "d17f074e-baa9-4391-b24e-0c41f7944553"
    // create new app in supabase
    try {
        const { data, error } = await supabase
        .from('apps')
        .upsert({ 
          name: name,
          owner_user_id: userID,
          company_id: companyID
         })
        .select()
        if (error) {
            console.log(error)
            return res.status(500).json({error:"Could not create app"})
        } else {
            console.log(data)
            res.send(data[0])
        }
    }catch(err) {
        console.log(err)
        return res.status(500).json({error:"Could not create app"})
    }
  }

export const deleteAppByID = async (req:TypedRequestQueryWithParams<{app_id:string}>, res:Response) => {
    const appID = req.params.app_id
    try {
        const { error } = await supabase
        .from('apps')
        .delete()
        .eq('id', appID)
        if (error) {
            console.log(error)
            return res.status(500).json({error:"Could not delete app"})
        } else {
            res.send("app deleted")
        }
    }catch(err) {
        console.log(err)
        return res.status(500).json({error:"Could not delete app"})
    }
  }



