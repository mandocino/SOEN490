import '@testing-library/jest-dom';
import { validateOptionalParams, getWalkWaitComponents,getDurationMetrics, sliceRoutesList } from "../backend/utils/openTripPlanner";

describe("OpenTripPlanner tests", () => {

    // Test to check if valid parameters are returned
    test("Optional parameters validation (all valid params)", () => {
        const params = {
            maxPreTransitTime: 5, 
            maxTransfers:5, 
            maxWalkDistance:5, 
            minTransferTime:5, 
            nonpreferredTransferPenalty:1, 
            numItineraries:10, 
            optimize: "FLAT", 
            otherThanPreferredRoutesPenalty:5, 
            preferredAgencies: null,
            preferredRoutes: null,
            reverseOptimizeOnTheFly: false,
            showIntermediateStops: true,
            startTransitStopId: null,
            startTransitTripId: null,
            transferPenalty: 4,
            triangleSafetyFactor:0.5,
            triangleSlopeFactor:0.5,
            triangleTimeFactor:0.5,
            unpreferredAgencies: null,
            unpreferredRoutes:null,
            waitAtBeginningFactor:5,
            waitReluctance:5,
            walkBoardCost:5,
            walkReluctance:5,
            walkSpeed:5
        };
        validateOptionalParams(params);
        
        // No parameters are removed since they're all valid
        expect(Object.keys(params).length).toBe(25); 
    });

    // Test to check if valid parameters are returned and invalid ones are removed
    test("Optional parameters validation (some invalid params)", () => {
        const params = {
            maxPreTransitTime: 5, 
            maxTransfers:5, 
            maxWalkDistance:5, 
            minTransferTime:5, 
            invalidParam1: 5,
            numItineraries:10, 
            optimize: "FLAT", 
            invalidParam2: 10,
            nonpreferredTransferPenalty:1, 
            invalidParam3: 15
        };
        validateOptionalParams(params);
        
        // Some invalid parameters are removed
        expect(Object.keys(params).length).toBe(7); 
    });

    // Test to check if invalid parameters are removed
    test("Optional parameters validation (no valid params)", () => {
        const params = {
            invalidParam1: 5,
            invalidParam2: 10,
            invalidParam3: 15
        };
        validateOptionalParams(params);
        
        // All parameters are removed since they're all invalid
        expect(Object.keys(params).length).toBe(0); 
    });

    test("Calculate metrics on duration times", () => {
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
      let durationTimeMetrics = getDurationMetrics(testingListRoute);

         expect(durationTimeMetrics.minDurationTime).toBe(4590);
         expect(durationTimeMetrics.maxDurationTime).toBe(5180);
         expect(durationTimeMetrics.averageDurationTime).toBe(4885);
         expect(durationTimeMetrics.standardDeviationDurationTime).toBe(295);
  });


});


