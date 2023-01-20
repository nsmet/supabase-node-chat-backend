import express, { Request, Response } from "express";
import bodyParser from "body-parser";
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
 
app.post("/create-user", async function (req: TypedRequestBody<{username: string}>, res: Response) {
  // CREATE A NEW USER
  console.log(req.body);
  
});
app.listen(3000);