// Import function from saved routes Model
import {
    getSavedRoutingDataByLocations,
    createSavedRoutingData,
    removeSavedRoutingData,
    removeSavedRoutingDataByLocations,
    updateSavedRoutingDataByLocations,
    getSavedItinerariesByLocations,
    removeSavedItineraries,
    removeSavedItinerariesByLocations,
    updateSavedItinerariesByLocations,
    removeSavedRoutingDataByDestination,
    removeSavedItinerariesByDestination,
    removeSavedRoutingDataByOrigin, removeSavedItinerariesByOrigin
} from "../models/savedRoutesModel.js";

// Get saved Routes by origin and destination
export const showSavedRoutingDataByLocations = (req, res) => {
    getSavedRoutingDataByLocations(req.params.origin, req.params.destination, (err, results) => {
        if (err){
            res.send(err);
        }else{
            res.json(results);
        }
    });
}

// Get saved itineraries by origin and destination
export const showSavedItinerariesByLocations = (req, res) => {
    getSavedItinerariesByLocations(req.params.origin, req.params.destination, (err, results) => {
        if (err){
            res.send(err);
        }else{
            res.json(results);
        }
    });
}

// Get saved Routes data averages by origin and destination
export const showSavedRoutingDataAveragesByLocations = (req, res) => {
    getSavedRoutingDataByLocations(req.params.origin, req.params.destination,  (err, results) => {
        if (err){
            res.send(err);
        }else{

            // PROCESSING OF SAVED ROUTES HERE
            console.log(results);
            results = results['routingData'];

            console.log('PARAMS:')
            console.log(req.params);

            let savedRoutesMetricsAverage = {};

            let metricTypes = ['durationMetrics', 'frequencyMetrics', 'walkMetrics'];

            // Calculate average rush hour metrics
            let rushHourMetrics = {};
            metricTypes.forEach(function(metricType){

                rushHourMetrics[metricType] = {};
                rushHourMetrics[metricType]['max'] = Math.round((results['rushHourMetrics'][0][metricType]['max'] + results['rushHourMetrics'][1][metricType]['max']) / 2);
                rushHourMetrics[metricType]['min'] = Math.round((results['rushHourMetrics'][0][metricType]['min'] + results['rushHourMetrics'][1][metricType]['min']) / 2);
                rushHourMetrics[metricType]['average'] = Math.round((results['rushHourMetrics'][0][metricType]['average'] + results['rushHourMetrics'][1][metricType]['average']) / 2);

            });

            // Calculate average off peak metrics
            let offPeakMetrics = {};
            metricTypes.forEach(function(metricType){

                offPeakMetrics[metricType] = {};
                offPeakMetrics[metricType]['max'] = Math.round(results['offPeakMetrics'][0][metricType]['max']*3.5 + results['offPeakMetrics'][1][metricType]['max']*0.3 + results['offPeakMetrics'][2][metricType]['max']*0.2);
                offPeakMetrics[metricType]['min'] = Math.round(results['offPeakMetrics'][0][metricType]['min']*3.5 + results['offPeakMetrics'][1][metricType]['min']*0.3 + results['offPeakMetrics'][2][metricType]['min']*0.2);
                offPeakMetrics[metricType]['average'] = Math.round(results['offPeakMetrics'][0][metricType]['average']*3.5 + results['offPeakMetrics'][1][metricType]['average']*0.3 + results['offPeakMetrics'][2][metricType]['average']*0.2);

            });

            // Calculate average overnight metrics
            let overnightMetrics = {};
            metricTypes.forEach(function(metricType){

                const weeknightWeight = req.params.weeknightWeight;
                const fridayNightWeight = req.params.fridayNightWeight;
                const saturdayNightWeight = req.params.saturdayNightWeight;

                overnightMetrics[metricType] = {};
                overnightMetrics[metricType]['max'] = Math.round(((results['overnightMetrics'][0][metricType]['max'] + results['overnightMetrics'][1][metricType]['max'])/2)*weeknightWeight + ((results['overnightMetrics'][2][metricType]['max'] + results['overnightMetrics'][3][metricType]['max'])/2)*fridayNightWeight + ((results['overnightMetrics'][4][metricType]['max'] + results['overnightMetrics'][5][metricType]['max'])/2)*saturdayNightWeight);
                overnightMetrics[metricType]['min'] = Math.round(((results['overnightMetrics'][0][metricType]['min'] + results['overnightMetrics'][1][metricType]['min'])/2)*weeknightWeight + ((results['overnightMetrics'][2][metricType]['min'] + results['overnightMetrics'][3][metricType]['min'])/2)*fridayNightWeight + ((results['overnightMetrics'][4][metricType]['min'] + results['overnightMetrics'][5][metricType]['min'])/2)*saturdayNightWeight);
                overnightMetrics[metricType]['average'] = Math.round(((results['overnightMetrics'][0][metricType]['average'] + results['overnightMetrics'][1][metricType]['average'])/2)*weeknightWeight + ((results['overnightMetrics'][2][metricType]['average'] + results['overnightMetrics'][3][metricType]['average'])/2)*fridayNightWeight + ((results['overnightMetrics'][4][metricType]['average'] + results['overnightMetrics'][5][metricType]['average'])/2)*saturdayNightWeight);
                
            });

            // Calculate average weekend metrics
            let weekendMetrics = {};
            metricTypes.forEach(function(metricType){

                const saturdayWeight = req.params.saturdayWeight;
                const sundayWeight = req.params.sundayWeight;

                weekendMetrics[metricType] = {};
                weekendMetrics[metricType]['max'] = Math.round(((results['weekendMetrics'][0][metricType]['max'] + results['weekendMetrics'][1][metricType]['max'])/2)*saturdayWeight + ((results['weekendMetrics'][2][metricType]['max'] + results['weekendMetrics'][3][metricType]['max'])/2)*sundayWeight);
                weekendMetrics[metricType]['min'] = Math.round(((results['weekendMetrics'][0][metricType]['min'] + results['weekendMetrics'][1][metricType]['min'])/2)*saturdayWeight + ((results['weekendMetrics'][2][metricType]['min'] + results['weekendMetrics'][3][metricType]['min'])/2)*sundayWeight);
                weekendMetrics[metricType]['average'] = Math.round(((results['weekendMetrics'][0][metricType]['average'] + results['weekendMetrics'][1][metricType]['average'])/2)*saturdayWeight + ((results['weekendMetrics'][2][metricType]['average'] + results['weekendMetrics'][3][metricType]['average'])/2)*sundayWeight);

            });
            savedRoutesMetricsAverage['rushHourMetrics'] = rushHourMetrics;
            savedRoutesMetricsAverage['offPeakMetrics'] = offPeakMetrics;
            savedRoutesMetricsAverage['overnightMetrics'] = overnightMetrics;
            savedRoutesMetricsAverage['weekendMetrics'] = weekendMetrics;

            // Calculate overall metrics
            let overallMetrics = {};
            metricTypes.forEach(function(metricType){

                overallMetrics[metricType] = {};
                overallMetrics[metricType]['max'] = Math.round((savedRoutesMetricsAverage['rushHourMetrics'][metricType]['max'] + savedRoutesMetricsAverage['offPeakMetrics'][metricType]['max'] + savedRoutesMetricsAverage['overnightMetrics'][metricType]['max'] + savedRoutesMetricsAverage['weekendMetrics'][metricType]['max'])/4);
                overallMetrics[metricType]['min'] = Math.round((savedRoutesMetricsAverage['rushHourMetrics'][metricType]['min'] + savedRoutesMetricsAverage['offPeakMetrics'][metricType]['min'] + savedRoutesMetricsAverage['overnightMetrics'][metricType]['min'] + savedRoutesMetricsAverage['weekendMetrics'][metricType]['min'])/4);
                overallMetrics[metricType]['average'] = Math.round((savedRoutesMetricsAverage['rushHourMetrics'][metricType]['average'] + savedRoutesMetricsAverage['offPeakMetrics'][metricType]['average'] + savedRoutesMetricsAverage['overnightMetrics'][metricType]['average'] + savedRoutesMetricsAverage['weekendMetrics'][metricType]['average'])/4);

            });

            savedRoutesMetricsAverage['overallMetrics'] = overallMetrics;

            // Add the walk, bike, and car routes data
            savedRoutesMetricsAverage['alternativeModeRoutes'] = results['alternativeModeRoutes'];

            res.json(savedRoutesMetricsAverage);
        }
    });
}


