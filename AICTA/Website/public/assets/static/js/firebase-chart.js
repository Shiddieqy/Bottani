// Inisialisasi Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDKLYQtt57t2TjhsmshGTE7WXbzfHfkeKE",
    authDomain: "https://robot-bottani-default-rtdb.firebaseio.com/",
    databaseURL: "https://elevarm-iot-default-rtdb.firebaseio.com",
    projectId: "elevarm-iot",
    storageBucket: "elevarm-iot.appspot.com",
    messagingSenderId: "520673413997",
    appId: "1:520673413997:web:afe467d1aee25e93f7e864"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const sensorRef = database.ref("sensor");

// Membuat chart untuk suhu
const tempChartCtx = document.getElementById("temperature-chart").getContext("2d");
const tempChart = new Chart(tempChartCtx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Temperature',
            data: [],
            borderColor: 'red',
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
        }
    }
});

// Membuat chart untuk kelembaban
const humidityChartCtx = document.getElementById("humidity-chart").getContext("2d");
const humidityChart = new Chart(humidityChartCtx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Humidity',
            data: [],
            borderColor: 'blue',
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
        }
    }
});

// Membuat chart untuk kelembaban tanah
const soilMoistureChartCtx = document.getElementById("soil-mosture-chart").getContext("2d");
const soilMoistureChart = new Chart(soilMoistureChartCtx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Soil Moisture',
            data: [],
            borderColor: 'green',
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
        }
    }
});
// let interval = 1000 * 60 * 60 * 24 / 2; // 12 jam
let interval = 1000
// Mendapatkan data dari Firebase dan memperbarui chart
setInterval(() => {
    sensorRef.once('value', (snapshot) => {
        const sensorData = snapshot.val();
        const waktuSekarang = new Date().toLocaleDateString();

        // // Memperbarui chart suhu
        tempChart.data.labels.push(waktuSekarang);
        tempChart.data.datasets[0].data.push(sensorData.temperature);

        if (tempChart.data.labels.length > 50) {
            tempChart.data.labels.shift();
            tempChart.data.datasets[0].data.shift();
        }

        tempChart.update();

        // Memperbarui chart kelembaban
        humidityChart.data.labels.push(waktuSekarang);
        humidityChart.data.datasets[0].data.push(sensorData.humidity);

        if (humidityChart.data.labels.length > 50) {
            humidityChart.data.labels.shift();
            humidityChart.data.datasets[0].data.shift();
        }

        humidityChart.update();

        // Memperbarui chart kelembaban tanah
        soilMoistureChart.data.labels.push(waktuSekarang);
        soilMoistureChart.data.datasets[0].data.push(sensorData.soil_moisture);

        if (soilMoistureChart.data.labels.length > 50) {
            soilMoistureChart.data.labels.shift();
            soilMoistureChart.data.datasets[0].data.shift();
        }

        soilMoistureChart.update();
    });
}, interval);