const THREE = require('three')
const toRad = THREE.Math.degToRad

const update = (options) => {
    var walipini = options.walipini
    walipini.roof.topHeight = walipini.wall.frontHeight + walipini.roof.topDistance
    walipini.height = walipini.dig.depth + walipini.roof.topHeight
    walipini.roof.frontWindow = frontWindow(walipini, options.winterSolsticeElevation)
    walipini.roof.backWindow = backWindow(walipini, options.winterSolsticeElevation)
    console.log(options)
    return options
}

const frontWindow = (walipini, wsElevation) => {
    const fwh = frontWindowHeight(walipini, wsElevation)
    const fwp = frontWindowProjection(walipini, wsElevation)

    return {
        width: walipini.length + walipini.wall.thickness * 2,
        height: walipini.roof.beam.height,
        length: fwh,

        translate: {
            x: walipini.width / 2 + walipini.wall.thickness - fwp / 2,
            y: roofHeight(walipini) - (fwh * Math.cos(wsElevation) /2),
            z: 0
        },

        rotate: {
            x: toRad(wsElevation+90),
            y: toRad(90),
            z: 0

        }
    }
}

const backWindow = (walipini, wsElevation) => {
    const fwp = frontWindowProjection(walipini, wsElevation)
    const bwp = walipini.width + walipini.wall.thickness * 2 - fwp
    const bwh = bwp / Math.cos(toRad(wsElevation))

    return {
        width: walipini.length + walipini.wall.thickness * 2,
        height: walipini.roof.beam.height,
        length: bwh,

        translate: {
            x: -(walipini.width / 2 + walipini.wall.thickness) + bwp / 2,
            y: roofHeight(walipini) - (bwh * Math.sin(toRad(wsElevation)) /2),
            z: 0
        },

        rotate: {
            x: toRad(wsElevation),
            y: toRad(90),
            z: 0
        }
    }
}

const frontWindowProjection = (walipini, wsElevation) =>
    frontWindowHeight(walipini, wsElevation) * Math.sin(toRad(wsElevation))

const frontWindowHeight = (walipini, wsElevation) =>
    (roofHeight(walipini) - walipini.wall.frontHeight) / Math.cos(wsElevation)

const roofHeight = (walipini) => walipini.height - walipini.dig.depth

module.exports = {
    update: update
}
