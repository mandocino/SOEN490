import axios from "axios";

var url = "http://localhost:8080/otp/routers/default/plan";

async function handleGetAllRoutesOTP(originCoordinates, destinationCoordinates, date, time, isArriveBy, isWheelchair, waitReluctance, walkReluctance, transferPenalty){

    // Mandatory parameters for API call
    var queryString = {
        fromPlace: originCoordinates,
        toPlace: destinationCoordinates,
        date: date,
        time: time,
        arriveBy: isArriveBy,
        wheelchair: isWheelchair,
        mode: "TRANSIT,WALK",
        debugItineraryFilter: "false",
        showIntermediateStops: "true",
        baseLayer: "OSM Standard Tiles",
        locale: "en"
    };

    // Optional parameters
    if(waitReluctance !== null || waitReluctance !== 0){
        queryString.waitReluctance = waitReluctance;
    }

    if(walkReluctance !== null || walkReluctance !== 0){
        queryString.walkReluctance = walkReluctance;
    }

    if(transferPenalty !== null || transferPenalty !== 0){
        queryString.transferPenalty = transferPenalty;
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

//METHOD CALLED IN FRONTEND FOR TESTING PURPOSES
export const getAllRoutesOTP = (req, res) => {
    console.log("INSIDE GETALLROUTESOTP BACKEND");
    handleGetAllRoutesOTP("45.50083137628949,-73.63675475120546", "45.49718414083273,-73.57888340950014", "11-25-2022", "8:00pm", false, false);
    res.json({"hello":"world"});
}