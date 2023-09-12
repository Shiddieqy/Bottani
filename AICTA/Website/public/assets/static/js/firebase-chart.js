
// // Membuat chart untuk suhu

// // let interval = 1000 * 60 * 60 * 24 / 2; // 12 jam
// let interval = 1000
// // Mendapatkan data dari Firebase dan memperbarui chart
// setInterval(() => {
//     sensorRef.once('value', (snapshot) => {
//         const sensorData = snapshot.val();
//         const waktuSekarang = new Date().toLocaleDateString();

//         // // Memperbarui chart suhu
//         tempChart.data.labels.push(waktuSekarang);
//         tempChart.data.datasets[0].data.push(sensorData.temperature);

//         if (tempChart.data.labels.length > 50) {
//             tempChart.data.labels.shift();
//             tempChart.data.datasets[0].data.shift();
//         }

//         tempChart.update();

//         // Memperbarui chart kelembaban
//         humidityChart.data.labels.push(waktuSekarang);
//         humidityChart.data.datasets[0].data.push(sensorData.humidity);

//         if (humidityChart.data.labels.length > 50) {
//             humidityChart.data.labels.shift();
//             humidityChart.data.datasets[0].data.shift();
//         }

//         humidityChart.update();

//         // Memperbarui chart kelembaban tanah
//         soilMoistureChart.data.labels.push(waktuSekarang);
//         soilMoistureChart.data.datasets[0].data.push(sensorData.soil_moisture);

//         if (soilMoistureChart.data.labels.length > 50) {
//             soilMoistureChart.data.labels.shift();
//             soilMoistureChart.data.datasets[0].data.shift();
//         }

//         soilMoistureChart.update();
//     });


// }, interval);

var bedenganId;
var bedenganIdDiv;

document.addEventListener('DOMContentLoaded', function() {
    bedenganIdDiv = document.getElementById('bedengan-id');
    bedenganId = parseInt(bedenganIdDiv.getAttribute('bedenganId'));
    console.log("bedenganId: ", bedenganId)
    getFirebaseData(bedenganId)

});


async function getFirebaseData(bedenganId){
    const data = await fetch(`/api/firebase/${bedenganId}`)
        .then(res=>res.json())
    // const dates = Object.keys(data).map((key)=>{return new Date(key)})

    const dates = Object.keys(data)
    const moistureData = Object.values(data).map((value)=>{return parseFloat(value.Moisture)})
    const temperatureData = Object.values(data).map((value)=>{return parseFloat(value.Temperature)})
    const pHData = Object.values(data).map((value)=>{return parseFloat(value.pH)})

    plot(dates, moistureData, "moisture-chart", "#e7717d")
    plot(dates, temperatureData, "temperature-chart", "#7e685a")
    plot(dates, pHData, "pH-chart", "#afd275")
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

