let labels = []
let dates = []
let temperatureDatasets = []
let pHdatasets = []
let moistureDatasets = []
let bedenganId = []
let datasets = []
let chart
let menu = "Temperature"

let ctx = document.getElementById(`collection-chart`.toLowerCase());
let legendClickHandler = (e, legendItem, legend) => {
    const index = parseInt(legendItem.datasetIndex);
    const ci = legend.chart;
    
    if(legend.legendItems[index].hidden){
        console.log("index: ", index)
        ci.show(index);
        legend.legendItems[index].hidden = false;
    }
    else{
        if (legend.legendItems.filter((dataset)=>{return dataset.hidden}).length === 0) {
            for(let i=0; i<ci.data.datasets.length; i++){
                if(i != index && !legend.legendItems[i].hidden){
                    ci.hide(i);
                    legend.legendItems[i].hidden = true;
                }
            }
        } 
        else if(legend.legendItems.filter((dataset)=>{return !dataset.hidden}).length === 1){
            for(let i=0; i<ci.data.datasets.length; i++){
                if(i != index){
                    ci.show(i);
                    legend.legendItems[i].hidden = false;
                }
            }
        }
        else{
            console.log("total hidden: ",legend.legendItems.filter((dataset)=>{return !dataset.hidden}).length)
            console.log("hiding index: ", index)
            ci.hide(index);
            legend.legendItems[index].hidden = true;
        }
    }

}
function createLinearGradientStrings(r1, g1, b1, r2, g2, b2, opacity, N) {
    const gradientStrings = [];
    
    // Calculate the step size for each color channel
    const deltaR = (r2 - r1) / (N - 1);
    const deltaG = (g2 - g1) / (N - 1);
    const deltaB = (b2 - b1) / (N - 1);
  
    // Generate the gradient strings
    for (let i = 0; i < N; i++) {
      const currentR = Math.round(r1 + i * deltaR);
      const currentG = Math.round(g1 + i * deltaG);
      const currentB = Math.round(b1 + i * deltaB);
      const gradientString = `rgba(${currentR},${currentG},${currentB},${opacity})`;
      gradientStrings.push(gradientString);
    }
  
    return gradientStrings;
  }
  

  
  
function parseData(data){
    console.log("parsing data")

    // console.log("data: ", data)
    
    bedenganId = Object.keys(data)
    const gradientColors = createLinearGradientStrings(147, 251, 157, 9, 199, 251, 0.65, bedenganId.length);
    const moistureGradientColors = createLinearGradientStrings(191, 178, 243, 248, 163, 168, 0.65, bedenganId.length);   
    const pHGradientColors = createLinearGradientStrings(248, 163, 168, 156, 220, 170, 0.65, bedenganId.length);
    console.log(gradientColors)
    for(let i=0; i<bedenganId.length; i++){
        const bedenganData = data[`bedengan${i+1}`]
        var temperatureDataset = []
        var moistureDataset = []
        var pHdataset = []
        var date = []
        for(let j=0; j<bedenganData.length; j++){
            if(bedenganData[j]){
                temperatureDataset.push(bedenganData[j].Temperature)
                moistureDataset.push(bedenganData[j].Moisture)
                pHdataset.push(bedenganData[j].pH)
                date.push(bedenganData[j].date)
            }
        }
        
        temperatureDatasets.push({
            label: `bedengan ${i+1}`,
            data: temperatureDataset,
            borderWidth: 1,
            backgroundColor: gradientColors[i],
            borderColor: gradientColors[i],

        })
        moistureDatasets.push({ 
            label: `bedengan ${i+1}`,
            data: moistureDataset,
            borderWidth: 1,
            backgroundColor: moistureGradientColors[i],
            borderColor: moistureGradientColors[i],
        })
        pHdatasets.push({
            label: `bedengan ${i+1}`,
            data: pHdataset,
            borderWidth: 1,
            backgroundColor: pHGradientColors[i],
            borderColor: pHGradientColors[i],
        })
        dates.push(date)
    }


}

async function getData(){
    const response = await fetch('/api/firebase/all');
    const data = await response.json();
    return data;
}

// Fill in data arrays for each dataset with null values for missing times
function fillDataWithNull(timeArray, data, commonLabels) {
    let filledData = [];
    let i = 0
    let j = 0
    while(i < commonLabels.length){
        if(commonLabels[i] === timeArray[j]){
            filledData.push(data[j])
            i++
            j++
        }
        else{
            filledData.push(null)
            i++
        }
    }

    // console.log(filledData)
    // console.log(commonLabels)
    // console.log(timeArray)
    return filledData;
}

function getCommonLabel(labels){
    let commonLabel = []
    let maxIndex = 0
    for(let i=0; i<labels.length; i++){
        if(labels[i].length > labels[maxIndex].length){
            maxIndex = i
        }
    }
    commonLabel = labels[maxIndex]
    return commonLabel
}

