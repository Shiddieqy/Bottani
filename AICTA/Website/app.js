
const path = require("path")
const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser'); // Import body-parser
const bedenganData = require('./bedengan');

const http = require('http');
const server = http.createServer(app);
const socketIo = require('socket.io');
const io = socketIo(server);

app.locals.bedengan = bedenganData;

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Serve static files from the "public" directory
app.use(express.static('public'));
app.use(bodyParser.raw({ type: 'image/jpeg', limit: '10mb' }));
var urlencodedParser = bodyParser.urlencoded({ extended: false })
const liveRouter = require('./live');
const apiRouter = require('./api')

// Use the liveRouter for all /live routes
app.use('/live', liveRouter);
app.use('/api', apiRouter)

// Route to render the main page
app.get('/', (req, res) => {
    res.render('index', { layout: 'layout.ejs', bedengan: bedenganData });
    console.log("root")
});

app.get("/ui/chart/chartjs", (req, res) => {
    res.render('ui-chart-chartjs', { layout: 'layout.ejs' });
});

app.get("/ui/chart/chartjs/:sensorId", (req, res) => {
    const sensorId = req.params.sensorId;
    res.render('ui-chart-chartjs', { layout: 'layout.ejs', id: sensorId, bedengan: bedenganData });
});

let ipAddress = require("ip").address()
// let ipAddress = ""
server.listen(port, ipAddress, () => {
  console.log(`Server is running on http://${ipAddress}:${port}`);
});


// Simulated localStorage for the example
const localStorage = new Map();

function setButtonState(key, state) {
  // Store the button state in "localStorage"
  localStorage.set(key, state);
}

function getButtonState(key) {
  // Retrieve the button state from "localStorage"
  return localStorage.get(key) || false;
}
const initialButtonStates = {};

// Send the initial button state to the newly connected client
for (let i = 1; i <= bedenganData.length; i++) {
    // console.log(bedenganData[i-1].plantCount)
    for(let j = 0; j < bedenganData[i-1].plantCount; j++){
        const buttonKey = `button-${i}-${j}`;
        initialButtonStates[buttonKey] = {
            key: buttonKey,
            isWatered: getButtonState(buttonKey),
        };
    }
}

// console.log(initialButtonStates)

io.on('connection', (socket) => {
    // Handle Socket.IO connections here

    for (const buttonKey in initialButtonStates) {
        socket.emit('custom-message', initialButtonStates[buttonKey]);
    }
    socket.on('toggle-button', (message) => {
    // console.log(message)
      // Broadcast the message to all connected clients
        if(!(message.isWatered === 'false')){
            bedenganData[message.i-1].watered.push(message.j);
        }
        else{
            bedenganData[message.i-1].watered = bedenganData[message.i-1].watered.filter(item => item !== message.j)
        }
        setButtonState(message.key, message.isWatered);
        io.emit('toggle-button', message);
    });
  });


// app.listen(port, ()=>{
//     console.log(`Server is running on http://localhost:${port}`)
// })