describe("OTP Route Parsing Functions Tests (Walking and Waiting Metrics)", () => {

    // Test Parsing of Waiting and Walking Components with valid route

     test("Get walking and waiting components from valid route", () => {
        const testingRoute = {
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
            "legs":[
               {
                  "startTime":1669340579000,
                  "endTime":1669341180000,
                  "departureDelay":0,
                  "arrivalDelay":0,
                  "realTime":false,
                  "distance":770.82,
                  "generalizedCost":1168,
                  "pathway":false,
                  "mode":"WALK",
                  "transitLeg":false,
                  "route":"",
                  "agencyTimeZoneOffset":-18000000,
                  "interlineWithPreviousLeg":false,
                  "from":{
                     "name":"Origin",
                     "lon":-73.6511421,
                     "lat":45.4376106,
                     "departure":1669340579000,
                     "vertexType":"NORMAL"
                  },
                  "to":{
                     "name":"Notre-Dame / Saint-Pierre",
                     "stopId":"1:56474",
                     "stopCode":"56474",
                     "lon":-73.646549,
                     "lat":45.442456,
                     "arrival":1669341180000,
                     "departure":1669341180000,
                     "vertexType":"TRANSIT"
                  },
                  "legGeometry":{
                     "points":"koitG|}o`Mu@{AWg@MYKOKSUa@GIIKOUQWGKMSKSQ[Qa@Q_@[o@]u@Ym@Q_@Ui@i@oA_@}@Ui@ISKUMWMYISCGCGQMKGGEIGEFA?}BbBQJKHQJEDSLOHOHC@GBKDIDIBMDQDE@IWGMAEGIGMO]",
                     "length":60
                  },
                  "steps":[
                     {
                        "distance":494.63,
                        "relativeDirection":"DEPART",
                        "streetName":"Rue Saint-Patrick",
                        "absoluteDirection":"NORTHEAST",
                        "stayOn":false,
                        "area":false,
                        "bogusName":false,
                        "lon":-73.6510231,
                        "lat":45.4375091,
                        "elevation":"",
                        "walkingBike":false
                     },
                     {
                        "distance":29.18,
                        "relativeDirection":"SLIGHTLY_LEFT",
                        "streetName":"link",
                        "absoluteDirection":"NORTHEAST",
                        "stayOn":false,
                        "area":false,
                        "bogusName":true,
                        "lon":-73.6461413,
                        "lat":45.4403381,
                        "elevation":"",
                        "walkingBike":false
                     },
                     {
                        "distance":85.97,
                        "relativeDirection":"LEFT",
                        "streetName":"Avenue Dollard",
                        "absoluteDirection":"NORTHWEST",
                        "stayOn":false,
                        "area":false,
                        "bogusName":false,
                        "lon":-73.6459696,
                        "lat":45.4405713,
                        "elevation":"",
                        "walkingBike":false
                     },
                     {
                        "distance":112.69,
                        "relativeDirection":"CONTINUE",
                        "streetName":"Avenue Saint-Pierre",
                        "absoluteDirection":"NORTHWEST",
                        "stayOn":false,
                        "area":false,
                        "bogusName":false,
                        "lon":-73.6465072,
                        "lat":45.4412461,
                        "elevation":"",
                        "walkingBike":false
                     },
                     {
                        "distance":48.36,
                        "relativeDirection":"RIGHT",
                        "streetName":"Rue Notre-Dame Ouest",
                        "absoluteDirection":"NORTHEAST",
                        "stayOn":false,
                        "area":false,
                        "bogusName":false,
                        "lon":-73.6470505,
                        "lat":45.4421807,
                        "elevation":"",
                        "walkingBike":false
                     }
                  ],
                  "rentedBike":false,
                  "walkingBike":false,
                  "duration":601.0
               },
               {
                  "startTime":1669341180000,
                  "endTime":1669342116000,
                  "departureDelay":0,
                  "arrivalDelay":0,
                  "realTime":false,
                  "distance":6430.61,
                  "generalizedCost":1536,
                  "pathway":false,
                  "mode":"BUS",
                  "transitLeg":true,
                  "route":"Broadway / Provost",
                  "agencyName":"Société de transport de Montréal",
                  "agencyUrl":"http://www.stm.info",
                  "agencyTimeZoneOffset":-18000000,
                  "routeColor":"009EE0",
                  "routeType":3,
                  "routeId":"1:191",
                  "routeTextColor":"000000",
                  "interlineWithPreviousLeg":false,
                  "headsign":"191-E",
                  "agencyId":"1:STM",
                  "tripId":"1:254685536",
                  "serviceDate":"2022-11-24",
                  "from":{
                     "name":"Notre-Dame / Saint-Pierre",
                     "stopId":"1:56474",
                     "stopCode":"56474",
                     "lon":-73.646549,
                     "lat":45.442456,
                     "arrival":1669341180000,
                     "departure":1669341180000,
                     "stopIndex":49,
                     "stopSequence":50,
                     "vertexType":"TRANSIT"
                  },
                  "to":{
                     "name":"Station Place-Saint-Henri / Saint-Ferdinand",
                     "stopId":"1:51987",
                     "stopCode":"51987",
                     "lon":-73.587162,
                     "lat":45.47709,
                     "arrival":1669342116000,
                     "departure":1669342116000,
                     "stopIndex":68,
                     "stopSequence":69,
                     "vertexType":"TRANSIT"
                  },
                  "intermediateStops":[
                     {
                        "name":"Notre-Dame / No 450",
                        "stopId":"1:56480",
                        "stopCode":"56480",
                        "lon":-73.643582,
                        "lat":45.444088,
                        "arrival":1669341208000,
                        "departure":1669341208000,
                        "stopIndex":50,
                        "stopSequence":51,
                        "vertexType":"TRANSIT"
                     },
                     {
                        "name":"Notre-Dame / No 1000",
                        "stopId":"1:56482",
                        "stopCode":"56482",
                        "lon":-73.64159,
                        "lat":45.445193,
                        "arrival":1669341227000,
                        "departure":1669341227000,
                        "stopIndex":51,
                        "stopSequence":52,
                        "vertexType":"TRANSIT"
                     },
                     {
                        "name":"Notre-Dame / de la Berge-du-Canal",
                        "stopId":"1:56449",
                        "stopCode":"56449",
                        "lon":-73.637434,
                        "lat":45.447503,
                        "arrival":1669341267000,
                        "departure":1669341267000,
                        "stopIndex":52,
                        "stopSequence":53,
                        "vertexType":"TRANSIT"
                     },
                     {
                        "name":"Notre-Dame / No 8000",
                        "stopId":"1:56484",
                        "stopCode":"56484",
                        "lon":-73.632425,
                        "lat":45.449367,
                        "arrival":1669341311000,
                        "departure":1669341311000,
                        "stopIndex":53,
                        "stopSequence":54,
                        "vertexType":"TRANSIT"
                     },
                     {
                        "name":"Notre-Dame / No 6450",
                        "stopId":"1:51240",
                        "stopCode":"51240",
                        "lon":-73.61587,
                        "lat":45.457901,
                        "arrival":1669341466000,
                        "departure":1669341466000,
                        "stopIndex":54,
                        "stopSequence":55,
                        "vertexType":"TRANSIT"
                     },
                     {
                        "name":"Notre-Dame / No 6300",
                        "stopId":"1:51305",
                        "stopCode":"51305",
                        "lon":-73.613709,
                        "lat":45.459097,
                        "arrival":1669341487000,
                        "departure":1669341487000,
                        "stopIndex":55,
                        "stopSequence":56,
                        "vertexType":"TRANSIT"
                     },
                     {
                        "name":"Notre-Dame / No 6200",
                        "stopId":"1:60585",
                        "stopCode":"60585",
                        "lon":-73.611756,
                        "lat":45.460179,
                        "arrival":1669341506000,
                        "departure":1669341506000,
                        "stopIndex":56,
                        "stopSequence":57,
                        "vertexType":"TRANSIT"
                     },
                     {
                        "name":"Notre-Dame / No 6000",
                        "stopId":"1:51418",
                        "stopCode":"51418",
                        "lon":-73.609589,
                        "lat":45.461372,
                        "arrival":1669341527000,
                        "departure":1669341527000,
                        "stopIndex":57,
                        "stopSequence":58,
                        "vertexType":"TRANSIT"
                     },
                     {
                        "name":"Notre-Dame / Turcot",
                        "stopId":"1:62042",
                        "stopCode":"62042",
                        "lon":-73.60826,
                        "lat":45.462066,
                        "arrival":1669341539000,
                        "departure":1669341539000,
                        "stopIndex":58,
                        "stopSequence":59,
                        "vertexType":"TRANSIT"
                     },
                     {
                        "name":"Notre-Dame / Place Turcot Est",
                        "stopId":"1:51601",
                        "stopCode":"51601",
                        "lon":-73.602505,
                        "lat":45.465192,
                        "arrival":1669341597000,
                        "departure":1669341597000,
                        "stopIndex":59,
                        "stopSequence":60,
                        "vertexType":"TRANSIT"
                     },
                     {
                        "name":"Notre-Dame / Monk",
                        "stopId":"1:53961",
                        "stopCode":"53961",
                        "lon":-73.600305,
                        "lat":45.466319,
                        "arrival":1669341618000,
                        "departure":1669341618000,
                        "stopIndex":60,
                        "stopSequence":61,
                        "vertexType":"TRANSIT"
                     },
                     {
                        "name":"Notre-Dame / Gadbois",
                        "stopId":"1:61640",
                        "stopCode":"61640",
                        "lon":-73.596907,
                        "lat":45.468091,
                        "arrival":1669341650000,
                        "departure":1669341650000,
                        "stopIndex":61,
                        "stopSequence":62,
                        "vertexType":"TRANSIT"
                     },
                     {
                        "name":"École James-Lyng (Notre-Dame / de Carillon)",
                        "stopId":"1:51775",
                        "stopCode":"51775",
                        "lon":-73.595791,
                        "lat":45.468471,
                        "arrival":1669341660000,
                        "departure":1669341660000,
                        "stopIndex":62,
                        "stopSequence":63,
                        "vertexType":"TRANSIT"
                     },
                     {
                        "name":"Notre-Dame / de la Côte-Saint-Paul",
                        "stopId":"1:60527",
                        "stopCode":"60527",
                        "lon":-73.5929,
                        "lat":45.469432,
                        "arrival":1669341780000,
                        "departure":1669341780000,
                        "stopIndex":63,
                        "stopSequence":64,
                        "vertexType":"TRANSIT"
                     },
                     {
                        "name":"Notre-Dame / Saint-Rémi",
                        "stopId":"1:51874",
                        "stopCode":"51874",
                        "lon":-73.591168,
                        "lat":45.470104,
                        "arrival":1669341840000,
                        "departure":1669341840000,
                        "stopIndex":64,
                        "stopSequence":65,
                        "vertexType":"TRANSIT"
                     },
                     {
                        "name":"Notre-Dame / De Courcelle",
                        "stopId":"1:51936",
                        "stopCode":"51936",
                        "lon":-73.588787,
                        "lat":45.472622,
                        "arrival":1669341924000,
                        "departure":1669341924000,
                        "stopIndex":65,
                        "stopSequence":66,
                        "vertexType":"TRANSIT"
                     },
                     {
                        "name":"Square Sir-George-Étienne-Cartier",
                        "stopId":"1:53954",
                        "stopCode":"53954",
                        "lon":-73.58743,
                        "lat":45.474126,
                        "arrival":1669341974000,
                        "departure":1669341974000,
                        "stopIndex":66,
                        "stopSequence":67,
                        "vertexType":"TRANSIT"
                     },
                     {
                        "name":"Saint-Jacques / Saint-Philippe",
                        "stopId":"1:51926",
                        "stopCode":"51926",
                        "lon":-73.588394,
                        "lat":45.476637,
                        "arrival":1669342088000,
                        "departure":1669342088000,
                        "stopIndex":67,
                        "stopSequence":68,
                        "vertexType":"TRANSIT"
                     }
                  ],
                  "legGeometry":{
                     "points":"snjtGhbo`M{HeQGM????kEmJQ_@????_HoOgDuH????iAiCcAsDCG}@mDGk@???AcDaM????m@{BI]Qq@a@uA]_Ag@uA{@uBEGkAiCQ[y@}AYg@e@aA[o@aA{BiAmC{@gCyCeJcD}HaEkJcBmCmFuM_D{G???A}EiKQa@??gDiHq@{A????oFmL??mBeEMe@???AQW??Q[CEo@}@q@q@m@i@g@a@g@UJg@?A?A@w@???AMmA?A??g@eBkIyR????]w@CGyAqDg@y@cAcC????[u@EIkBoEy@sBy@kBc@cACIu@kB????Qc@{@{D????k@kCCGq@_Dw@kDEM_@sA????gAcECGs@cCEG??ACGMKOu@m@EEaLgK????OMEEqAmAEEsAeAOOEEuAgA????QOEEo@k@y@q@EEcByAEL?J?Vo@tB]~@IVMd@aAtCM^YXIBk@iB????_@qACIw@yC",
                     "length":158
                  },
                  "steps":[

                  ],
                  "routeShortName":"191",
                  "routeLongName":"Broadway / Provost",
                  "duration":936.0
               },
               {
                  "startTime":1669342116000,
                  "endTime":1669342283000,
                  "departureDelay":0,
                  "arrivalDelay":0,
                  "realTime":false,
                  "distance":51.64,
                  "generalizedCost":204,
                  "pathway":false,
                  "mode":"WALK",
                  "transitLeg":false,
                  "route":"",
                  "agencyTimeZoneOffset":-18000000,
                  "interlineWithPreviousLeg":false,
                  "from":{
                     "name":"Station Place-Saint-Henri / Saint-Ferdinand",
                     "stopId":"1:51987",
                     "stopCode":"51987",
                     "lon":-73.587162,
                     "lat":45.47709,
                     "arrival":1669342116000,
                     "departure":1669342116000,
                     "vertexType":"TRANSIT"
                  },
                  "to":{
                     "name":"Station Place-Saint-Henri",
                     "stopId":"1:46",
                     "stopCode":"10244",
                     "lon":-73.586629,
                     "lat":45.47732,
                     "arrival":1669342283000,
                     "departure":1669342560000,
                     "vertexType":"TRANSIT"
                  },
                  "legGeometry":{
                     "points":"yfqtGxnc`MGECHCSCSI[Mk@A?",
                     "length":8
                  },
                  "steps":[
                     {
                        "distance":4.55,
                        "relativeDirection":"DEPART",
                        "streetName":"path",
                        "absoluteDirection":"NORTHWEST",
                        "stayOn":false,
                        "area":false,
                        "bogusName":true,
                        "lon":-73.5871305,
                        "lat":45.4771328,
                        "elevation":"",
                        "walkingBike":false
                     },
                     {
                        "distance":47.09,
                        "relativeDirection":"HARD_RIGHT",
                        "streetName":"Rue Saint-Jacques",
                        "absoluteDirection":"EAST",
                        "stayOn":false,
                        "area":false,
                        "bogusName":false,
                        "lon":-73.5871824,
                        "lat":45.4771516,
                        "elevation":"",
                        "walkingBike":false
                     }
                  ],
                  "rentedBike":false,
                  "walkingBike":false,
                  "duration":167.0
               },
               {
                  "startTime":1669342560000,
                  "endTime":1669343460000,
                  "departureDelay":0,
                  "arrivalDelay":0,
                  "realTime":false,
                  "distance":9348.24,
                  "generalizedCost":1777,
                  "pathway":false,
                  "mode":"SUBWAY",
                  "transitLeg":true,
                  "route":"Orange",
                  "agencyName":"Société de transport de Montréal",
                  "agencyUrl":"http://www.stm.info",
                  "agencyTimeZoneOffset":-18000000,
                  "routeColor":"D95700",
                  "routeType":1,
                  "routeId":"1:2",
                  "routeTextColor":"000000",
                  "interlineWithPreviousLeg":false,
                  "headsign":"STATION CÔTE-VERTU",
                  "agencyId":"1:STM",
                  "tripId":"1:254187201",
                  "serviceDate":"2022-11-24",
                  "from":{
                     "name":"Station Place-Saint-Henri",
                     "stopId":"1:46",
                     "stopCode":"10244",
                     "lon":-73.586629,
                     "lat":45.47732,
                     "arrival":1669342283000,
                     "departure":1669342560000,
                     "stopIndex":21,
                     "stopSequence":22,
                     "vertexType":"TRANSIT"
                  },
                  "to":{
                     "name":"Station Côte-Vertu",
                     "stopId":"1:65",
                     "stopCode":"10222",
                     "lon":-73.682757,
                     "lat":45.514237,
                     "arrival":1669343460000,
                     "departure":1669343460000,
                     "stopIndex":30,
                     "stopSequence":31,
                     "vertexType":"TRANSIT"
                  },
                  "intermediateStops":[
                     {
                        "name":"Station Vendôme",
                        "stopId":"1:47",
                        "stopCode":"10242",
                        "lon":-73.603706,
                        "lat":45.474101,
                        "arrival":1669342680000,
                        "departure":1669342680000,
                        "stopIndex":22,
                        "stopSequence":23,
                        "vertexType":"TRANSIT"
                     },
                     {
                        "name":"Station Villa-Maria",
                        "stopId":"1:48",
                        "stopCode":"10238",
                        "lon":-73.619821,
                        "lat":45.479709,
                        "arrival":1669342800000,
                        "departure":1669342800000,
                        "stopIndex":23,
                        "stopSequence":24,
                        "vertexType":"TRANSIT"
                     },
                     {
                        "name":"Station Snowdon 2",
                        "stopId":"1:9999492",
                        "stopCode":"10236",
                        "lon":-73.62773,
                        "lat":45.485433,
                        "arrival":1669342920000,
                        "departure":1669342920000,
                        "stopIndex":24,
                        "stopSequence":25,
                        "vertexType":"TRANSIT"
                     },
                     {
                        "name":"Station Côte-Sainte-Catherine",
                        "stopId":"1:50",
                        "stopCode":"10234",
                        "lon":-73.6331,
                        "lat":45.492356,
                        "arrival":1669342980000,
                        "departure":1669342980000,
                        "stopIndex":25,
                        "stopSequence":26,
                        "vertexType":"TRANSIT"
                     },
                     {
                        "name":"Station Plamondon",
                        "stopId":"1:51",
                        "stopCode":"10232",
                        "lon":-73.63826,
                        "lat":45.494644,
                        "arrival":1669343040000,
                        "departure":1669343040000,
                        "stopIndex":26,
                        "stopSequence":27,
                        "vertexType":"TRANSIT"
                     },
                     {
                        "name":"Station Namur",
                        "stopId":"1:52",
                        "stopCode":"10230",
                        "lon":-73.652828,
                        "lat":45.494643,
                        "arrival":1669343160000,
                        "departure":1669343160000,
                        "stopIndex":27,
                        "stopSequence":28,
                        "vertexType":"TRANSIT"
                     },
                     {
                        "name":"Station De la Savane",
                        "stopId":"1:53",
                        "stopCode":"10228",
                        "lon":-73.661538,
                        "lat":45.500051,
                        "arrival":1669343220000,
                        "departure":1669343220000,
                        "stopIndex":28,
                        "stopSequence":29,
                        "vertexType":"TRANSIT"
                     },
                     {
                        "name":"Station Du Collège",
                        "stopId":"1:54",
                        "stopCode":"10224",
                        "lon":-73.674796,
                        "lat":45.509258,
                        "arrival":1669343340000,
                        "departure":1669343340000,
                        "stopIndex":29,
                        "stopSequence":30,
                        "vertexType":"TRANSIT"
                     }
                  ],
                  "legGeometry":{
                     "points":"ghqtGlkc`MbSviB??_b@vcB??yb@jp@??gj@p`@??iMf_@???`zA??y`@lu@??ox@zqA??c^vp@",
                     "length":18
                  },
                  "steps":[

                  ],
                  "routeShortName":"2",
                  "routeLongName":"Orange",
                  "duration":900.0
               },
               {
                  "startTime":1669343460000,
                  "endTime":1669343646000,
                  "departureDelay":0,
                  "arrivalDelay":0,
                  "realTime":false,
                  "distance":67.82,
                  "generalizedCost":233,
                  "pathway":false,
                  "mode":"WALK",
                  "transitLeg":false,
                  "route":"",
                  "agencyTimeZoneOffset":-18000000,
                  "interlineWithPreviousLeg":false,
                  "from":{
                     "name":"Station Côte-Vertu",
                     "stopId":"1:65",
                     "stopCode":"10222",
                     "lon":-73.682757,
                     "lat":45.514237,
                     "arrival":1669343460000,
                     "departure":1669343460000,
                     "vertexType":"TRANSIT"
                  },
                  "to":{
                     "name":"Station Côte-Vertu",
                     "stopId":"1:60289",
                     "stopCode":"60289",
                     "lon":-73.683295,
                     "lat":45.514417,
                     "arrival":1669343646000,
                     "departure":1669344420000,
                     "vertexType":"TRANSIT"
                  },
                  "legGeometry":{
                     "points":"}nxtGfdv`MEGGLGJLPHL@@C?A?A@ABGHKTABCDADA@AB",
                     "length":18
                  },
                  "steps":[
                     {
                        "distance":7.34,
                        "relativeDirection":"DEPART",
                        "streetName":"Boulevard Décarie",
                        "absoluteDirection":"NORTHWEST",
                        "stayOn":false,
                        "area":false,
                        "bogusName":false,
                        "lon":-73.68272,
                        "lat":45.5142626,
                        "elevation":"",
                        "walkingBike":false
                     },
                     {
                        "distance":6.01,
                        "relativeDirection":"CONTINUE",
                        "streetName":"Rue Décarie",
                        "absoluteDirection":"NORTHWEST",
                        "stayOn":false,
                        "area":false,
                        "bogusName":false,
                        "lon":-73.6827861,
                        "lat":45.5143096,
                        "elevation":"",
                        "walkingBike":false
                     },
                     {
                        "distance":20.06,
                        "relativeDirection":"LEFT",
                        "streetName":"Boulevard de la Côte-Vertu",
                        "absoluteDirection":"SOUTHWEST",
                        "stayOn":false,
                        "area":false,
                        "bogusName":false,
                        "lon":-73.6828423,
                        "lat":45.5143466,
                        "elevation":"",
                        "walkingBike":false
                     },
                     {
                        "distance":34.4,
                        "relativeDirection":"HARD_RIGHT",
                        "streetName":"Boulevard Décarie",
                        "absoluteDirection":"NORTH",
                        "stayOn":false,
                        "area":false,
                        "bogusName":false,
                        "lon":-73.6830156,
                        "lat":45.5142131,
                        "elevation":"",
                        "walkingBike":false
                     }
                  ],
                  "rentedBike":false,
                  "walkingBike":false,
                  "duration":186.0
               },
               {
                  "startTime":1669344420000,
                  "endTime":1669344960000,
                  "departureDelay":0,
                  "arrivalDelay":0,
                  "realTime":false,
                  "distance":4321.18,
                  "generalizedCost":1914,
                  "pathway":false,
                  "mode":"BUS",
                  "transitLeg":true,
                  "route":"Côte-Vertu-Ouest",
                  "agencyName":"Société de transport de Montréal",
                  "agencyUrl":"http://www.stm.info",
                  "agencyTimeZoneOffset":-18000000,
                  "routeColor":"009EE0",
                  "routeType":3,
                  "routeId":"1:174",
                  "routeTextColor":"000000",
                  "interlineWithPreviousLeg":false,
                  "headsign":"174-O",
                  "agencyId":"1:STM",
                  "tripId":"1:255120306",
                  "serviceDate":"2022-11-24",
                  "from":{
                     "name":"Station Côte-Vertu",
                     "stopId":"1:60289",
                     "stopCode":"60289",
                     "lon":-73.683295,
                     "lat":45.514417,
                     "arrival":1669343646000,
                     "departure":1669344420000,
                     "stopIndex":0,
                     "stopSequence":1,
                     "vertexType":"TRANSIT"
                  },
                  "to":{
                     "name":"Côte-Vertu / Montée de Liesse",
                     "stopId":"1:55810",
                     "stopCode":"55810",
                     "lon":-73.718955,
                     "lat":45.485808,
                     "arrival":1669344960000,
                     "departure":1669344960000,
                     "stopIndex":6,
                     "stopSequence":7,
                     "vertexType":"TRANSIT"
                  },
                  "intermediateStops":[
                     {
                        "name":"Côte-Vertu / Cavendish",
                        "stopId":"1:55486",
                        "stopCode":"55486",
                        "lon":-73.701338,
                        "lat":45.499629,
                        "arrival":1669344780000,
                        "departure":1669344780000,
                        "stopIndex":1,
                        "stopSequence":2,
                        "vertexType":"TRANSIT"
                     },
                     {
                        "name":"Côte-Vertu / Cavendish",
                        "stopId":"1:55488",
                        "stopCode":"55488",
                        "lon":-73.702397,
                        "lat":45.498779,
                        "arrival":1669344790000,
                        "departure":1669344790000,
                        "stopIndex":2,
                        "stopSequence":3,
                        "vertexType":"TRANSIT"
                     },
                     {
                        "name":"Côte-Vertu / Beaulac",
                        "stopId":"1:55464",
                        "stopCode":"55464",
                        "lon":-73.706181,
                        "lat":45.495777,
                        "arrival":1669344828000,
                        "departure":1669344828000,
                        "stopIndex":3,
                        "stopSequence":4,
                        "vertexType":"TRANSIT"
                     },
                     {
                        "name":"Côte-Vertu / No 3695",
                        "stopId":"1:55355",
                        "stopCode":"55355",
                        "lon":-73.708525,
                        "lat":45.493919,
                        "arrival":1669344852000,
                        "departure":1669344852000,
                        "stopIndex":4,
                        "stopSequence":5,
                        "vertexType":"TRANSIT"
                     },
                     {
                        "name":"Côte-Vertu / No 4045",
                        "stopId":"1:55785",
                        "stopCode":"55785",
                        "lon":-73.711559,
                        "lat":45.491515,
                        "arrival":1669344882000,
                        "departure":1669344882000,
                        "stopIndex":5,
                        "stopSequence":6,
                        "vertexType":"TRANSIT"
                     }
                  ],
                  "legGeometry":{
                     "points":"kpxtGdgv`MZ_@NYFJtBnCDDdCfDd@r@DFnBhCBDlDvEjDzEh@r@DFHJFHr@`Av@hA@@??RAjAdBDFvAfBBHBP?@@@xGzIDFjBlCDFHJFFlIbLDDbHzJlDtEDDfHnJDFtFrH??X`@FF`AvAFFz@jA????RZDDnGvIDDhHpJ??LPBD|IbM????Zd@lGlIDDNR`DjE??zCdELTZd@^z@Tp@RdAhAdGP~@????JXNZ@@??XZ??@?XN@???d@D????\\E????`@Sb@EP@XDNDVPz@fATZHLnFzHNV~BpC",
                     "length":106
                  },
                  "steps":[

                  ],
                  "routeShortName":"174",
                  "routeLongName":"Côte-Vertu-Ouest",
                  "duration":540.0
               },
               {
                  "startTime":1669344960000,
                  "endTime":1669345169000,
                  "departureDelay":0,
                  "arrivalDelay":0,
                  "realTime":false,
                  "distance":251.2,
                  "generalizedCost":390,
                  "pathway":false,
                  "mode":"WALK",
                  "transitLeg":false,
                  "route":"",
                  "agencyTimeZoneOffset":-18000000,
                  "interlineWithPreviousLeg":false,
                  "from":{
                     "name":"Côte-Vertu / Montée de Liesse",
                     "stopId":"1:55810",
                     "stopCode":"55810",
                     "lon":-73.718955,
                     "lat":45.485808,
                     "arrival":1669344960000,
                     "departure":1669344960000,
                     "vertexType":"TRANSIT"
                  },
                  "to":{
                     "name":"Destination",
                     "lon":-73.7189484,
                     "lat":45.484086,
                     "arrival":1669345169000,
                     "vertexType":"NORMAL"
                  },
                  "legGeometry":{
                     "points":"i}rtGpf}`MVXX\\JLLLPTDH@B?DBBPLPNB@BCDINUBBZd@HOp@kAb@u@\\m@",
                     "length":22
                  },
                  "steps":[
                     {
                        "distance":148.39,
                        "relativeDirection":"DEPART",
                        "streetName":"Boulevard de la Côte-Vertu",
                        "absoluteDirection":"SOUTHWEST",
                        "stayOn":false,
                        "area":false,
                        "bogusName":false,
                        "lon":-73.7189634,
                        "lat":45.4858109,
                        "elevation":"",
                        "walkingBike":false
                     },
                     {
                        "distance":102.82,
                        "relativeDirection":"LEFT",
                        "streetName":"service road",
                        "absoluteDirection":"SOUTHEAST",
                        "stayOn":false,
                        "area":false,
                        "bogusName":true,
                        "lon":-73.7198037,
                        "lat":45.4847976,
                        "elevation":"",
                        "walkingBike":false
                     }
                  ],
                  "rentedBike":false,
                  "walkingBike":false,
                  "duration":209.0
               }
            ],
            "tooSloped":false,
            "arrivedAtDestinationWithRentedBicycle":false
         }

         const walkWaitComponents = getWalkWaitComponents(testingRoute);

         expect(walkWaitComponents.duration).toBe(4590);
         expect(walkWaitComponents.walk.components).toHaveLength(4);
         expect(walkWaitComponents.walk.time).toBe(1163)
         expect(walkWaitComponents.wait.components).toHaveLength(2);
         expect(walkWaitComponents.wait.time).toBe(1051)
     });

     // Test for a route without any walk or wait components
     test("Get metrics from route without walking and waiting components", () => {
        const testingRoute = {
            "duration":4590,
            "startTime":1669340579000,
            "endTime":1669345169000,
            "walkTime":0,
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
            "legs":[
               {
                  "startTime":1669341180000,
                  "endTime":1669342116000,
                  "departureDelay":0,
                  "arrivalDelay":0,
                  "realTime":false,
                  "distance":6430.61,
                  "generalizedCost":1536,
                  "pathway":false,
                  "mode":"BUS",
                  "transitLeg":true,
                  "route":"Broadway / Provost",
                  "agencyName":"Société de transport de Montréal",
                  "agencyUrl":"http://www.stm.info",
                  "agencyTimeZoneOffset":-18000000,
                  "routeColor":"009EE0",
                  "routeType":3,
                  "routeId":"1:191",
                  "routeTextColor":"000000",
                  "interlineWithPreviousLeg":false,
                  "headsign":"191-E",
                  "agencyId":"1:STM",
                  "tripId":"1:254685536",
                  "serviceDate":"2022-11-24",
                  "from":{
                     "name":"Notre-Dame / Saint-Pierre",
                     "stopId":"1:56474",
                     "stopCode":"56474",
                     "lon":-73.646549,
                     "lat":45.442456,
                     "arrival":1669341180000,
                     "departure":1669341180000,
                     "stopIndex":49,
                     "stopSequence":50,
                     "vertexType":"TRANSIT"
                  },
                  "to":{
                     "name":"Station Place-Saint-Henri / Saint-Ferdinand",
                     "stopId":"1:51987",
                     "stopCode":"51987",
                     "lon":-73.587162,
                     "lat":45.47709,
                     "arrival":1669342116000,
                     "departure":1669342116000,
                     "stopIndex":68,
                     "stopSequence":69,
                     "vertexType":"TRANSIT"
                  },
                  "intermediateStops":[
                     {
                        "name":"Notre-Dame / No 450",
                        "stopId":"1:56480",
                        "stopCode":"56480",
                        "lon":-73.643582,
                        "lat":45.444088,
                        "arrival":1669341208000,
                        "departure":1669341208000,
                        "stopIndex":50,
                        "stopSequence":51,
                        "vertexType":"TRANSIT"
                     },
                     {
                        "name":"Notre-Dame / No 1000",
                        "stopId":"1:56482",
                        "stopCode":"56482",
                        "lon":-73.64159,
                        "lat":45.445193,
                        "arrival":1669341227000,
                        "departure":1669341227000,
                        "stopIndex":51,
                        "stopSequence":52,
                        "vertexType":"TRANSIT"
                     },
                     {
                        "name":"Notre-Dame / de la Berge-du-Canal",
                        "stopId":"1:56449",
                        "stopCode":"56449",
                        "lon":-73.637434,
                        "lat":45.447503,
                        "arrival":1669341267000,
                        "departure":1669341267000,
                        "stopIndex":52,
                        "stopSequence":53,
                        "vertexType":"TRANSIT"
                     },
                     {
                        "name":"Notre-Dame / No 8000",
                        "stopId":"1:56484",
                        "stopCode":"56484",
                        "lon":-73.632425,
                        "lat":45.449367,
                        "arrival":1669341311000,
                        "departure":1669341311000,
                        "stopIndex":53,
                        "stopSequence":54,
                        "vertexType":"TRANSIT"
                     },
                     {
                        "name":"Notre-Dame / No 6450",
                        "stopId":"1:51240",
                        "stopCode":"51240",
                        "lon":-73.61587,
                        "lat":45.457901,
                        "arrival":1669341466000,
                        "departure":1669341466000,
                        "stopIndex":54,
                        "stopSequence":55,
                        "vertexType":"TRANSIT"
                     },
                     {
                        "name":"Notre-Dame / No 6300",
                        "stopId":"1:51305",
                        "stopCode":"51305",
                        "lon":-73.613709,
                        "lat":45.459097,
                        "arrival":1669341487000,
                        "departure":1669341487000,
                        "stopIndex":55,
                        "stopSequence":56,
                        "vertexType":"TRANSIT"
                     },
                     {
                        "name":"Notre-Dame / No 6200",
                        "stopId":"1:60585",
                        "stopCode":"60585",
                        "lon":-73.611756,
                        "lat":45.460179,
                        "arrival":1669341506000,
                        "departure":1669341506000,
                        "stopIndex":56,
                        "stopSequence":57,
                        "vertexType":"TRANSIT"
                     },
                     {
                        "name":"Notre-Dame / No 6000",
                        "stopId":"1:51418",
                        "stopCode":"51418",
                        "lon":-73.609589,
                        "lat":45.461372,
                        "arrival":1669341527000,
                        "departure":1669341527000,
                        "stopIndex":57,
                        "stopSequence":58,
                        "vertexType":"TRANSIT"
                     },
                     {
                        "name":"Notre-Dame / Turcot",
                        "stopId":"1:62042",
                        "stopCode":"62042",
                        "lon":-73.60826,
                        "lat":45.462066,
                        "arrival":1669341539000,
                        "departure":1669341539000,
                        "stopIndex":58,
                        "stopSequence":59,
                        "vertexType":"TRANSIT"
                     },
                     {
                        "name":"Notre-Dame / Place Turcot Est",
                        "stopId":"1:51601",
                        "stopCode":"51601",
                        "lon":-73.602505,
                        "lat":45.465192,
                        "arrival":1669341597000,
                        "departure":1669341597000,
                        "stopIndex":59,
                        "stopSequence":60,
                        "vertexType":"TRANSIT"
                     },
                     {
                        "name":"Notre-Dame / Monk",
                        "stopId":"1:53961",
                        "stopCode":"53961",
                        "lon":-73.600305,
                        "lat":45.466319,
                        "arrival":1669341618000,
                        "departure":1669341618000,
                        "stopIndex":60,
                        "stopSequence":61,
                        "vertexType":"TRANSIT"
                     },
                     {
                        "name":"Notre-Dame / Gadbois",
                        "stopId":"1:61640",
                        "stopCode":"61640",
                        "lon":-73.596907,
                        "lat":45.468091,
                        "arrival":1669341650000,
                        "departure":1669341650000,
                        "stopIndex":61,
                        "stopSequence":62,
                        "vertexType":"TRANSIT"
                     },
                     {
                        "name":"École James-Lyng (Notre-Dame / de Carillon)",
                        "stopId":"1:51775",
                        "stopCode":"51775",
                        "lon":-73.595791,
                        "lat":45.468471,
                        "arrival":1669341660000,
                        "departure":1669341660000,
                        "stopIndex":62,
                        "stopSequence":63,
                        "vertexType":"TRANSIT"
                     },
                     {
                        "name":"Notre-Dame / de la Côte-Saint-Paul",
                        "stopId":"1:60527",
                        "stopCode":"60527",
                        "lon":-73.5929,
                        "lat":45.469432,
                        "arrival":1669341780000,
                        "departure":1669341780000,
                        "stopIndex":63,
                        "stopSequence":64,
                        "vertexType":"TRANSIT"
                     },
                     {
                        "name":"Notre-Dame / Saint-Rémi",
                        "stopId":"1:51874",
                        "stopCode":"51874",
                        "lon":-73.591168,
                        "lat":45.470104,
                        "arrival":1669341840000,
                        "departure":1669341840000,
                        "stopIndex":64,
                        "stopSequence":65,
                        "vertexType":"TRANSIT"
                     },
                     {
                        "name":"Notre-Dame / De Courcelle",
                        "stopId":"1:51936",
                        "stopCode":"51936",
                        "lon":-73.588787,
                        "lat":45.472622,
                        "arrival":1669341924000,
                        "departure":1669341924000,
                        "stopIndex":65,
                        "stopSequence":66,
                        "vertexType":"TRANSIT"
                     },
                     {
                        "name":"Square Sir-George-Étienne-Cartier",
                        "stopId":"1:53954",
                        "stopCode":"53954",
                        "lon":-73.58743,
                        "lat":45.474126,
                        "arrival":1669341974000,
                        "departure":1669341974000,
                        "stopIndex":66,
                        "stopSequence":67,
                        "vertexType":"TRANSIT"
                     },
                     {
                        "name":"Saint-Jacques / Saint-Philippe",
                        "stopId":"1:51926",
                        "stopCode":"51926",
                        "lon":-73.588394,
                        "lat":45.476637,
                        "arrival":1669342088000,
                        "departure":1669342088000,
                        "stopIndex":67,
                        "stopSequence":68,
                        "vertexType":"TRANSIT"
                     }
                  ],
                  "legGeometry":{
                     "points":"snjtGhbo`M{HeQGM????kEmJQ_@????_HoOgDuH????iAiCcAsDCG}@mDGk@???AcDaM????m@{BI]Qq@a@uA]_Ag@uA{@uBEGkAiCQ[y@}AYg@e@aA[o@aA{BiAmC{@gCyCeJcD}HaEkJcBmCmFuM_D{G???A}EiKQa@??gDiHq@{A????oFmL??mBeEMe@???AQW??Q[CEo@}@q@q@m@i@g@a@g@UJg@?A?A@w@???AMmA?A??g@eBkIyR????]w@CGyAqDg@y@cAcC????[u@EIkBoEy@sBy@kBc@cACIu@kB????Qc@{@{D????k@kCCGq@_Dw@kDEM_@sA????gAcECGs@cCEG??ACGMKOu@m@EEaLgK????OMEEqAmAEEsAeAOOEEuAgA????QOEEo@k@y@q@EEcByAEL?J?Vo@tB]~@IVMd@aAtCM^YXIBk@iB????_@qACIw@yC",
                     "length":158
                  },
                  "steps":[

                  ],
                  "routeShortName":"191",
                  "routeLongName":"Broadway / Provost",
                  "duration":936.0
               }
            ],
            "tooSloped":false,
            "arrivedAtDestinationWithRentedBicycle":false
         }

         const walkWaitComponents = getWalkWaitComponents(testingRoute);

         expect(walkWaitComponents.walk.components).toHaveLength(0);
         expect(walkWaitComponents.walk.time).toBe(0)
         expect(walkWaitComponents.wait.components).toHaveLength(0);
         expect(walkWaitComponents.wait.time).toBe(0)

     });
});

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

     //Verifies that an error is indeed produced when an invalid mode is passed.
     test("Get List of routes that fit specifications: Testing invalid mode", () => {
        expect(() => {
         sliceRoutesList(testingListRoute, 1669341340000, 1669345169000, "INVALID_MODE")
      })
      .toThrow(Error);
     });
});