function preProcessData(dates, temperatureDatasets, MoistureDatasets, pHDatasets){
    console.log("preprocessing data")
    
    labels = getCommonLabel(dates)

    for(let i=0; i<temperatureDatasets.length; i++){ 
        temperatureDatasets[i].data = fillDataWithNull(dates[i], temperatureDatasets[i].data, labels)
        moistureDatasets[i].data = fillDataWithNull(dates[i], moistureDatasets[i].data, labels)
        pHdatasets[i].data = fillDataWithNull(dates[i], pHdatasets[i].data, labels)
    }
}

function getMinimumValueOfDatasets(datasets){
    let minimumValue = Math.min(...datasets[0]["data"])
    for(let i=0; i<datasets.length; i++){
        if(Math.min(...datasets[i]["data"]) < minimumValue){
            minimumValue = Math.min(...datasets[i]["data"])
        }
    }
    return minimumValue
}

function getMaximumValueOfDatasets(datasets){
    let maximumValue = Math.max(...datasets[0]["data"])
    for(let i=0; i<datasets.length; i++){
        if(Math.max(...datasets[i]["data"]) > maximumValue){
            maximumValue = Math.max(...datasets[i]["data"])
        }
    }
    return maximumValue
}
  
function plot(plotName, datasets){
    let suggestedMin = getMinimumValueOfDatasets(datasets) 
    let suggestedMax = getMaximumValueOfDatasets(datasets) 
    const range = suggestedMax - suggestedMin
    suggestedMin = suggestedMin - range*2
    suggestedMax = suggestedMax + range*2
    console.log(suggestedMin, suggestedMax)
    chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: labels,
        datasets: datasets,
    },
    options: {
            responsive: true,
            plugins: {
                colors:{
                    enabled: false,
                    forceOverride: true
                },
                title: {
                    display: false,
                    font: {
                        size: 16,
                    }
                },
                legend:{
                    display: true,
                    position: 'right',
                    onClick: legendClickHandler
                }
            },
            scales: {
                y: {
                    min: suggestedMin,   // Set the minimum value for the y-axis
                    max: suggestedMax,  // Set the maximum value for the y-axis
                  }
            },

        },
    

    });

    const titleChartId = document.getElementById(`collection-chart-title`.toLowerCase());

    chart.options.animation = false; // disables all animations
    chart.options.animations.colors = false; // disables animation defined by the collection of 'colors' properties
    chart.options.animations.x = false; // disables animation defined by the 'x' property
    chart.options.transitions.active.animation.duration = 0; // disables the animation for 'active' mode
}

function combineDatasets(temperatureDatasets, moistureDatasets, pHdatasets){
    let datasets = {}
    datasets["Temperature"] = temperatureDatasets
    datasets["Moisture"] = moistureDatasets
    datasets["pH"] = pHdatasets
    return datasets
}


getData()
    .then((data) => {parseData(data)})
    .then(() => {preProcessData(dates, temperatureDatasets, moistureDatasets, pHdatasets)})
    .then(() => {datasets = combineDatasets(temperatureDatasets, moistureDatasets, pHdatasets)})
    .then(()=>{plot(menu, datasets[menu])})
    
// Chart.defaults.backgroundColor = '#9BD0F5';
Chart.defaults.color = '#FFFFFF';

// Using dropdown to select chart
// const dropdownButton = document.querySelector('.dropdown-toggle');
// const dropdownOptions = document.querySelector('.dropdown-menu');

// dropdownButton.innerHTML = menu

// dropdownOptions.addEventListener('click', (e) => {
// if(e.target.tagName === 'A'){
//     e.preventDefault()
//     const selectedItem = e.target.textContent;
//     menu = selectedItem
//     chart.destroy()
//     plot(menu, datasets[menu])
//     dropdownButton.innerHTML = menu

// }
// });


// Using tabs to select chart
const myTabs = document.getElementById("myTabs")
myTabs.addEventListener('click', function(event) {
    event.preventDefault()
    const selectedItem = event.target.textContent;
    menu = selectedItem
    chart.destroy()
    plot(menu, datasets[menu])

    // add active class
    const navLinks = document.querySelectorAll(".nav-link")
    for(let i=0; i<navLinks.length; i++){
        navLinks[i].classList.remove("active")
    }
    event.target.classList.add("active")

})


window.addEventListener('resize', function(){
    chart.destroy()
    plot(menu, datasets[menu])
})

const showAllChartButton = document.getElementById(`show-all-chart-button`.toLowerCase());
showAllChartButton.addEventListener('click', function(event) {  
    for(let i=0; i<datasets[menu].length;i++){
        chart.show(i)
        chart.options.plugins.legend.hidden = false;
    }
    chart.update();
})
