const config      = require('./config/config');// UberGo general configuration settings
const express     = require('express');
const favicon     = require('serve-favicon');
const ejsLayouts  = require('express-ejs-layouts');
const fs          = require('fs');
const path        = require('path');
const morgan      = require('morgan');
const winston     = require('./config/winston');// Error Loging

const app = new express();
require('./router/main')(app);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('layout extractScripts', true);
app.set('layout extractStyles', true);
app.engine('html', require('ejs').renderFile);

app.use(favicon('./favicon.ico'));
app.use(express.static(path.join(__dirname + 'public')));
app.use(ejsLayouts);
app.use(morgan('combined', { stream: winston.stream }));

app.get('*', function (request, response) {
  if (request.url.match('\.css$')) {
    var cssPath = path.join(__dirname, request.url);
    var fileStream = fs.createReadStream(cssPath, "UTF-8");
    response.writeHead(200, {
      "Content-Type": "text/css"
    });
    fileStream.pipe(response);
  } 
  else if (request.url.match('\.jpg$') || request.url.match('\.png$') || request.url.match('\.jpeg$')) {
    var imgPath = path.join(__dirname, request.url);
    var fileStream = fs.createReadStream(imgPath);
    response.writeHead(200, {
      "Content-Type": "image/jpg"
    });
    fileStream.pipe(response);
  }
});

var server = app.listen(config.express.PORT, 'localhost', function () {
  console.log(config.express.AppName + ' running at http://%s:%s', server.address().address, server.address().port);
});
