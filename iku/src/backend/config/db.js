import { Schema, model, connect, Mongoose } from "mongoose";

const connectionString = "mongodb+srv://SOEN490:SOEN490@cluster0.hqfslb0.mongodb.net/?retryWrites=true&w=majority";

const userSchema = new Schema({
    id: Number,
    first_name: String,
    duration_priority: Number,
    email: String,
    frequency_priority: Number,
    last_name: String,
    password: String,
    username: String,
    walk_priority: Number
}, { collection : 'Users' });

const locationSchema = new Schema({
    id: Number,
    user_id: Number,
    latitude: Number,
    longitude: Number,
    name: String,
    notes: String,
    origin: Boolean,
    priority: Number,
    current_home: Boolean,
    arrive_time: String,
    depart_time: String
}, { collection : 'Locations' });

export const userDBModel = model("User", userSchema);
export const locationDBModel = model("Location", locationSchema);

export function connectToServer(){
    connect(connectionString, {dbName: "Iku"});
}
