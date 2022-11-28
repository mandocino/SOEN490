import '@testing-library/jest-dom';
import {validateOptionalParams} from "../backend/utils/openTripPlanner";

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
});

