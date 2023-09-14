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

function parseData(data){
    console.log("parsing data")

    // console.log("data: ", data)
    bedenganId = Object.keys(data)
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
            borderWidth: 1  
        })
        moistureDatasets.push({
            label: `bedengan ${i+1}`,
            data: moistureDataset,
            borderWidth: 1
        })
        pHdatasets.push({
            label: `bedengan ${i+1}`,
            data: pHdataset,
            borderWidth: 1
        })
        dates.push(date)
    }
    console.log(moistureDatasets)


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

function plot(plotName, datasets){



    chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: labels,
        datasets: datasets
    },
    options: {

        plugins: {
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
            beginAtZero: true
        }
        },

        },
    

    });

    const titleChartId = document.getElementById(`collection-chart-title`.toLowerCase());
    titleChartId.innerHTML = plotName

    chart.options.animation = false; // disables all animations
    chart.options.animations.colors = false; // disables animation defined by the collection of 'colors' properties
    chart.options.animations.x = false; // disables animation defined by the 'x' property
    chart.options.transitions.active.animation.duration = 0; // disables the animation for 'active' mode

    $(`#show-all-chart-button`.toLowerCase()).click(function() {
        for(let i=0; i<datasets.length;i++){
            chart.show(i)
            chart.options.plugins.legend.hidden = false;
        }        
      chart.update();
    });
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

Chart.defaults.backgroundColor = '#9BD0F5';
Chart.defaults.color = '#FFFFFF';

const dropdownButton = document.querySelector('.dropdown-toggle');
const dropdownOptions = document.querySelector('.dropdown-menu');

dropdownButton.innerHTML = menu




dropdownOptions.addEventListener('click', (e) => {
if(e.target.tagName === 'A'){
    e.preventDefault()
    const selectedItem = e.target.textContent;
    menu = selectedItem
    chart.destroy()
    plot(menu, datasets[menu])
    dropdownButton.innerHTML = menu

}
});