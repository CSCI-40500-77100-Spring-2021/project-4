CalcTimeInFuture = (delta, units) => {
    let millisecs_delta = 0;
    switch(units) {
        case 'hr':
            millisecs_delta = delta * (60000 * 60);
            break;
        case 'mins':
            millisecs_delta = delta * 60000;
            break;
        case 'secs':
            millisecs_delta = delta * 1000;
            break;
    }

    const curDateTime = Date.now();
    const dateTimeFuture = curDateTime + millisecs_delta;
    return dateTimeFuture;
}

module.exports = { CalcTimeInFuture }