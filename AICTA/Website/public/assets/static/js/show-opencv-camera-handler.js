const videoElement = document.getElementById('videoElement');
const canvasElement = document.getElementById('canvasElement');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
let stream;
let pythonProcess;
var intervalID
// Draw object detection annotations on canvas
function drawAnnotations(imageData) {
    console.log("menggambar")
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

async function getLatestImage(){
    const imgData = await fetch('/live/latest-image')
                        .then(response => response.arrayBuffer())
    return imgData
}

// Update canvas with annotations when new image is received
async function updateCanvas() {
    canvasElement.style.display = 'block';
    getLatestImage().then(data => drawAnnotations(data))
        
}

function hideCanvas(){
    const ctx = canvasElement.getContext('2d');
    canvasElement.style.display = 'none';
    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height)
}

function startStream(){
    console.log("starting stream")
    fetch('/live/start-streaming')
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
    intervalID = setInterval(updateCanvas, 100);
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