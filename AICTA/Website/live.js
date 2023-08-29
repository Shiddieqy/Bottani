

const { spawn } = require('child_process');
let pythonProcess;

const path = require("path")
const express = require('express');
const live = express.Router();
const port = 3000;
const bodyParser = require('body-parser'); // Import body-parser
const fs = require("fs")
live.use(express.json({ limit: '10mb' })); // Enable JSON parsing with a 10MB limit
const sensorsData = require('./bedengan');


function runOpenCvPythonScript(){
    // Start the Python script as a child process
    pythonProcess = spawn('python', ['object-tracking.py']);

    // Log Python script output
    pythonProcess.stdout.on('data', (data) => {
    console.log(`Python Output: ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
    console.error(`Python Error: ${data}`);
    });
}

function stopOpenCvPythonScript(){
    if(pythonProcess){
        pythonProcess.kill();
    }
}



// Serve static files from the "public" directory
live.use(express.static('public'));
live.use(bodyParser.raw({ type: 'image/jpeg', limit: '10mb' }));
var urlencodedParser = bodyParser.urlencoded({ extended: false })



live.post("/",
    bodyParser.raw({type: ["image/jpeg", "image/png"], limit: "5mb"}),
    (req, res) => {
    try {
        fs.writeFile("public/image.jpeg", req.body, (error) => {
        if (error) {
            throw error;
        }
        });

        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500);
    }
});


// Route to render the main page
live.get('/', (req, res) => {
    res.render('live-stream');
  });



// Endpoint to serve the latest image data
live.get('/latest-image', (req, res) => {
    const imagePath = path.join(__dirname, 'public', 'image.jpeg');

    fs.readFile(imagePath, (err, data) => {
        if (err) {
            res.status(404).send('No image data available.');
        } else {
            res.setHeader('Content-Type', 'image/jpeg');
            res.send(data);
        }
    });
});

live.post("/",
    bodyParser.raw({type: ["image/jpeg", "image/png"], limit: "5mb"}),
    (req, res) => {
    try {
        fs.writeFile("public/image.jpeg", req.body, (error) => {
        if (error) {
            throw error;
        }
        });

        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500);
    }
});

live.get("/start-streaming", (req, res) =>{
    runOpenCvPythonScript();
    res.redirect("/")
})

live.get("/stop-streaming", (req, res)=>{
    stopOpenCvPythonScript();
    const imagePath = path.join(__dirname, 'public', 'image.jpeg');

    res.redirect("/")
    
})


module.exports = live;