var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// variables to deal with xml file
var fs = require('fs');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

/* route redirect to form page - actually being done by index.js
app.get('/', function(req, res){
  res.render('form');
});
*/

/* form post function that will read an xml file into a variable and display the contents to the console
app.post('/submitform', function(req,res){
  var xmlfile  = __dirname + "/public/xml/formdata.xml";

  fs.readFile(xmlfile, "utf-8", function(err, data) {
    if (err) {
      throw error;
    }
    else {
      parser.parseString(data, function (err, result) {
        console.dir(result[1]);
        console.log('Done');
      });
    }
  });

  return res.send(req.body);
});
*/

app.post('/submitform', function(req,res){
  var xmlfile  = __dirname + "/public/xml/formdata2.xml";

  var builder = new xml2js.Builder();
  var parsedxml = builder.buildObject(req.body);
  console.log(parsedxml);

// Replace contents of XML file with XMLContent from form
  fs.writeFile(xmlfile, parsedxml, function (err) {
    if (err) throw err;
    console.log('Replaced!');
  });

 return res.send(req.body);

});


/* Open XML file and write out content to the console
var xmlfile  = __dirname + "/public/xml/formdata.xml";

  fs.readFile(xmlfile, "utf-8", function(err, data) {
    parser.parseString(data, function (err, result) {
      console.dir(JSON.stringify(result.salesform.salesteam[1].firstname));
    });
  });
  return res.send(req.body);

  });
*/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
