
export const getWalkWaitComponents = (route) => {
    var walkTime = 0;
    var walkComponents = [];
    var waitTime = 0;
    var waitComponents = [];

    const legs = route.legs;

    for (let i = 0; i < legs.length; i++) {
        const leg = legs[i];
        if(leg.mode == 'WALK') { // Get walk components and compute walk time
            walkComponents.push(leg);
            walkTime += (leg.endTime - leg.startTime) / 1000;
        } else if ( i != 0 && (leg.from.departure - leg.from.arrival) > 0) {
            // Get wait component and compute wait time
            waitComponents.push(leg);
            waitTime += (leg.from.departure - leg.from.arrival) / 1000;
        }
    }

    return {
        walk: {
            time: walkTime,
            components: walkComponents
        },
        wait: {
            time: waitTime,
            components: waitComponents
        }
    }

}