// Create a new set of saved routes with data
export const addSavedRoutingData = (req, res) => {
    const data = req.body;
    createSavedRoutingData(data, (err, results) => {
        if (err){
            res.send(err);
        }else{
            res.json(results);
        }
    });
}

// Update/Upsert a set of saved routes with data
export const editSavedRoutingDataByLocations = (req, res) => {
    const updateData = req.body;
    updateSavedRoutingDataByLocations(req.params.origin, req.params.destination, updateData, (err, results) => {
        if (err){
            res.send(err);
        }else{
            res.json(results);
        }
    });
}

// Update/Upsert a set of saved itineraries with data
export const editSavedItinerariesByLocations = (req, res) => {
    const updateData = req.body;
    updateSavedItinerariesByLocations(req.params.origin, req.params.destination, updateData, (err, results) => {
        if (err){
            res.send(err);
        }else{
            res.json(results);
        }
    });
}

// Delete a SavedRoutes by its object ID
export const deleteSavedRoutingData = (req, res) => {
    removeSavedRoutingData(req.body._id, (err, results) => {
        if (err){
            res.send(err);
        }else{
            res.json(results);
        }
    });
}

// Delete a SavedItineraries by its object ID
export const deleteSavedItineraries = (req, res) => {
    removeSavedItineraries(req.body._id, (err, results) => {
        if (err){
            res.send(err);
        }else{
            res.json(results);
        }
    });
}

