var bedenganId;
var bedenganIdDiv;

let moistureData = []
let temperatureData = []
let pHData = []
let dates = []


document.addEventListener('DOMContentLoaded', function() {
    bedenganIdDiv = document.getElementById('bedengan-id');
    bedenganId = parseInt(bedenganIdDiv.getAttribute('bedenganId'));

    getFirebaseData(bedenganId)
    .then((data)=>{temperatureData, moistureData, pHData, dates = parseData(data)})
    .then(()=>{
        plot(dates, moistureData, "moisture-chart", "#e7717d")
        plot(dates, temperatureData, "temperature-chart", "#7e685a")
        plot(dates, pHData, "pH-chart", "#afd275")
    })
});

function parseData(data){
    for(let i=0; i<data.length; i++){  
        temperatureData.push    (data[i].Temperature)
        moistureData.push       (data[i].Moisture)
        pHData.push             (data[i].pH)
        dates.push              (data[i].date)
    }

    return temperatureData, moistureData, pHData, dates
}


async function getFirebaseData(bedenganId){
    const data = await fetch(`/api/firebase/${bedenganId}`)
        .then(res=>res.json())
    return data
}



function plot(dates, data, chartId, color){
    let suggestedMin = Math.min(...data)
    let suggestedMax = Math.max(...data)
    let range = suggestedMax-suggestedMin
    suggestedMin = suggestedMin - range/10
    suggestedMax = suggestedMax + range/10
    console.log(data)
    console.log(suggestedMin, suggestedMax)
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
                    min: suggestedMin,   // Set the minimum value for the y-axis
                    max: suggestedMax,  // Set the maximum value for the y-axis
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

