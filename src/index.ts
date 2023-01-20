import express from "express";
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_PROJECT_URL as string, process.env.SUPABASE_PUBLIC_ANON as string);
const app = express();
 
app.get("/", function (req, res) {
  res.send("Hello World");
});
 
app.listen(3000);