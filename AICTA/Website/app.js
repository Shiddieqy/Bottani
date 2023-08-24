
const path = require("path")
const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser'); // Import body-parser
const fs = require("fs")
app.use(express.json({ limit: '10mb' })); // Enable JSON parsing with a 10MB limit


// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Serve static files from the "public" directory
app.use(express.static('public'));
app.use(bodyParser.raw({ type: 'image/jpeg', limit: '10mb' }));
var urlencodedParser = bodyParser.urlencoded({ extended: false })
const sensorsData = require('./sensors');
const liveRouter = require('./live');

// Use the liveRouter for all /live routes
app.use('/live', liveRouter);

app.locals.sensors = sensorsData;


// Route to render the main page
app.get('/', (req, res) => {

    res.render('index', { layout: 'layout.ejs', sensors: sensorsData });
    console.log("root")
});

app.get("/ui/chart/chartjs", (req, res) => {
    res.render('ui-chart-chartjs', { layout: 'layout.ejs' });
});


app.get("/ui/chart/chartjs/:sensorId", (req, res) => {
    const sensorId = req.params.sensorId;


    res.render('ui-chart-chartjs', { layout: 'layout.ejs', id: sensorId, sensors: sensorsData });
});

app.listen(port, () => {
  console.log(`Server is running on http://10.32.101.113:${port}`);
});



