var config = {
    express: {},
    uber: {},
    title:{},
    db:{}
  };
  
config.express.PORT     = process.env.PORT || 4500;
config.express.AppName  = 'UberGo';

config.uber.client_id       = process.env.client_id || 'higUN50BfGvfa_ko7lU2TBnruFeHpdVT';
config.uber.client_secret   = process.env.client_secret || 'fObSbVPmnIrhrOwBYIknQq0vZO2yg7VNvPiJvnDo';
config.uber.server_token    = process.env.server_token || 'XgkoEtz-KrNsvyRcPvdooc-d4kIkxzH4OgMbN7_1';
config.uber.redirect_uri    = process.env.redirect_uri || 'http://localhost:' +config.express.PORT+ '/api/callback';
config.uber.sandbox         = process.env.sandbox || true;
config.uber.scopes          = process.env.scopes || ['history','profile'];

config.title.index      = config.express.AppName;
config.title.profile    = 'Rider Profile';
config.title.history    = 'Rider History';
config.title.error      = 'Sorry, page not found';

config.db.dbContext     = 'mongodb://localhost/uberGo';

module.exports = config;