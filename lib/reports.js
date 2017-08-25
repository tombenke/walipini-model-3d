//const THREE = require('three')
//const toRad = THREE.Math.degToRad

const make = (options) => ({
    volumes: {
        dig: {
            soil: 0,
            underSoil: 0,
            staircase: 0,
            totals: 0
        },
        walls: {
            front: 0,
            back: 0,
            sides: 0,
            totals: 0
        },
        totals: 0
    },
    surfaces: {
        roof: {
            frontWindow: 0,
            backWindow: 0,
            totals: 0
        },
        building: {
            internal: 0,
            walls: 0,
            totals: 0
       }
    }
})

module.exports = {
    make: make
}
