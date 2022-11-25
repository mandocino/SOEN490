
import request from "request";
import axios from "axios";

var url = "http://localhost:8080/otp/routers/default/plan";

async function handleGetAllRoutesOTP(origin, destination){


    var queryString = {
        date: "11-24-2022",
        mode: "TRANSIT,WALK",
        arriveBy: "false",
        wheelchair: "false",
        debugItineraryFilter: "false",
        showIntermediateStops: "true",
        fromPlace: "45.43761055339032,-73.65114212036134",
        baseLayer: "OSM Standard Tiles",
        toPlace: "45.48408598634595,-73.71894836425783",
        time: "8:26pm",
        locale: "en"
    }

    //USING REQUEST MODULE(DEPRECATED)
    // request.get(url, {qs:queryString}, function(error, response, body){

    //     // console.log(response);
    //     console.log("--------------------------------------------------------------------------");
    //     console.log(body);
    //     return body;
    // });

    //USING AXIOS
    const res = await axios.get(url, {params: queryString})
    console.log(res.data.plan.itineraries);
}

//METHOD CALLED IN FRONTEND FOR TESTING PURPOSES
export const getAllRoutesOTP = (req, res) => {
    console.log("INSIDE GETALLROUTESOTP BACKEND");
    handleGetAllRoutesOTP(1,2);
    res.json({"hello":"world"});
}