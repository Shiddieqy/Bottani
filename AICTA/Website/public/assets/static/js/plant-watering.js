
async function run() {
    const bedenganData = await fetch("/api/bedengan")
        .then(res => res.json())

    let idx = 0
    let jdx = 0
    function waterPlant() {
        const plantElement = document.getElementById(`Bedengan ${idx + 1}-${jdx}`)
        // console.log(`Bedengan ${idx + 1}-${jdx}`)
        plantElement.classList.remove("bg-secondary")
        plantElement.classList.add("bg-success")    
        if (bedenganData[i].watered.includes(jdx)) {

        }
        jdx++
        if (jdx >= bedenganData[idx].plantCount) {
            idx++
            jdx = 0
        }
        if(idx == bedenganData.length){
            clearInterval(waterPlantIntervalId)
        }
    }
    console.table(bedenganData)

    const waterPlantIntervalId = setInterval(waterPlant, 1000)
}
run();

