import express, {Application,Request,Response} from "express";
import dotenv from "dotenv"
import dbConnect from "./config/db";
import cors from 'cors';
import authRoutes from './routes/auth';
import noteRouter from './routes/noteRoutes'


dotenv.config()
const app:Application = express();
const PORT=3000

app.get('/',(req:Request,res:Response)=>{
   res.send("Hello from home");
})
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRoutes);
app.use('/note',noteRouter);


dbConnect()
app.listen(PORT,()=>{
   console.log("Listning on port 3000")
})