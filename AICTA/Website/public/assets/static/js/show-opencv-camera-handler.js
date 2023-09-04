const videoElement = document.getElementById('videoElement');
const canvasElement = document.getElementById('canvasElement');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
let stream;
let pythonProcess;
var intervalID

// Draw object detection annotations on canvas
function drawAnnotations(imageData) {
    const ctx = canvasElement.getContext('2d');
    const img = new Image();
    img.onload = function () {
        canvasElement.width = img.width;
        canvasElement.height = img.height;
        ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        ctx.drawImage(img, 0, 0);
    };
    img.src = URL.createObjectURL(new Blob([imageData], { type: 'image/jpeg' }));
}

// Update canvas with annotations when new image is received
function updateCanvas() {
    canvasElement.style.display = 'block';
    fetch('/live/latest-image')
        .then(response => response.arrayBuffer())
        .then(data => drawAnnotations(data))
        .catch(error => console.error('Error fetching image:', error));
        
}

function hideCanvas(){
    canvasElement.style.display = 'none';
}

function startStream(){
    fetch('/live/start-streaming') // Replace with your server's endpoint
        .catch(error => {
            console.error('Error:', error);
        });
}

function stopStream(){
    fetch('/live/stop-streaming') // Replace with your server's endpoint
        .catch(error => {
            console.error('Error:', error);
        });
}


// Start video stream
startButton.addEventListener('click', () => {
    startStream()
    // Update the canvas periodically
    intervalID = setInterval(updateCanvas, 100); // Update every second
});

// Stop video stream
stopButton.addEventListener('click', () => {
    stopStream()
    try{  
        if(intervalID){
            clearInterval(intervalID)
        } 
        hideCanvas()
    }
    catch {
        console.error("Stop button error: " , error)
    }
});