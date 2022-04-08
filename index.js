/*

Simple Serial Server
using express.js and p5.js

To call this type the following on the command line:
node index.js portName

where portname is the name of your serial port, e.g. /dev/tty.usbserial-xxxx (on OSX)

created 19 Sept 2014
modified 5 Nov 2017
by Tom Igoe
*/

var SerialPort = require('serialport');			// include the serialport library
var	portName =  process.argv[2];						// get the port name from the command line
var express = require('express');	          // include the express library
var server = express();					            // create a server using express

const WebSocket = require('ws')
const url = 'ws://192.168.41.251:8080'
const connection = new WebSocket(url)

var myPort = new SerialPort(portName, { baudRate:115000, parity:"none"});// open the port
var Readline = SerialPort.parsers.Readline;	// make instance of Readline parser
var parser = new Readline();			// make a new parser to read ASCII lines
myPort.pipe(parser);				// pipe the serial stream to the parser

// these are the definitions for the serial events:
myPort.on('open', showPortOpen);    // called when the serial port opens
myPort.on('close', showPortClose);  // called when the serial port closes
myPort.on('error', showError);   // called when there's an error with the serial port
parser.on('data', readSerialData);  // called when there's new data incoming

// configure the server's behavior:
server.use('/',express.static('public')); // serve static files from /public
server.listen(8080);                      // start the server

// these are the functions called when the serial events occur:
function showPortOpen() {
  console.log('port open. Data rate1: ' + myPort.baudRate);
}

function readSerialData(data) {
  //console.log(data);
  //connection.onopen = () => {
    var r1 = "kandana,"+data;
    connection.send(r1)
  //}

  connection.onerror = (error) => {
    console.log(`WebSocket error: ${error}`)
  }

  connection.onmessage = (e) => {
    console.log(e.data)
  }
}

function showPortClose() {
  console.log('port closed.');
}

function showError(error) {
  console.log('Serial port error: ' + error);
}

// ------------------------ Server function
function sendData(request) {
  // print out the fact that a client HTTP request came in to the server:
  console.log("Got a client request, sending them the data.");
  // respond to the client request with the latest serial string:
  //request.respond(serialData);
}
