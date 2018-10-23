const rideHistory = require('../model/rideHistory.model');

exports.insertRideHistory = function (object) {
     var Citydata = {
         Name        :   object.City.Name,
         Latitude    :   object.City.Latitude,
         Longitude   :   object.City.Longitude
    };
    rideHistory.find({RequestId:object.RequestId},function(err, data){
        if(err) return handleError(err);
        if(data.length == 0)
        {
            rideHistory.create({
                RiderId     : object.RiderId,
                RequestId   : object.RequestId,
                Distance    : object.Distance,
                RequestTime : object.RequestTime,
                StartTime   : object.StartTime,
                EndTime     : object.EndTime,
                City        : Citydata,
                Status      : object.Status,
                CreatedDate : Date.now()
            });
        }
    });
};
var Projection = {
    __v         : false,
    _id         : false,
    RiderId     : false  
};
exports.getAllRides = function(riderId, callback){
    rideHistory.find({RiderId: riderId},Projection, callback).sort({CreatedDate:1});
};