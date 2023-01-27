import { Response } from "express"
import supabase from "../utils/supabase"
import { TypedRequestBody, TypedRequestQuery } from "../types"

export const createUser = async function (req: TypedRequestBody<{username: string}>, res: Response) {
    const { data, error } = await supabase
        .from('users')
        .upsert({ 
        username: req.body.username,
        created_at: ((new Date()).toISOString()).toLocaleString()
        })
        .select()

    if (error) {
        res.send(500)
    } else {
        res.send(data[0])
    }
}

export const searchUsers =   async function (req: TypedRequestQuery<{user_id: string, q: string}>, res: Response) {
    const { data, error } = await supabase
      .from('users')
      .select()
    //   .like('username', `%${req.query.q}%`)
      .neq('id', req.query.user_id)
      .limit(50)
  
    if (error) {
        res.send(500)
    } else {
        res.send(data)
    }
}