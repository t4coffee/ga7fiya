var express = require('express');
var router = express.Router();

// Set page title
var title = 'XML Web Form Application';

// variables to deal with xml file
var fs = require('fs');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();

// Define path to xml files into variables
var srcxml  = __dirname + "/xml/source.xml";
var dstxml  = __dirname + "/xml/destination.xml";

var HULK = 'THIS IS HULK';
var BRUCE = 'THIS IS BRUCE';

// GET the index home page
router.get('/', function(req, res, next) {
  res.render('index',
    { title: title,
      bodytext: 'This is a web form that will edit the contents of an XML file'});
});

// Function to handle form POST method
router.post('/generateform', function(req,res){
  console.log("OOOOH BABY! WE GOT THE FORM GOING!");

  // Nodejs file system method to read contents of an xml file into an object and also stringify to convert the object to JSON
  fs.readFile(srcxml, "utf-8", function(err, data) {

    // Parse XML data into variable
    parser.parseString(data, function(err, result) {
      console.log('I IS READING THE FILE');
      HULK = JSON.parse(JSON.stringify(result));
      HULK.sales_team.sales_employee[1].kam_name = 'The Prodigy';
      //console.log(HULK.sales_team.sales_employee[1].kam_name);
      //console.log(BRUCE);

      // Define variables to build out the destination XML as a Javascript Object
      var builder = new xml2js.Builder();
      var xmlcontent = builder.buildObject(HULK);

      //Nodejs file system method to write content of destination xml object to destination file
      fs.writeFile(dstxml, xmlcontent, function (err) {
        if (err) throw err;
          console.log('wrote out the xml file!');
      }); // written
    }); // parsed
  }); // read

    res.render('submit',
      { title: title,
        message: 'Thank you for submitting the form, your pdf is being generated',
        name: BRUCE
      }); // rendered submit view
}); // form POST method


module.exports = router;
