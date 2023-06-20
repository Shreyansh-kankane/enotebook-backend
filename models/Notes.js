import mongoose, { Schema as _Schema, model } from 'mongoose';
const { Schema } = mongoose;
const NotesSchema = new Schema({
    user:{
        type: _Schema.Types.ObjectId,
        ref: 'user'
    },
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true,
    },
    tag:{
        type: String,
        default: "General"
    },
    date:{
        type: Date,
        default: Date.now
    }
});

export default model('notes',NotesSchema)