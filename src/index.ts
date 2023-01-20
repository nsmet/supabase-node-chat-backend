import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { randomUUID } from "crypto";
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_PROJECT_URL as string, process.env.SUPABASE_PUBLIC_ANON as string);
const app = express();

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
 
export interface TypedRequestBody<T> extends Express.Request {
  body: T
}

app.get("/", function (req, res) {
  res.send("Hello World");
});
 
// CREATE A NEW USER
app.post("/create-user", async function (req: TypedRequestBody<{username: string}>, res: Response) {
  const { data, error } = await supabase
    .from('users')
    .upsert({ 
      id: randomUUID(),
      username: req.body.username,
      created_at: new Date().toLocaleString()
     })
    .select()

    if (error) {
      res.send(500)
    } else {
      res.send(data[0])
    }
  
});
app.listen(3000);