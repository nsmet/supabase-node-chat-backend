import {  Response } from "express"
import { 
    TypedRequestBody, TypedRequestQueryWithParams, 
} from '../types';
import supabase from "../utils/supabase"

export const createNewApp = async (req:TypedRequestBody<{name:string,developer_id:string}>, res:Response) => {
    const name = req.body.name
    const devID = req.body.developer_id
    // TODO - need to get companyID myself from user.
    const companyID = "0d871b21-03d6-4e75-873a-480d5ae097b9"
    const appID = await addApp(name)
    if(!appID) return res.sendStatus(500)
    const companyAppID = await addCompanyApp(companyID,appID)
    if(!companyAppID) return res.sendStatus(500)
    const developerAppID = await addDeveloperApp(appID,devID)
    if(!developerAppID) return res.sendStatus(500)
    return res.send(appID)
  }

async function addApp(name:string):Promise<string | null>{
    try{
        const { data, error } = await supabase
        .from('apps')
        .upsert({ 
            name:name
        })
        .select()
        if (error) {
            console.log(error)
            return null;
        } else {
            return data[0].id
        }
    }
    catch(err){
        console.log(err)
        return null
    }
}
async function addCompanyApp(companyID:string,appID:string):Promise<string | null>{
    try{
        const { data, error } = await supabase
        .from('company_app')
        .upsert({ 
            company_id:companyID,
            app_id:appID
        })
        .select()
        if (error) {
            console.log(error)
            return null;
        } else {
            return data[0].id
        }
    }catch(err){
        console.log(err)
        return null
    }    
}
async function addDeveloperApp(appID:string,devID:string):Promise<string | null>{
    try{
        const { data, error } = await supabase
        .from('developer_app')
        .upsert({ 
            developer_id:devID,
            app_id:appID
        })
        .select()
        if (error) {
            console.log(error)
            return null;
        } else {
            return data[0].id
        }
    }catch(err){
        console.log(err)
        return null
    }    
}


export const deleteAppByID = async (req:TypedRequestQueryWithParams<{app_id:string}>, res:Response) => {
    const appID = req.params.app_id
    const deletedChannelApp = await removeChannelApp(appID)
    if (!deletedChannelApp) return res.sendStatus(500)
    const deletedCompanyApp = await removeCompanyApp(appID)
    if (!deletedCompanyApp) return res.sendStatus(500)
    const deletedDeveloperApp = await removeDeveloperApp(appID)
    if (!deletedDeveloperApp) return res.sendStatus(500)
    const deletedApp = await removeApp(appID)
    if (!deletedApp) return res.sendStatus(500)
    return res.send(deletedApp)
}

const removeApp = async function(appID:string) {
    const {error,data} = await supabase
        .from('apps')
        .delete()
        .eq('id', appID)
        .select()
    if (error){
        console.log(error)
        return null
    }else {
        console.log({data})
        return data
    }
}
const removeChannelApp = async function(appID:string) {
    const {error,data} = await supabase
        .from('channel_app')
        .delete()
        .eq('app_id', appID)
        .select()
    if (error){
        console.log(error)
        return null
    }else {
        console.log({data})
        return data
    }
}
const removeCompanyApp = async function(appID:string) {
    const {error,data} = await supabase
        .from('company_app')
        .delete()
        .eq('app_id', appID)
        .select()
    if (error){
        console.log(error)
        return null
    }else {
        console.log({data})
        return data
    }
}
const removeDeveloperApp = async function(appID:string) {
    const {error,data} = await supabase
        .from('developer_app')
        .delete()
        .eq('app_id', appID)
        .select()
    if (error){
        console.log(error)
        return null
    }else {
        console.log({data})
        return data
    }
}

