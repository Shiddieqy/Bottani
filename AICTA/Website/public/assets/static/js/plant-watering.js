let bedenganData = {}
async function fetchPlantWateringQuery(i, j, isWatered){
    console.log("fetching from plant-watering.js")
    bedenganData = await fetch(`/api/bedengan/watering/?i=${i}&j=${j}&isWatered=${isWatered}`)
    .then(res => res.json())
}


async function run() {
    bedenganData = await fetch("/api/bedengan")
        .then(res => res.json())

    let idx = 0
    let jdx = 0


    const buttonContainer = document.getElementById("button-container")

    // Add a click event listener to the container


    buttonContainer.addEventListener('click', function(event) {
        // Check if the clicked element is a button with an id starting with "button-"
        if (event.target && event.target.id) {
            // The button was clicked, and you can access its ID like this:
            const buttonId = event.target.id;
            // console.log(`Button with ID ${buttonId} was clicked.`);
            const plantElement = document.getElementById(buttonId)

  
            const numbers = buttonId.match(/\d+/g);

            let i,j
            if (numbers && numbers.length === 2) {
                i = parseInt(numbers[0], 10);
                j = parseInt(numbers[1], 10);
                // console.log(i,j)
                
            } else {
                console.log("Invalid input format");
            }

            if(plantElement.matches('.btn-secondary')){
                plantElement.classList.remove("btn-secondary")
                plantElement.classList.add("btn-success")  
            }
            else if(plantElement.matches('.btn-success')){
                plantElement.classList.remove("btn-success")
                plantElement.classList.add("btn-secondary")
            }

            fetchPlantWateringQuery(i, j, plantElement.matches('.btn-success'))
        }
    });

}


function waterPlant(bedenganData) {
    // console.table(bedenganData)

    for(let i=0; i<bedenganData.length; i++){
        for(let j=0; j<bedenganData[i].plantCount; j++){
            if(bedenganData[i].watered.includes(j)){
                const plantElement = document.getElementById(`Bedengan ${i+1}-${j}`)
                plantElement.classList.remove("btn-secondary")
                plantElement.classList.add("btn-success")
            }
            
        }
    }
}


run().then(
    ()=>{waterPlant(bedenganData)}
);

