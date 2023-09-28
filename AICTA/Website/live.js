const { spawn } = require('child_process');
const sharp = require("sharp")
let pythonProcess;

const path = require("path")
const express = require('express');
const live = express.Router();
const port = 3000;
const bodyParser = require('body-parser'); // Import body-parser
const fs = require("fs")



live.use(express.json({ limit: '10mb' })); // Enable JSON parsing with a 10MB limit
const sensorsData = require('./bedengan');
const which = require("which")
// Serve the Socket.io client script
live.use('/socket.io', express.static(__dirname + '/node_modules/socket.io-client/dist'));

function runOpenCvPythonScript(){
    console.log("running python script")

    // Start the Python script as a child process
    pythonProcess = spawn('python3', ['object-tracking.py']);

    // Log Python script    output
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
    (req, res) => 
    {
        // console.log(req.body)
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
    }
);


// Route to render the main page
live.get('/', (req, res) => {
    res.render('live-stream');
});

// Endpoint to serve the latest image data
live.get('/latest-image', (req, res) => {
    const imagePath = path.join(__dirname, 'public', 'image.jpeg');
    const startingScreenPath = path.join(__dirname, 'public', 'starting-screen.jpeg')
    const startingScreenResizedPath = path.join(__dirname, 'public', 'starting-screen-resized.jpeg')
    if(fs.existsSync(imagePath)){
        fs.readFile(imagePath, (err, data) => {
            if (err) {
                console.log("no latest image")
            } 
            else {

                res.setHeader('Content-Type', 'image/jpeg');
                res.send(data);
            }
        });
    }
    else{
        if(!fs.existsSync(startingScreenResizedPath)){
            console.log("resizing")
            let inputFile = startingScreenPath
            let outputFile = startingScreenResizedPath

            sharp(inputFile).resize({ height: 200 }).toFile(outputFile)
            .then(function(newFileInfo) {
                // newFileInfo holds the output file properties
                console.log("Success")
            })
            .catch(function(err) {
                console.log("Error occured");
            });
        }
        fs.readFile(startingScreenResizedPath, (err, data) => {
            if (err) {
                console.log(err)
                
            } else {
                res.setHeader('Content-Type', 'image/jpeg');
                res.send(data);
            }
        });
    }
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
    const imagePath = path.join(__dirname, 'public', 'image.jpeg');

    if(fs.existsSync(imagePath)){
        fs.unlink(imagePath, (err) => {
            if (err) {
              console.error(err)
              return
            }
          console.log("image.jpeg deleted")
        })
    }
    else{
        console.log("image.jpeg doesn't exist")
    }
})

live.get("/stop-streaming", (req, res)=>{
    stopOpenCvPythonScript();
    res.redirect("/")
    const imagePath = path.join(__dirname, 'public', 'image.jpeg');
    

    if(fs.existsSync(imagePath)){
        fs.unlink(imagePath, (err) => {
            if (err) {
              console.error(err)
              return
            }
          console.log("image.jpeg deleted")
        })
    }
    else{
        console.log("image.jpeg doesn't exist")
    }
})


module.exports = live;