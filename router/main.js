const config        = require('../config/config');// UberGo general configuration settings
const Uber          = require('node-uber');// access uber API
const url           = require('url');
const request       = require('request');
const rpController  = require('../controllers/riderProfile.controller');// Rider Profile Controller
const rhController  = require('../controllers/rideHistory.controller');// Rider History Controller
const session       = require('cookie-session');
const async         = require("async");// Async calling
const moment        = require('moment');
const ugUtil        = require('../util/util');// UberGo Utility Methods
const logger        = require('../config/winston');// Error Loging

module.exports = function(app)
{
    // Uber Properties define
    var uber = new Uber({
        client_id: config.uber.client_id,
        client_secret: config.uber.client_secret,
        server_token: config.uber.server_token,
        redirect_uri: config.uber.redirect_uri,
        name: config.express.app_name,
        sandbox: config.uber.sandbox
    });

    // Session Define
     app.use(session({
         cookieName: 'UberGo',
         secret: 'UberGo',
         duration: 30 * 60 * 1000,
         activeDuration: 5 * 60 * 1000,
     }));

     app.use(function (req, res, next) {
         if (typeof (req.session.riderId) == 'undefined') {
             req.session.riderId = '';
         }         
         next();
     });

     app.get('/',function(req,res){
        res.render('index.html', {Title:config.express.AppName});
     });
      
     // Login API Request
    app.get('/api/login', function(request, response) {
        response.redirect(uber.getAuthorizeUrl(config.uber.scopes));
    });

    // Callback Method
    app.get('/api/callback', function(request, response) {
        uber.authorization({
            authorization_code: request.query.code
        }, function(err, data) {
            if (err) {
                logger.error(err); // Error logging
                return handleError(err);
            } else {
                uber.setTokens(data[0] , data[1] , data[3] , data[2]);
                response.redirect('/rider/profile'); 
            }
        });
    });

    // Rider Profile API Request
    app.get('/rider/profile', function (request, response) {
        rpController.getRiderDetails(request.session.riderId, function (err, result) {
            if (err){
                logger.error(err); // Error logging
                return handleError(err);
            }
            if (result.length > 0) {             
                app.locals.Name = result[0].Name || null;
                app.locals.Picture = result[0].Picture || null;

                getHistoryAsync(request.session.riderId);// Called History Async method
                 response.render('rider_profile.html', {
                     riderProfile: result[0],
                     Title: config.title.profile
                });
            } else {
                // Uber GetProfile API Call
                uber.user.getProfile(function (err, res) {
                    if (err) {
                        logger.error(err); // Error logging
                        return handleError(err);
                    } else {
                         var riderProfile = {
                             Id: res.rider_id,
                             UId: res.uuid,
                             Name: res.first_name + ' ' + res.last_name,
                             Email: res.email,
                             Picture: res.picture,
                             PromoCode: res.promo_code,
                             MobileVerified: res.mobile_verified
                         };

                        request.session.riderId = riderProfile.Id;
                        app.locals.Name = riderProfile.Name || null;
                        app.locals.Picture = riderProfile.Picture || null;
                        
                        getHistoryAsync(request.session.riderId);// Called History Async method
                        rpController.insertRiderProfile(riderProfile);// Rider profile create
                         response.render('rider_profile.html', {
                             riderProfile: riderProfile,
                             Title: config.title.profile
                         });
                    }
                });
            }
        });
    });

    // Rider History Request API
    var rideHistory=[]; 
    app.get('/rider/history', function(request, response,next) {
        rideHistory=[];
        rhController.getAllRides(request.session.riderId, function (err, result) {
            if (err) {
                logger.error(err); // Error logging
                return handleError(err);
            }
            if (result.length > 0) {               
                response.render('rider_history.html',{rideHistory:JSON.stringify(result),
                    Title: config.title.history,
                    moment: moment});
                    next();
            }
        });
     });

     // Rider callback method
     function getHistory(riderId, count, offset, limit,cbu){
        // Uber GetProfile API Call             
        uber.user.getHistory(offset, limit,function(err, res) {
            if (err) {
                logger.error(err); // Error logging
                return handleError(err);
            } else {
                if(count==0) count=res.count;
                res.history.forEach(function(value) { 
                     var ride = {
                         RiderId     : riderId,
                         RequestId   : value.request_id,
                         Distance    : parseFloat(value.distance).toFixed(2),
                         RequestTime : ugUtil.getDateTime(value.request_time),
                         StartTime   : ugUtil.getDateTime(value.start_time),
                         City:
                         {
                             Name        : value.start_city.display_name,
                             Latitude    : value.start_city.latitude,
                             Longitude   : value.start_city.longitude
                         },
                         EndTime     : ugUtil.getDateTime(value.end_time),
                         Status      : value.status
                        };
                    rideHistory.push(ride);
                    rhController.insertRideHistory(ride);
                });
                
                 offset += limit;
                 if(offset <= count)
                     getHistory(riderId, count, offset,limit,cbu);

            }
        });
     }

     // Rider History Async method
     function getHistoryAsync(riderId){
        async.waterfall([
            function(cb) {
                getHistory(riderId,0,0,50,cb);
                cb(null);
            }], function(err, results){ 
                if (err) {
                    logger.error(err); // Error logging
                    return handleError(err);
                }                 
        });
     }

     // Logout API Request
     app.get('/404', function(request, response){
        response.redirect('404.html');
    })

     // Logout API Request
     app.get('/api/logout', function(request, response){
        uber.revokeToken(uber.access_token, function(error, result){
            if (error) {
                logger.error(error); // Error logging
                return handleError(error);
            } else {
                console.log('Logged out');
                uber.clearTokens();
                response.redirect('/');
            }
        });
    });
}