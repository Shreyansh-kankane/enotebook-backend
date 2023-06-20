import connectToMongo from './db.js';
import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 5000;

const app=express();
app.use(cors());
app.use(express.json());

connectToMongo();

import authRoutes from './routes/auth.js';
import notesRoutes from './routes/notes.js';

app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);

const __mydirname = path.resolve();
// console.log("MY dirname is", __mydirname)
// console.log(process.env.NODE_ENV);
// console.log(process.env.PORT);

if(process.env.NODE_ENV === 'production'){
        app.get("/",(req,res)=>{
        res.send("I am running");
    })
}

app.listen(port,()=>{
    console.log(`Server is running in :${process.env.NODE_ENV} mode on port ${port}`)
});
