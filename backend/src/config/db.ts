import mongoose from "mongoose";

const dbConnect =async ()=>{
   try {
      const url = process.env.MONGO_URL!;
      await mongoose.connect(url);
      console.log("Database connection succesfull")
   } catch (e) {
      console.log("DB connection error ",e)
   }
}

export default dbConnect;