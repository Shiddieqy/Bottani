

const ctx = document.getElementById('chart-collection');

const datasets = []

const chartTitle = "Grafik Kelembaban Tanah Setiap Bedengan"
const n = 30 //number of datasets
const m = 100 //number of data in each dataset
const randRange = 100
const meanValue = 50
const fluctuateRange = meanValue/8
const proportionOfHighFluctuationData = 0.2
const highFluctuationRange = fluctuateRange*3

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
    return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`
}

for(let i = 0; i < n; i++){
  const data = []
  const randValue = Math.random()
  for(let i = 0; i < m; i++){
    if(randValue > (1-proportionOfHighFluctuationData)){
        data.push( meanValue - highFluctuationRange +  Math.random() * (highFluctuationRange+1)) 
    }
    else{
        data.push( meanValue - fluctuateRange +  Math.random() * (fluctuateRange+1)) 
    }
  }
  datasets.push({
    label: `Bedengan ${i+1}`,
    data: data,
    borderWidth: 1
  })
}

var today = new Date();
var priorDate = new Date(new Date().setDate(today.getDate() - 30));

const legendClickHandler = (e, legendItem, legend) => {
    const index = legendItem.datasetIndex;
    const ci = legend.chart;

    if (ci.isDatasetVisible(index == 0 ? index+1 : index-1)) {
        for(let i=0; i<ci.data.datasets.length; i++){
            console.log(i)
            if(i != index){
                ci.hide(i);
                legend.legendItems[i].hidden = true;
            }
        }
    } else {
        for(let i=0; i<ci.data.datasets.length; i++){
            if(i != index){
                ci.show(i);
                legend.legendItems[i].hidden = false;
            }
        }
        ci.show(index);
        legendItem.hidden = false;
    }
}



const chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: getDatesBetween(priorDate, today).map(date => getDateStringFormat(date)),
    datasets: datasets
  },
  options: {

    plugins: {
        title: {
            display: false,
            text: chartTitle,
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

Chart.defaults.backgroundColor = '#9BD0F5';
Chart.defaults.borderColor = '#FFFFFF';
Chart.defaults.color = '#FFFFFF';
chart.options.animation = false; // disables all animations
chart.options.animations.colors = false; // disables animation defined by the collection of 'colors' properties
chart.options.animations.x = false; // disables animation defined by the 'x' property
chart.options.transitions.active.animation.duration = 0; // disables the animation for 'active' mode
 