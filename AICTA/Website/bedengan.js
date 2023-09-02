const bedenganData = [
    { id: '1', name: 'Bedengan 1'  , watered : []  },
    { id: '2', name: 'Bedengan 2'  , watered : []  },
    { id: '3', name: 'Bedengan 3'  , watered : []  },
    { id: '4', name: 'Bedengan 4'  , watered : []  },
    { id: '5', name: 'Bedengan 5'  , watered : []  },
    { id: '6', name: 'Bedengan 6'  , watered : []  },
    { id: '7', name: 'Bedengan 7'  , watered : []  },
    { id: '8', name: 'Bedengan 8'  , watered : []  },
    { id: '9', name: 'Bedengan 9'  , watered : []  },
    { id: '10', name: 'Bedengan 10', watered : []  },
    { id: '11', name: 'Bedengan 11', watered : []  },
    { id: '12', name: 'Bedengan 12', watered : []  },
    { id: '13', name: 'Bedengan 13', watered : []  },
    { id: '14', name: 'Bedengan 14', watered : []  },
    { id: '15', name: 'Bedengan 15', watered : []  },
    { id: '16', name: 'Bedengan 16', watered : []  },
    { id: '17', name: 'Bedengan 17', watered : []  },
    { id: '18', name: 'Bedengan 18', watered : []  },
    { id: '19', name: 'Bedengan 19', watered : []  },
    { id: '20', name: 'Bedengan 20', watered : []  }
    // Add more bedengan here
];

const maxPlantInBedengan = 20;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Random watering
// for(let i = 0; i < bedenganData.length; i++){
//     bedenganData[i].plantCount = getRandomInt(maxPlantInBedengan/2, maxPlantInBedengan);
//     bedenganData[i].watered = [];
//     for(let j = 0; j < getRandomInt(0, bedenganData[i].plantCount); j++){
//         bedenganData[i].watered.push(getRandomInt(0, bedenganData[i].plantCount-1));
//     }
// }

for(let i = 0; i < bedenganData.length; i++){
    bedenganData[i].plantCount = getRandomInt(maxPlantInBedengan/2, maxPlantInBedengan);
    if(bedenganData[i].plantCount % 2 != 0){
        bedenganData[i].plantCount++;
    }
    bedenganData[i].watered = []
        // for(let j = 0; j < bedenganData[i].plantCount; j++){
        //     bedenganData[i].watered.push(j);
        // }
}



function getRandomChance(chance) {
    // Generate a random number between 0 and 1
    const randomValue = Math.random();
    
    // Compare the random value to the chance threshold
    return randomValue < chance;
}

module.exports = bedenganData