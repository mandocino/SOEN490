import { Schema, model, connect } from "mongoose";

const connectionString = "mongodb+srv://SOEN490:SOEN490@cluster0.hqfslb0.mongodb.net/?retryWrites=true&w=majority";

const userSchema = new Schema({
    first_name: { type: String, required: true},
    email: { type: String, required: true, unique: true},
    last_name: { type: String, required: true},
    password: { type: String, required: true},
    duration_priority: { type: Number, default: 0},
    frequency_priority: { type: Number, default: 0},
    walk_priority: { type: Number, default: 0}
}, { collection : 'Users' });

const locationSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, required: true},
    latitude: { type: Number, required: true},
    longitude: { type: Number, required: true},
    name: { type: String, required: true},
    notes: { type: String, default: "None"},
    origin: { type: Boolean, required: true},
    priority: { type: Number, default: 0},
    current_home: { type: Boolean, required: true},
    arrive_time: { type: String, default: "None"},
    depart_time: { type: String, default: "None"}
}, { collection : 'Locations' });

const emailConfirmationSchema = new Schema({
    email: { type: String, required: true},
    code: { type: String, required: true}
}, { collection : 'EmailConfirmations' });

const passwordResetRequestSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, required: true},
    code: { type: String, required: true}
}, { collection : 'PasswordResetRequests' });

export const userDBModel = model("User", userSchema);
export const locationDBModel = model("Location", locationSchema);
export const emailConfirmationDBModel = model("EmailConfirmation", emailConfirmationSchema);
export const passwordResetRequestDBModel = model("PasswordResetRequest", passwordResetRequestSchema);

export function connectToServer(){
    connect(connectionString, {dbName: "Iku"});
}
