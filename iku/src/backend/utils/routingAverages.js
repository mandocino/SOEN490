export function computeRouteMetricsAverages(routingData, userData) {
  // PROCESSING OF SAVED ROUTES HERE
  let savedRoutesMetricsAverage = {};

  // TODO: GET THE NIGHT WEIGHTS AND WEEKEND WEIGHTS FROM DASHBOARD -> DASHBOARD CARD -> SCOREDETAILMODAL
  // let frequencyWeight = req.params.frequency;
  // let durationWeight = req.params.duration;

  let metricTypes = ['durationMetrics', 'trueFrequencyMetrics', 'walkMetrics'];

  let allMetrics = {}

  const processUserWeights = (weights, times=1) => {
    const baseWeights = weights.map((x) => {return x/100/times});
    let repeatedWeights = []
    for (let i=0; i<times; i++) {
      repeatedWeights = repeatedWeights.concat(baseWeights);
    }
    return repeatedWeights;
  }

  // Calculate average rush hour metrics
  const timeSlices = [
    'rushHourMetrics',
    'offPeakMetrics',
    'overnightMetrics',
    'weekendMetrics',
  ]

  const weights = {
    'rushHourMetrics': [0.5, 0.5],
    'offPeakMetrics': [0.5, 0.3, 0.2],
    'overnightMetrics': processUserWeights(Object.values(userData.nightDayWeights), 3),
    'weekendMetrics': processUserWeights(Object.values(userData.weekendWeights), 2),
    'overallMetrics': processUserWeights(Object.values(userData.timeSliceWeights))
  }

  const computeMetrics = (data) => {
    timeSlices.forEach(function (timeSlice){
      allMetrics[timeSlice] = {};

      metricTypes.forEach(function(metricType){
        allMetrics[timeSlice][metricType] = {};

        if (data[timeSlice]) {
          const arrOfMins = data[timeSlice].map((x) => {
            return x[metricType]['min'];
          })

          const arrOfMaxes = data[timeSlice].map((x) => {
            return x[metricType]['max'];
          })

          let averageSum = 0;
          for (let i=0; i<data[timeSlice].length; i++) {
            averageSum += data[timeSlice][i][metricType]['average'] * weights[timeSlice][i];
          }

          allMetrics[timeSlice][metricType]['max'] = Math.round(Math.max(...arrOfMaxes));
          allMetrics[timeSlice][metricType]['min'] = Math.round(Math.min(...arrOfMins));
          allMetrics[timeSlice][metricType]['average'] = Math.round(averageSum);
        }

        else {
          allMetrics[timeSlice][metricType]['max'] = '-';
          allMetrics[timeSlice][metricType]['min'] = '-';
          allMetrics[timeSlice][metricType]['average'] = '-';
        }
      });
      savedRoutesMetricsAverage[timeSlice] = allMetrics[timeSlice];
    });
  }

  computeMetrics(routingData, false);

  // Add the walk, bike, and car routes data
  savedRoutesMetricsAverage['alternativeModeRoutes'] = routingData['alternativeModeRoutes'];

  return savedRoutesMetricsAverage;
}