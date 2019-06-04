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
var DOMParser = require('xmldom').DOMParser;
var XMLSerializer = require ('xmldom').XMLSerializer;

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


var THEHULK = 'NOTHING HERE';

app.post('/submitform', function(req,res){

// Define path to source xml file
  var sourcexml  = __dirname + "/public/xml/kam.xml";

// Nodejs file system method to read contents of an xml file into an object (stringify to convert the object to a JSON)
  fs.readFile(sourcexml, "utf-8", function(err, data) {
    parser.parseString(data, function(err, result) {
        // Parse the XML from source to a JSON object - for easy editing
        THEHULK = JSON.stringify(result, null, 2);
        console.log(THEHULK);

        // Define path to new XML file, build out the content as a Javascript Object
          var destfile  = __dirname + "/public/xml/formdata2.xml";
          var builder = new xml2js.Builder();
          var dxml = builder.buildObject(result);

          //Nodejs file system method to write content of destination xml object to destination file
          fs.writeFile(destfile, dxml, function (err) {
            if (err) throw err;
            console.log('Replaced!');
          });
    });
  });

//What to show on the page after the submit button is clicked on the form
 return res.send(req.body);

});

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
