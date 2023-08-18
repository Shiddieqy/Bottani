const { spawn } = require('child_process');
let pythonProcess;

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
const path = require("path")
const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser'); // Import body-parser
const fs = require("fs")
app.use(express.json({ limit: '10mb' })); // Enable JSON parsing with a 10MB limit


// Set up EJS as the view engine
app.set('view engine', 'ejs');

// Serve static files from the "public" directory
app.use(express.static('public'));
app.use(bodyParser.raw({ type: 'image/jpeg', limit: '10mb' }));
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// Route to render the main page
app.get('/', (req, res) => {
  res.render('index');
});

// Endpoint to serve the latest image data
app.get('/latest-image', (req, res) => {
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

app.post("/",
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

app.get("/start-streaming", (req, res) =>{
    runOpenCvPythonScript();
    res.redirect("/")
})

app.get("/stop-streaming", (req, res)=>{
    stopOpenCvPythonScript();
    res.redirect("/")
    
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});



