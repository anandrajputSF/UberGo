exports.getDateTime = function (unixdatetime) {
    var newDate = new Date();
    newDate.setTime(unixdatetime * 1000);
    return newDate.toUTCString();
};