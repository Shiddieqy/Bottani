const path = require("path")
const express = require('express');
const api = express.Router();

const firebase = require('firebase/app');

const { getDatabase, ref, set, get, push } = require('firebase/database');


const firebaseConfig = {
    apiKey: "AIzaSyDsccWUW75IWCHSC1XDPPv9ui8uMM7W1iE",
    authDomain: "robot-bottani.firebaseapp.com",
    databaseURL: "https://robot-bottani-default-rtdb.firebaseio.com",
    projectId: "robot-bottani",
    storageBucket: "robot-bottani.appspot.com",
    messagingSenderId: "428137751050",
    appId: "1:428137751050:web:5fb60391f7ff8dfd65f5f3",
    measurementId: "G-6DQE95F2MD"
  };

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);

const database = getDatabase(firebaseApp)

// // Write data to the database
// const ref = database.ref('path/to/data');
// ref.set({ key: 'value' });

// // Read data from the database
// ref.once('value')
//   .then((snapshot) => {
//     const data = snapshot.val();
//     console.log('Data:', data);
//   })
//   .catch((error) => {
//     console.error('Error reading data:', error);
//   });

const bedenganData = require('./bedengan');

api.get("/bedengan", (req, res) => {

    res.json(bedenganData);
})

api.get("/bedengan/watering", (req, res) => {
    let i = parseInt(req.query.i) - 1;
    let j = parseInt(req.query.j);
    let isWatered = req.query.isWatered;
    if(!(isWatered === 'false')){
        bedenganData[i].watered.push(j);
    }
    else{
        bedenganData[i].watered = bedenganData[i].watered.filter(item => item !== j)
    }
    res.json(bedenganData);
}); 

api.get("/firebase/:bedenganId", (req, res) => {
    const bedenganId = req.params.bedenganId;
    const usersRef = ref(database, `/bedengan${bedenganId}`);
    get(usersRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
            const data = snapshot.val();
            console.log('Data:', data);
            res.send(data)

            } else {
            console.log('No data available');
            res.send(null)
            }
        })
        .catch((error) => {
            console.error('Error reading data:', error);
            res.send(error)
        });
});

function getDatesBetween(startDate, endDate) {
    const currentDate = new Date(startDate.getTime());
    const dates = [];
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
}

function getDateStringFormat(date){
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
}



api.post('/firebase', (req, res) => {
    const n = 20 // Jumlah bedengan

    var today = new Date();
    var priorDate = new Date(new Date().setDate(today.getDate() - 30));
    
    const dates = getDatesBetween(priorDate, today).map(date => getDateStringFormat(date))


    const dataToWrite = {};
    
    for(let i=0; i<n;i++){
        dataToWrite[`bedengan${i+1}`] = {}
        for(let j=0; j< dates.length; j++){
            dataToWrite[`bedengan${i+1}`][dates[j]] = {
                Moisture:       (Math.random() * 3 + 6 ).toFixed(2)  ,
                Temperature:    (Math.random() * 1 + 26).toFixed(2)  ,
                pH:             (Math.random() * 1.2 + 6 ).toFixed(2)  ,
            }
        }
    }

    const dbref = ref(database, "/")

    set(dbref, dataToWrite)
    .then(() => {
        console.log('Data set successfully');
      })
    .catch((error) => {
    console.error('Error setting data:', error);
    });
    res.redirect("../")
  });

  

module.exports = api