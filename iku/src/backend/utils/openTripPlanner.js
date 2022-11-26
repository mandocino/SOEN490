export const sliceRoutesList = (routes, startTime, endTime, mode) =>{
    var list = [];
    switch (mode){
        case "END_MODE":
            for(let i=0; i<routes.length;i++){
                if(isInRange(routes[i].endTime,startTime,endTime)){ //verification if end time is in specific range
                    list.push(routes[i]);
                }
            }
            return list; 
        case "START_MODE":
            for(let i=0; i<routes.length;i++){
                if(isInRange(routes[i].startTime,startTime,endTime)){ //verificatiopn if start time is in specific range
                    list.push(routes[i]);
                }
            }
            return list; 
        case "WHOLE_ROUTE_MODE":
            for(let i=0; i<routes.length;i++){
                if(isInRange(routes[i].endTime,startTime,endTime) && 
                isInRange(routes[i].startTime,startTime,endTime)){ //verification if both start and end time are in specific range
                    list.push(routes[i]);
                }
            }
            return list; 
    }
    
};

/**
 * Function that verifies if input time is in the specific start and end time range
 * @param {} time 
 * @param {*} startTime 
 * @param {*} endTime 
 * @returns 
 */
const isInRange = (time, startTime, endTime) =>{
    if(time >= startTime && time <= endTime){
        return true;
    }
    return false;
};