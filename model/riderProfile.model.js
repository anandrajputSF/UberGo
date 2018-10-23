const config    = require('../config/config');
const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;

mongoose.connect(config.db.dbContext, { useNewUrlParser: true });

var userProfileSchema = new Schema({
    Id              :   String,
    UId             :   String,
    Name            :   String,
    Email           :   String,
    Picture         :   String,
    PromoCode       :   String,
    MobileVerified  :   String,
    CreatedDate     :   Date
});

// Export the model
module.exports = mongoose.model('userProfile', userProfileSchema);