const { spawn } = require('child_process');

// Start the Python script as a child process
const pythonProcess = spawn('python', ['object-tracking.py']);

// Log Python script output
pythonProcess.stdout.on('data', (data) => {
  console.log(`Python Output: ${data}`);
});

pythonProcess.stderr.on('data', (data) => {
  console.error(`Python Error: ${data}`);
});

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

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});