// Delete a SavedRoutes by origin and destination
export const deleteSavedRoutingDataByLocations = (req, res) => {
    removeSavedRoutingDataByLocations(req.params.origin, req.params.destination, (err, results) => {
        if (err){
            res.send(err);
        }else{
            res.json(results);
        }
    });
}

// Delete a SavedRoutes by origin only
export const deleteSavedRoutingDataByOrigin = (req, res) => {
    removeSavedRoutingDataByOrigin(req.params.origin, (err, results) => {
        if (err){
            res.send(err);
        }else{
            res.json(results);
        }
    });
}

// Delete a SavedRoutes by destination only
export const deleteSavedRoutingDataByDestination = (req, res) => {
    removeSavedRoutingDataByDestination(req.params.destination, (err, results) => {
        if (err){
            res.send(err);
        }else{
            res.json(results);
        }
    });
}

// Delete a SavedItineraries by origin and destination
export const deleteSavedItinerariesByLocations = (req, res) => {
    removeSavedItinerariesByLocations(req.params.origin, req.params.destination, (err, results) => {
        if (err){
            res.send(err);
        }else{
            res.json(results);
        }
    });
}

// Delete a SavedItineraries by origin only
export const deleteSavedItinerariesByOrigin = (req, res) => {
    removeSavedItinerariesByOrigin(req.params.origin, (err, results) => {
        if (err){
            res.send(err);
        }else{
            res.json(results);
        }
    });
}

// Delete a SavedItineraries by destination only
export const deleteSavedItinerariesByDestination = (req, res) => {
    removeSavedItinerariesByDestination(req.params.destination, (err, results) => {
        if (err){
            res.send(err);
        }else{
            res.json(results);
        }
    });
}
