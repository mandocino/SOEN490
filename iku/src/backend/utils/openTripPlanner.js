import axios from "axios";

var url = "http://localhost:8080/otp/routers/default/plan";

var otpParameterKeys = [
    'maxPreTransitTime', 
    'maxTransfers', 
    'maxWalkDistance', 
    'minTransferTime', 
    'nonpreferredTransferPenalty', 
    'numItineraries', 
    'optimize', 
    'otherThanPreferredRoutesPenalty', 
    'preferredAgencies',
    'preferredRoutes',
    'reverseOptimizeOnTheFly',
    'showIntermediateStops',
    'startTransitStopId',
    'startTransitTripId',
    'transferPenalty',
    'triangleSafetyFactor',
    'triangleSlopeFactor',
    'triangleTimeFactor',
    'unpreferredAgencies',
    'unpreferredRoutes',
    'waitAtBeginningFactor',
    'waitReluctance',
    'walkBoardCost',
    'walkReluctance',
    'walkSpeed'
];

function validateOptionalParams(optionalParams){
    for(let key in optionalParams){

        // Remove invalid OTP params
        if(!otpParameterKeys.includes(key)){
            delete optionalParams[key];
        }
    }
};

async function handleGetAllRoutesOTP(originCoordinates, destinationCoordinates, date, time, isArriveBy, isWheelchair, mode, optionalParams){

    // Mandatory parameters for API call
    var mandatoryParams = {
        fromPlace: originCoordinates,
        toPlace: destinationCoordinates,
        date: date,
        time: time,
        arriveBy: isArriveBy,
        wheelchair: isWheelchair,
        mode: mode, //"TRANSIT,WALK" to generate transit routes
        debugItineraryFilter: "false",
        showIntermediateStops: "true",
        baseLayer: "OSM Standard Tiles",
        locale: "en"
    };

    let queryString = null;

    validateOptionalParams(optionalParams);

    // Combine mandatory and optional params
    if(optionalParams !== null){
        queryString = Object.assign(mandatoryParams, optionalParams);
    }
    else{
        queryString = mandatoryParams;
    }


    //Make API call to OTP
    await axios.get(url, {params: queryString})
    .then((response) => {
        console.log(JSON.stringify(response.data.plan.itineraries));
        return response.data.plan.itineraries;
    })
    .catch(error => {
        console.log(error);
        return {};
    })
    
}

//TODO: REMOVE THIS WHEN IKU-110 AND IKU-111 ARE COMPLETED
//METHOD CALLED IN FRONTEND FOR TESTING PURPOSES
export const getAllRoutesOTP = (req, res) => {
    console.log("INSIDE GETALLROUTESOTP BACKEND");
    var optionalParams = {
        waitReluctance: 5,
        walkReluctance: 5, 
        transferPenalty: 5,
        hello: 12345
    }
    handleGetAllRoutesOTP("45.50083137628949,-73.63675475120546", "45.49718414083273,-73.57888340950014", "11-25-2022", "8:00pm", false, false, "TRANSIT,WALK", optionalParams);
    res.json({"hello":"world"});
}