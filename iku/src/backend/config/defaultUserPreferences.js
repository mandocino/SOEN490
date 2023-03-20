export const defaultUserFactorWeights = {
  frequencyWeight: 70,
  durationWeight: 30,
};

export const defaultUserNightDayWeights = {
  weeknightWeight: 30,
  fridayNightWeight: 35,
  saturdayNightWeight: 35
};

export const defaultUserNightDirectionWeights = {
  toDestWeight: 30,
  fromDestWeight: 70
};

export const defaultUserWeekendWeights = {
  saturdayWeight: 60,
  sundayWeight: 40
};

export const defaultUserTimeSliceWeights = {
  rushHourWeight: 40,
  offPeakWeight: 30,
  nightWeight: 10,
  weekendWeight: 20
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

export const convertUserFactorWeightsToArr = (weights) => {
  return [
    weights.frequencyWeight,
    weights.durationWeight
  ]
}

export const convertUserNightDayWeightsToArr = (weights) => {
  return [
    weights.weeknightWeight,
    weights.fridayNightWeight,
    weights.saturdayNightWeight
  ]
}

export const convertUserNightDirectionWeightsToArr = (weights) => {
  return [
    weights.toDestWeight,
    weights.fromDestWeight
  ]
}

export const convertUserWeekendWeightsToArr = (weights) => {
  return [
    weights.saturdayWeight,
    weights.sundayWeight
  ]
}

export const convertUserTimeSliceWeightsToArr = (weights) => {
  return [
    weights.rushHourWeight,
    weights.offPeakWeight,
    weights.nightWeight,
    weights.weekendWeight
  ]
}

export const checkIfWeightsAddTo100 = (weights) => {
  const sum = weights.reduce((x,y)=>{return x+y});
  return sum === 100;
}
