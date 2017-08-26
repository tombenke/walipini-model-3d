const THREE = require('three')
const toRad = THREE.Math.degToRad

const update = (options) => {
    const walipini = options.walipini
    const wsElevation = options.winterSolsticeElevation

    walipini.roof.topHeight = walipini.wall.frontHeight + walipini.roof.topDistance
    walipini.height = walipini.dig.depth + walipini.roof.topHeight
    walipini.roof.frontWindow = frontWindow(walipini, wsElevation)
    walipini.roof.backWindow = backWindow(walipini, wsElevation)
    walipini.roof.beam.numBeams = numBeams(walipini)
    walipini.kps = kps(options)
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

const kps = (options) => {
    const walipini = options.walipini
    const wsElevation = options.winterSolsticeElevation

    // Roof Top
    const RTH = new THREE.Vector2(walipini.width / 2 + walipini.wall.thickness - walipini.roof.topDistance * Math.tan(toRad(wsElevation)),
        walipini.wall.frontHeight + walipini.roof.topDistance)
    const RTL = new THREE.Vector2(RTH.x + walipini.roof.beam.height * Math.sin(toRad(wsElevation)),
        RTH.y - walipini.roof.beam.height * Math.cos(toRad(wsElevation)))

    // Front Wall
    const FWLBI = new THREE.Vector2(walipini.width / 2, 0)
    const FWLBE = new THREE.Vector2(walipini.width / 2 + walipini.wall.thickness, 0)
    const FWLTE = new THREE.Vector2(FWLBE.x, walipini.wall.frontHeight)
    const FWLTI = new THREE.Vector2(FWLBI.x, Math.max(0, walipini.wall.frontHeight - walipini.wall.thickness * Math.tan(toRad(wsElevation))))
    const FWLTM = new THREE.Vector2(FWLTE.x - Math.cos(toRad(wsElevation)) * walipini.roof.beam.height,
        Math.max(walipini.wall.frontHeight - Math.sin(toRad(wsElevation)) * walipini.roof.beam.height, 0))
    
    // Back Wall
    const BWLBE = new THREE.Vector2(-(walipini.width / 2 + walipini.wall.thickness), 0)
    const BWLTE = new THREE.Vector2(BWLBE.x, walipini.wall.backHeight /*BWLTI_y - walipini.wall.thickness * ((RTL_y - BWLTI_y) / (RTL_x - BWLTI_x))*/)
    const BWLTI = new THREE.Vector2(-walipini.width / 2, walipini.wall.backHeight)
    const BWLBI = new THREE.Vector2(BWLTI.x, 0)

    // Side Wall
    const SWLBB = new THREE.Vector2(-walipini.door.width / 2, 0)
    const SWLBF = new THREE.Vector2(walipini.door.width / 2, 0)
    const SWLDB = new THREE.Vector2(SWLBB.x, walipini.door.height - walipini.dig.depth)
    const SWLDF = new THREE.Vector2(SWLBF.x, walipini.door.height - walipini.dig.depth)
    const SWLRT = new THREE.Vector2(RTL.x, RTL.y) // TODO

    // Pit bottom
    const WPBB = new THREE.Vector2(-walipini.width / 2, - walipini.dig.depth)
    const WPBF = new THREE.Vector2(walipini.width / 2, - walipini.dig.depth)

    return {
        RTH: RTH,
        RTL: RTL,

        // Front Wall
        FWLBI: FWLBI,
        FWLBE: FWLBE,
        FWLTE: FWLTE,
        FWLTI: FWLTI,
        FWLTM: FWLTM,

        // Back Wall
        BWLBE: BWLBE,
        BWLTE: BWLTE,
        BWLTI: BWLTI,
        BWLBI: BWLBI,

        // Side Wall
        SWLBB: SWLBB,
        SWLBF: SWLBF,
        SWLDB: SWLDB,
        SWLDF: SWLDF,
        SWLRT: SWLRT,

        // Pit bottom
        WPBB: WPBB,
        WPBF: WPBF
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

const numBeams = (walipini) =>
    Math.ceil((walipini.length + walipini.wall.thickness * 2) / walipini.roof.beam.maxDistance + 1)

module.exports = {
    update: update
}
