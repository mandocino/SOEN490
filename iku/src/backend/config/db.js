import { Schema, model, connect, Mongoose } from "mongoose";

const connectionString = "mongodb+srv://SOEN490:SOEN490@cluster0.hqfslb0.mongodb.net/?retryWrites=true&w=majority";

const userSchema = new Schema({
    ID: Number,
    FullName: String
}, { collection : 'Users' });

const userDBModel = model("User", userSchema);

export default userDBModel;

export function connectToServer(){
    connect(connectionString, {dbName: "Iku"});
}
