import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config();

const mongoURI = process.env.MONGO_URI

mongoose.set('strictQuery', false)
const connectToMongo = ()=>{
    console.log("connection Building with DB");
    mongoose.set('strictQuery', false)
    mongoose.connect(mongoURI,()=>{
        console.log("Connected to mongo successfully");
    });
}

export default connectToMongo;

