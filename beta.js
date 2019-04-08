var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var SerialPort = require("serialport");
const Readline = require('@serialport/parser-readline');


var server = app.listen(8081, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("Go to http://%s:%s", host, port)

});

console.log("server runnig at http://localhost:8080");

var app1 = require('http').createServer(handler)
var io = require('socket.io')(app1);
var fs = require('fs');
app1.listen(8080);

function handler(req, res) {
    fs.readFile(__dirname + '/ds.html',
        function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading ds.html');
            }

            res.writeHead(200);
            res.end(data);
        });
}

io.on('connection', function (socket) {

    //1. Calling a function on the client
    socket.emit('ping');
    //socket.emit(redata);

});

var arduinoCOMPort = "COM5";

var arduinoSerialPort = new SerialPort(arduinoCOMPort, {
    baudBate: 9600
});

arduinoSerialPort.on('open', function (data) {
    console.log('Serial Port ' + arduinoCOMPort + ' is opened.');
});

const parser = arduinoSerialPort.pipe(new Readline({ delimiter: '\n' }));

parser.on('data', data => {
    // console.log("hello");
    console.log(data);
    io.sockets.emit('Ping', data);

});

var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use('/css', express.static('css'));



app.use(express.static('public'));

app.get('/index.htm', function (req, res) {

    res.sendFile(__dirname + "/" + "index.htm");
});


app.post('/fuc', urlencodedParser, function (req, res) {

    // 输出 JSON 格式
    arduinoSerialPort.write(';');


});

app.post('/rpm', urlencodedParser, function (req, res) {

    // 输出 JSON 格式
    var response = {
        "rpm": req.body.rpm,
        //  "last_name":req.body.last_name
    };

    console.log(response);
    // res.end(JSON.stringify(response));
    console.log(response.rpm);

    var indata;
    if (response.rpm == 0) {

        indata = "rpm0000|";
    } else if (response.rpm >= 1 && response.rpm < 10) {

        indata = "rpm000" + response.rpm + "|";
    }
    else if (response.rpm >= 10 && response.rpm < 100) {

        indata = "rpm00" + response.rpm + "|";
    }
    else if (response.rpm >= 100 && response.rpm < 1000) {

        indata = "rpm0" + response.rpm + "|";
        console.log("if");
    } else {

        indata = "rpm" + response.rpm + "|";
        console.log("if");

    }

    console.log(indata);
    arduinoSerialPort.write(indata);

    // res.writeHead(`<link rel="stylesheet" type="text/css" href="css/st.css">`);
    res.set('Content-Type', 'text/html');

    res.send(`<link rel="stylesheet" type="text/css" href="css/st.css"> 
        <p>RPM has set to ${response.rpm} </p>`);

    // res.send("<p>Rpm has set to " + response.rpm); //write a response to the client
    res.end(); //end the response

});

app.post('/CwCCW', urlencodedParser, function (req, res) {

    // 输出 JSON 格式
    var response = {
        "dir": req.body.dir
        //  "last_name":req.body.last_name
    };

    console.log(response);

    console.log('dir' + response.dir + '|');
    arduinoSerialPort.write('dir' + response.dir + '|');
    res.set('Content-Type', 'text/html');

    
    if (response.dir == "cw") {

        res.send(`<link rel="stylesheet" type="text/css" href="css/st.css"> 
        <p>Dir has set to Clockwise s</p>`);

    } else if (response.dir == "ccw") {
        res.send(`<link rel="stylesheet" type="text/css" href="css/st.css"> 
            <p>Dir has set to Counter Clockwise </p>`);

    } else {

        res.write("error!!!!!!"); //write a response to the client
    }
    res.end(); //end the response

});

app.post('/OnOff', urlencodedParser, function (req, res) {

    // 输出 JSON 格式

    var response = {
        "enb": req.body.enb
        //  "last_name":req.body.last_name
    };

    console.log(response);

    console.log('enb' + response.enb + '|');
    arduinoSerialPort.write('enb' + response.enb + '|');

    res.set('Content-Type', 'text/html');

   
    if (response.enb == "en") {

        res.send(`<link rel="stylesheet" type="text/css" href="css/st.css"> 
            <p>Enb has set to Enable </p>`);

    } else if (response.enb == "ds") {

        res.send(`<link rel="stylesheet" type="text/css" href="css/st.css"> 
            <p>Enb has set to Disable </p>`);

    } else {

        res.write("error!!!!!!"); //write a response to the client
    }
    res.end(); //end the response

});
