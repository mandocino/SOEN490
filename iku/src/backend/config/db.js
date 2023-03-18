import { Schema, model, connect } from "mongoose";

const connectionString =
  "mongodb+srv://SOEN490:SOEN490@cluster0.hqfslb0.mongodb.net/?retryWrites=true&w=majority";


///////////// DEFAULTS

export const defaultUserFactorWeights = {
  frequencyWeight: 0.7,
  durationWeight: 0.3,
};

export const defaultUserNightDayWeights = {
  weeknightWeight: 0.3,
  fridayNightWeight: 0.35,
  saturdayNightWeight: 0.35
};

export const defaultUserNightDirectionWeights = {
  toDestWeight: 0.3,
  fromDestWeight: 0.7
};

export const defaultUserWeekendWeights = {
  saturdayWeight: 0.6,
  sundayWeight: 0.4
};

export const defaultUserScoringWeights = {
  rushHourWeight: 0.4,
  offPeakWeight: 0.3,
  nightWeight: 0.1,
  weekendWeight: 0.2
}

export const defaultUserScoringPreferences = {
  consistencyImportance: 2,
  worstAcceptableFrequency: 75,
  worstAcceptableDuration: 120,
  worstAcceptableWalk: 60
}

export const defaultUserRoutingPreferences = {
  walkReluctance: 2,
  isWheelChair: false
}

///////////// SCHEMAS

const globalSchema = new Schema(
  {
    lastAlgoUpdateTime: { type: Schema.Types.Date, required: true },
    lastRoutingUpdateTime: { type: Schema.Types.Date, required: true }
  },
  { collection: "Global" }
);

const userSchema = new Schema(
  {
    first_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    last_name: { type: String, required: true },
    password: { type: String, required: true },
    current_location: { type: String, default: "" },
    factorWeights: { type: Object, default: defaultUserFactorWeights },
    nightDayWeights: { type: Object, default: defaultUserNightDayWeights },
    nightDirectionWeights: { type: Object, default: defaultUserNightDirectionWeights },
    weekendWeights: { type: Object, default: defaultUserWeekendWeights },
    scoringWeights: { type: Object, default: defaultUserScoringWeights },
    routingPreferences: { type: Object, default: defaultUserRoutingPreferences },
    lastPrefChangeTime: { type: Schema.Types.Date, required: true },
  },
  { collection: "Users" }
);

const locationSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    name: { type: String, required: true },
    notes: { type: String, default: "None" },
    origin: { type: Boolean, required: true },
    priority: { type: Number, default: 0 },
    current_home: { type: Boolean, required: true },
    arrive_time: { type: String, default: "None" },
    depart_time: { type: String, default: "None" },
  },
  { collection: "Locations" }
);

const savedScoreSchema = new Schema({
  origin: { type: Schema.Types.ObjectId, required: true },
  destination: { type: Schema.Types.ObjectId },
  generatedTime: { type: Schema.Types.Date, required: true },
  overall: { type: Number, required: true },
  rushHour: { type: Number, required: true },
  offPeak: { type: Number, required: true },
  weekend: { type: Number, required: true },
  overnight: { type: Number, required: true }
}, { collection : 'SavedScores' });

const savedRoutingDataSchema = new Schema({
  origin: { type: Schema.Types.ObjectId, required: true },
  destination: { type: Schema.Types.ObjectId, required: true },
  generatedTime: { type: Schema.Types.Date, required: true },
  routingData: { type: Object, required: true }
}, { collection : 'SavedRoutingData' });

const emailConfirmationSchema = new Schema({
  email: { type: String, required: true },
  code: { type: String, required: true }
}, { collection : 'EmailConfirmations' });

const passwordResetRequestSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, required: true },
    code: { type: String, required: true },
  },
  { collection: "PasswordResetRequests" }
);

export const globalDBModel = model("Global", globalSchema);
export const userDBModel = model("User", userSchema);
export const locationDBModel = model("Location", locationSchema);
export const savedScoreDBModel = model("SavedScore", savedScoreSchema);
export const savedRoutesDBModel = model("SavedRoutingData", savedRoutingDataSchema);
export const emailConfirmationDBModel = model("EmailConfirmation", emailConfirmationSchema);
export const passwordResetRequestDBModel = model("PasswordResetRequest", passwordResetRequestSchema);

export function connectToServer() {
  connect(connectionString, { dbName: "Iku" });
}
