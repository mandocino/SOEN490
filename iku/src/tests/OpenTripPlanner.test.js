import '@testing-library/jest-dom';
import  { sliceRoutesList } from '../backend/utils/openTripPlanner.js';



describe("OTP List Route Parsing Functions Test (with start time, end time and a 'mode')",() => {

    const testingListRoute = 
        [
           {
               "duration":4590,
              "startTime":1669340579000,    
              "endTime":1669345169000,     
              "walkTime":1163,    
              "transitTime":2376,     
              "waitingTime":1051,    
              "walkDistance":1141.48,     
              "walkLimitExceeded":false,     
              "generalizedCost":7224,     
              "elevationLost":0.0,     
              "elevationGained":0.0,     
              "transfers":2,    
              "fare":{     
                 "fare":{
                    "regular":{
                       "cents":350,
                       "currency":{
                          "currency":"CAD",
                          "defaultFractionDigits":2,
                          "currencyCode":"CAD",
                          "symbol":"CA$"     
                       }    
                    }     
                 },
                 "details":{
                    "regular":[
                       {
                          "fareId":"1:13S_REG",
                          "price":{
                             "cents":350,
                             "currency":{
                                "currency":"CAD",
                                "defaultFractionDigits":2,
                                "currencyCode":"CAD",
                                "symbol":"CA$"
                             }
                          },
                          "routes":[
                             "1:191",
                             "1:2",
                             "1:174"
                          ]
                       }
                    ]
                 }
              },
              "tooSloped":false,
              "arrivedAtDestinationWithRentedBicycle":false
           },
           {
              "duration":5180,
              "startTime":1669341341000,
              "endTime":1669346521000,
              "walkTime":2240,
              "transitTime":2733,
              "waitingTime":207,
              "walkDistance":2748.99,
              "walkLimitExceeded":false,
              "generalizedCost":8371,
              "elevationLost":0.0,
              "elevationGained":0.0,
              "transfers":1,
              "fare":{
                 "fare":{
                    "regular":{
                       "cents":350,
                       "currency":{
                          "currency":"CAD",
                          "defaultFractionDigits":2,
                          "currencyCode":"CAD",
                          "symbol":"CA$"
                       }
                    }
                 },
                 "details":{
                    "regular":[
                       {
                          "fareId":"1:13S_REG",
                          "price":{
                             "cents":350,
                             "currency":{
                                "currency":"CAD",
                                "defaultFractionDigits":2,
                                "currencyCode":"CAD",
                                "symbol":"CA$"
                             }
                          },
                          "routes":[
                             "1:191",
                             "1:202"
                          ]
                       }
                    ]
                 }
              },
              "tooSloped":false,
              "arrivedAtDestinationWithRentedBicycle":false
           }
        ]
    
     test("Get List of routes that fit specifications: Testing END 'mode'", () => {

        //first route startTime dont fit but endTime does.
        //second route startTime fit but endTime dont
        const routeList1 = sliceRoutesList(testingListRoute, 1669341340000, 1669345169000, "END_MODE");

        //only first route expected
        expect(routeList1).toHaveLength(1);
        expect(routeList1[0].duration).toBe(4590); //duration of first route

        //first route startTime and endTime fit.
        //second route startTime and endTime fit.
        const routeList2 = sliceRoutesList(testingListRoute, 1669340578000, 1669346521001, "END_MODE");

        //both routes expected
        expect(routeList2).toHaveLength(2);
        expect(routeList2[0].duration).toBe(4590); //duration of first route
        expect(routeList2[1].duration).toBe(5180); //duration of second route

        //first route startTime and endTime dont fit.
        //second route startTime and endTime dont fit.
        const routeList3 = sliceRoutesList(testingListRoute, 1669341341300, 1669345168000, "END_MODE");

        //empty list expected
        expect(routeList3).toHaveLength(0);
     });

     test("Get List of routes that fit specifications: Testing START 'mode'", () => {

        //first route startTime dont fit but endTime does.
        //second route startTime fit but endTime dont
        const routeList1 = sliceRoutesList(testingListRoute, 1669341340000, 1669345169000, "START_MODE");

        //only second route expected
        expect(routeList1).toHaveLength(1);
        expect(routeList1[0].duration).toBe(5180); //duration of second route

        //first route startTime and endTime fit.
        //second route startTime and endTime fit.
        const routeList2 = sliceRoutesList(testingListRoute, 1669340578000, 1669346521001, "START_MODE");

        //both routes expected
        expect(routeList2).toHaveLength(2);
        expect(routeList2[0].duration).toBe(4590); //duration of first route
        expect(routeList2[1].duration).toBe(5180); //duration of second route

        //first route startTime and endTime dont fit.
        //second route startTime and endTime dont fit.
        const routeList3 = sliceRoutesList(testingListRoute, 1669341341300, 1669345168000, "START_MODE");

        //empty list expected
        expect(routeList3).toHaveLength(0);
     });

     test("Get List of routes that fit specifications: Testing WHOLE ROUTE'mode'", () => {

        //first route startTime and endTime fit.
        //second route startTime and endTime dont fit.
        const routeList1 = sliceRoutesList(testingListRoute, 1669340578000, 1669345169300, "WHOLE_ROUTE_MODE");

        //first route expected
        expect(routeList1).toHaveLength(1);
        expect(routeList1[0].duration).toBe(4590); //duration of first route

        //first route startTime and endTime fit.
        //second route startTime and endTime fit.
        const routeList2 = sliceRoutesList(testingListRoute, 1669340578000, 1669346521300, "WHOLE_ROUTE_MODE");

        //both routes expected
        expect(routeList2).toHaveLength(2);
        expect(routeList2[0].duration).toBe(4590); //duration of first route
        expect(routeList2[1].duration).toBe(5180); //duration of second route

        //first route startTime and endTime dont fit.
        //second route startTime and endTime dont fit.
        const routeList3 = sliceRoutesList(testingListRoute, 0, 0, "WHOLE_ROUTE_MODE");

        //empty list expected
        expect(routeList3).toHaveLength(0);
     });
});