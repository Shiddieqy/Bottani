

const ctx = document.getElementById('chart-collection');

const datasets = []

const chartTitle = "Grafik Kelembaban Tanah Setiap Bedengan"
const n = 30 //number of datasets
const m = 100 //number of data in each dataset
const randRange = 100
const meanValue = 50
const fluctuateRange = meanValue/8
const proportionOfHighFluctuationData = 0.05
const highFluctuationRange = fluctuateRange*4

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
        data.push( meanValue - highFluctuationRange/2 +  Math.random() * (highFluctuationRange+1)) 
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

$("#show-all-chart-button").click(function() {
    for(let i=0; i<m;i++){
        chart.show(i)
    }        
  chart.update();
});