const moment = require('moment');

function runtimeToNumber(runtime) {
    return parseInt(runtime.slice(0, runtime.length - 3))
}

function releasedStringToDate(released) {
    return moment(released, 'DD-MMM-YYYY');
}

function yearStringToDate(year) {
    return moment(year, 'YYYY');
}

function watchedOnDate() {
    return moment(new Date, 'YYYY-MM-DD');
}

function gerneSplit(gernes) {
    return gernes.split(/, /g);
}

function actorSplit(actors) {
    return actors.split(/, /g);
}

module.exports = { 
    runtimeToNumber,
    releasedStringToDate,
    yearStringToDate,
    watchedOnDate,
    gerneSplit,
    actorSplit
}