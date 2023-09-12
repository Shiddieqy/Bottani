
const path = require("path")
const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser'); // Import body-parser



const bedenganData = require('./bedengan');
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



// let ipAddress = require("ip").address()
// app.listen(port, ipAddress, () => {
//   console.log(`Server is running on http://${ipAddress}:${port}`);
// });



app.listen(port, ()=>{
    console.log(`Server is running on http://localhost:${port}`)
})


