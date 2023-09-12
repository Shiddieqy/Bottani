var bedenganId;
var bedenganIdDiv;

let moistureData, temperatureData, pHData, dates


document.addEventListener('DOMContentLoaded', function() {
    bedenganIdDiv = document.getElementById('bedengan-id');
    bedenganId = parseInt(bedenganIdDiv.getAttribute('bedenganId'));

    getFirebaseData(bedenganId)
    .then(()=>{
        plot(dates, moistureData, "moisture-chart", "#e7717d")
        plot(dates, temperatureData, "temperature-chart", "#7e685a")
        plot(dates, pHData, "pH-chart", "#afd275")
    })
});

function parseFirebaseData(data){
    dates = Object.keys(data)
    moistureData = Object.values(data).map((value)=>{return parseFloat(value.Moisture)})
    temperatureData = Object.values(data).map((value)=>{return parseFloat(value.Temperature)})
    pHData = Object.values(data).map((value)=>{return parseFloat(value.pH)})

    // Create an array of objects with date and data values
    const dataWithDates = dates.map((date, index) => ({
        date,
        moisture: moistureData[index],
        temperature: temperatureData[index],
        pH: pHData[index]
    }));
  
    // Sort the array of objects based on dates
    dataWithDates.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Extract sorted data arrays
    dates = dataWithDates.map((item) => item.date);
    moistureData = dataWithDates.map((item) => item.moisture);
    temperatureData = dataWithDates.map((item) => item.temperature);
    pHData = dataWithDates.map((item) => item.pH);
    return dates, moistureData, temperatureData, pHData
}

async function getFirebaseData(bedenganId){
    const data = await fetch(`/api/firebase/${bedenganId}`)
        .then(res=>res.json())
    // const dates = Object.keys(data).map((key)=>{return new Date(key)})

    dates, moistureData, temperatureData, pHData = parseFirebaseData(data)
}

function plot(dates, data, chartId, color){
    const ctx = document.getElementById(chartId).getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                data: data,
                borderColor: color,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins:{
                legend:{
                    display:false,
                }
            }
        }
    });
}

