
export const getWalkWaitComponents = (route) => {
    var walkTime = route.walkTime; // Get walktime
    var walkComponents = [];
    var waitTime = 0;
    var waitComponents = [];

    const legs = route.legs;

    for (let i = 0; i < legs.length; i++) {
        const leg = legs[i];
        if(leg.mode == 'WALK') { // Get walk components 
            walkComponents.push(leg);
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