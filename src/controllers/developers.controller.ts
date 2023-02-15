import { Response } from "express"
import supabase from "../utils/supabase"
import { TypedRequestBody } from "../types"

export const createDeveloper = async function (req: TypedRequestBody<{username: string}>, res: Response) {
    const username = req.body.username
    const devID = await addDeveloper(username)
    if(!devID) return res.sendStatus(500)
    const companyID = await addCompany(username)
    if(!companyID) return res.sendStatus(500)
    const companyDeveloperID = await addCompanyDeveloper(companyID,devID)
    if(!companyDeveloperID) return res.sendStatus(500)
    return res.send(devID)
}

async function addDeveloper(username:string):Promise<string | null>{
    try{
        const { data, error } = await supabase
        .from('developers')
        .upsert({ 
            username:username
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
async function addCompany(username:string):Promise<string | null>{
    try{
        const { data, error } = await supabase
        .from('companies')
        .upsert({ 
            name:`${username} Co`
        })
        .select()
        if (error) {
            return null;
        } else {
            return data[0].id
        }
    }catch(err){
        return null
    }    
}
async function addCompanyDeveloper(companyID:string,developerID:string):Promise<string | null>{
    try{
        const { data, error } = await supabase
        .from('company_developer')
        .upsert({ 
            company_id:companyID,
            developer_owner_id:developerID
        })
        .select()
        if (error) {
            return null;
        } else {
            return data[0].id
        }
    }catch(err){
        return null
    }    
}
