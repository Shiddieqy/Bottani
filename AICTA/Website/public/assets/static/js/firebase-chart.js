var bedenganId;
var bedenganIdDiv;

let moistureData = []
let temperatureData = []
let pHData = []
let dates = []
let dataset = []

let chart

document.addEventListener('DOMContentLoaded', function() {
    bedenganIdDiv = document.getElementById('bedengan-id');
    bedenganId = parseInt(bedenganIdDiv.getAttribute('bedenganId'));

    getFirebaseData(bedenganId)
    .then((data)=>{dataset = parseData(data)})
    .then(()=>{
        plot(dates, dataset[menu])
        
    })
});

function parseData(data){
    for(let i=0; i<data.length; i++){  
        temperatureData.push    (data[i].Temperature)
        moistureData.push       (data[i].Moisture)
        pHData.push             (data[i].pH)
        dates.push              (data[i].date)
    }
    dataset = {
        "Temperature": temperatureData,
        "Moisture": moistureData,
        "pH": pHData

    }
    return dataset
}


async function getFirebaseData(bedenganId){
    const data = await fetch(`/api/firebase/${bedenganId}`)
        .then(res=>res.json())
    return data
}



function plot(dates, data){
    const chartTitleElement = document.getElementById("chart-title")
    chartTitleElement.textContent = menu

    let suggestedMin = Math.min(...data)
    let suggestedMax = Math.max(...data)
    let range = suggestedMax-suggestedMin
    suggestedMin = suggestedMin - range
    suggestedMax = suggestedMax + range
    console.log(data)
    console.log(suggestedMin, suggestedMax)
    const ctx = document.getElementById("chart").getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                data: data,
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

menu = "Temperature"
// Using tabs to select chart
const myTabs = document.getElementById("myTabs")
myTabs.addEventListener('click', function(event) {
    event.preventDefault()
    const selectedItem = event.target.textContent;
    menu = selectedItem
    console.log("menu", menu)
    chart.destroy()
    plot(dates, dataset[menu])

    // add active class
    const navLinks = document.querySelectorAll(".nav-link")
    for(let i=0; i<navLinks.length; i++){
        navLinks[i].classList.remove("active")
    }
    event.target.classList.add("active")

})
Chart.defaults.color = '#FFFFFF';

