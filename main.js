// var express = require('express');
// var app = express();
 
// app.get('/', function (req, res) {
//    res.send('Hello World');
// })
 
// var server = app.listen(8081, function () {
 
//   var host = server.address().address
//   var port = server.address().port
 
//   console.log("应用实例，访问地址为 http://%s:%s", host, port)
 
// })

const express = require('express');
const app = express();
var SerialPort = require("serialport");

var port = 3000;

var arduinoCOMPort = "COM3";

var arduinoSerialPort = new SerialPort(arduinoCOMPort, {  
 baudBate: 9600
});

arduinoSerialPort.on('open',function(data) {
  console.log('Serial Port ' + arduinoCOMPort + ' is opened.');
    console.log(data);
});

app.get('/', function (req, res) {

    res.send('<h1>Working on express<\h1>');
 
});

arduinoSerialPort.on('data', function (data) {
  console.log(data.toString('utf8'));
});

app.get('rpm',function(req, res) {

  var action = req.params.action || req.param('rpm');

    console.log(action);

});

app.get('/:action', function (req, res) {
    
   var action = req.params.action ;
    
    // if(isNaN(action)){
    //     arduinoSerialPort.write("rpm1000|");
    //     return res.send('rpm:1000|');
    // } 
    // if(action == 'rpm2') {
    //     arduinoSerialPort.write("rpm2000|");
    //     return res.send("rpm:2000|");
    // }

    console.log(action);

    arduinoSerialPort.write(action);

    return res.send('Action: ' + action);
 
});

app.listen(port, function () {
  console.log('Example app listening on port http://0.0.0.0:' + port + '!');
});