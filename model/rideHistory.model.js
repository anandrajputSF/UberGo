const config    = require('../config/config');
const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;

mongoose.connect(config.db.dbContext, { useNewUrlParser: true });

 var CitySchema = new Schema({
     Name        :   String,
     Latitude    :   String,
     Longitude   :   String
},{ _id : false });

var rideHistorySchema = new Schema({
    RiderId     :   String,
    RequestId   :   String,
    Distance    :   String,
    RequestTime :   String,
    StartTime   :   String,
    City        :   [CitySchema],
    EndTime     :   String,
    Status      :   String,
    CreatedDate :   Date
});

// Export the model
module.exports = mongoose.model('rideHistory', rideHistorySchema);