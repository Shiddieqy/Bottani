
const path = require("path")
const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser'); // Import body-parser
const fs = require("fs")

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Serve static files from the "public" directory
app.use(express.static('public'));
app.use(bodyParser.raw({ type: 'image/jpeg', limit: '10mb' }));
var urlencodedParser = bodyParser.urlencoded({ extended: false })
const bedenganData = require('./bedengan');
const liveRouter = require('./live');

// Use the liveRouter for all /live routes
app.use('/live', liveRouter);

app.locals.bedengan = bedenganData;


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

app.get("/api/bedengan", (req, res) => {
    console.table(bedenganData)

    res.json(bedenganData);
})

app.get("/api/bedengan/watering", (req, res) => {
    let i = parseInt(req.query.i) - 1;
    let j = parseInt(req.query.j);
    bedenganData[i].watered.push(j);
    res.json(bedenganData);
}); 

// let ipAddress = require("ip").address()
// app.listen(port, ipAddress, () => {
//   console.log(`Server is running on http://${ipAddress}:${port}`);
// });



app.listen(port, ()=>{
    console.log(`Server is running on http://localhost:${port}`)
})


