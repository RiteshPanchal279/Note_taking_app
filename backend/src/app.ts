import express, {Application,Request,Response} from "express";
import dotenv from "dotenv"
import dbConnect from "./config/db";


dotenv.config()
const app:Application = express();
const PORT=3000

app.get('/',(req:Request,res:Response)=>{
   res.send("Hello home");
})

dbConnect()
app.listen(PORT,()=>{
   console.log("Listning on port 3000")
})