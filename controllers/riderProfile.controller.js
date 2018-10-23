const riderProfile = require('../model/riderProfile.model');

exports.insertRiderProfile = function (object) {
    var query = { Email: object.Email };
    riderProfile.find(query,function(err, data){
        if(err) return handleError(err);
        if(data.length == 0)
        {
            riderProfile.create({
                Id              : object.Id,
                UId             : object.UId,
                Name            : object.Name,
                Email           : object.Email,
                Picture         : object.Picture,
                PromoCode       : object.PromoCode,
                MobileVerified  : object.MobileVerified,
                CreatedDate     : Date.now()
            });
        }
    });
};

exports.getRiderDetails = function(riderID, callback){
    riderProfile.find({Id: riderID}, callback);
};