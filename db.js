import mongoose from 'mongoose'

const mongoURI = "mongodb+srv://gopal:gopal420@cluster0.lwnmdxo.mongodb.net/test"

mongoose.set('strictQuery', false)
const connectToMongo = ()=>{
    console.log("connection Building with DB");
    mongoose.set('strictQuery', false)
    mongoose.connect(mongoURI,()=>{
        console.log("Connected to mongo successfully");
    });
}

export default connectToMongo;

