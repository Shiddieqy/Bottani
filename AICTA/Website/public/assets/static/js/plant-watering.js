const socket = io();

  // Function to toggle and store button state
  function toggleButtonState(id) {
    const buttonElement = document.getElementById(id);
    const buttonKey = buttonElement.id;
    const isWatered = buttonElement.matches('.btn-success');

    // Update the button state
    if (isWatered) {
      buttonElement.classList.remove('btn-success');
      buttonElement.classList.add('btn-secondary');
    } else {
      buttonElement.classList.remove('btn-secondary');
      buttonElement.classList.add('btn-success');
    }

    // Send a message to the server to inform about the button state change
    const message = {
      key: buttonKey,
      isWatered: !isWatered,
    };
    socket.emit('toggle-button', message);
    localStorage.setItem(buttonKey, !isWatered);
  }

let bedenganData = {}

async function run() {
    bedenganData = await fetch("/api/bedengan")
        .then(res => res.json())
    console.log(bedenganData)
    const buttonContainer = document.getElementById("button-container")



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

            const message = {
                i: i,
                j: j,
            };

            if(plantElement.matches('.btn-secondary')){
                plantElement.classList.remove("btn-secondary")
                plantElement.classList.add("btn-success")  
                // Send a message to the server to inform about the button state change
                message.isWatered = true
                socket.emit('toggle-button', message);
            }
            else if(plantElement.matches('.btn-success')){
                plantElement.classList.remove("btn-success")
                plantElement.classList.add("btn-secondary")
                message.isWatered = false
                socket.emit('toggle-button', message);
            }

            // fetchPlantWateringQuery(i, j, plantElement.matches('.btn-success'))
 
        }
    });
    socket.on('connect', () => {
        console.log('Connected to the server');
      });
      
      socket.on('error', (error) => {
        console.error('Socket.IO Error:', error);
      });
    socket.on('toggle-button', (message) => {
        console.log(message)
        // Update the button state based on the message received from the server
        const id = `Bedengan ${message.i}-${message.j}`
        const plantElement = document.getElementById(id)
        if(message.isWatered){
            plantElement.classList.remove("btn-secondary")
            plantElement.classList.add("btn-success")  
            // Send a message to the server to inform about the button state change
        }
        else{
            plantElement.classList.remove("btn-success")
            plantElement.classList.add("btn-secondary")
        }
    });

}

function waterPlant(bedenganData) {
    console.table(bedenganData)

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

run()
    .then(() => waterPlant(bedenganData))

