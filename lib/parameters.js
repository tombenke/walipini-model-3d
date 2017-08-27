const THREE = require('three')
const toRad = THREE.Math.degToRad

const update = (options) => {
    const walipini = options.walipini
    const wsElevation = options.winterSolsticeElevation

    walipini.roof.topHeight = walipini.wall.frontHeight + walipini.roof.topDistance
    walipini.height = walipini.dig.depth + walipini.roof.topHeight

    // Calculate reference points
    walipini.kps = kps(options)

    // Calculate windows
    walipini.roof.frontWindow = frontWindow(walipini, wsElevation)
    walipini.roof.backWindow = backWindow(walipini, wsElevation)
    walipini.roof.beam.numBeams = numBeams(walipini)
    console.log(options)
    return options
}

const kps = (options) => {
    const walipini = options.walipini
    const wsElevation = options.winterSolsticeElevation
    const walipiniInnerHeight = walipini.wall.frontHeight + walipini.roof.topDistance

    // Front Wall
    const FWLBI = new THREE.Vector2(walipini.width / 2, 0)
    const FWLBE = new THREE.Vector2(walipini.width / 2 + walipini.wall.thickness, 0)
    const FWLTE = new THREE.Vector2(FWLBE.x, walipini.wall.frontHeight)
    const FWLTI = new THREE.Vector2(FWLBI.x, Math.max(0, walipini.wall.frontHeight - walipini.wall.thickness * Math.tan(toRad(wsElevation))))
    const FWLTM = new THREE.Vector2(FWLTE.x - Math.cos(toRad(wsElevation)) * walipini.roof.beam.height,
        Math.max(walipini.wall.frontHeight - Math.sin(toRad(wsElevation)) * walipini.roof.beam.height, 0))
    
    // Side Wall
    const SWLBB = new THREE.Vector2(-walipini.door.width / 2, 0)
    const SWLBF = new THREE.Vector2(walipini.door.width / 2, 0)
    const SWLDB = new THREE.Vector2(SWLBB.x, walipini.door.height - walipini.dig.depth)
    const SWLDF = new THREE.Vector2(SWLBF.x, walipini.door.height - walipini.dig.depth)
    const SWLRT = new THREE.Vector2(FWLTM.x - (walipiniInnerHeight - FWLTM.y) * Math.tan(toRad(wsElevation)),
        walipiniInnerHeight)

    // Back Wall
    const BWLTI = new THREE.Vector2(-walipini.width / 2, walipini.wall.backHeight)
    const BWLBI = new THREE.Vector2(BWLTI.x, 0)
    const BWLBE = new THREE.Vector2(-(walipini.width / 2 + walipini.wall.thickness), 0)
    const backWindowAngleRad = Math.atan((SWLRT.y - BWLTI.y) / (SWLRT.x - BWLTI.x))
    const BWLTE = new THREE.Vector2(BWLBE.x, BWLTI.y - walipini.wall.thickness * Math.tan(backWindowAngleRad))

    // Pit bottom
    const WPBB = new THREE.Vector2(-walipini.width / 2, - walipini.dig.depth)
    const WPBF = new THREE.Vector2(walipini.width / 2, - walipini.dig.depth)

    // Roof Top
    const bwCutAngle = (90 - THREE.Math.radToDeg(backWindowAngleRad) + wsElevation) / 2
    const joinCutAngle = THREE.Math.radToDeg(backWindowAngleRad) + bwCutAngle
    const cutLength = walipini.roof.beam.height / Math.sin(toRad(bwCutAngle))
    console.log('angles: ', bwCutAngle, joinCutAngle, cutLength)
    const RTOP = new THREE.Vector2(SWLRT.x + cutLength * Math.cos(toRad(joinCutAngle)),
        SWLRT.y + cutLength * Math.sin(toRad(joinCutAngle)))
    const BWBT = new THREE.Vector2(BWLTE.x - walipini.roof.beam.height * Math.sin(backWindowAngleRad), BWLTE.y + 0.1)

    return {
        RTOP: RTOP,
        BWBT: BWBT,

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

const frontWindow = (walipini, wsElevation) => {
    const fwh = frontWindowHeight(walipini, wsElevation)
    const fwp = frontWindowProjection(walipini, wsElevation)
    const frontWindow = walipini.roof.frontWindow

    return {
        width: walipini.length + walipini.wall.thickness * 2,
        height: walipini.roof.beam.height,
        length: fwh,
        color: frontWindow.color,
        transparent: frontWindow.transparent,
        opacity: frontWindow.opacity,
        castShadow: frontWindow.castShadow,

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
    const backWindow = walipini.roof.backWindow
    const kps = walipini.kps
    const backWindowAngle = THREE.Math.radToDeg(Math.atan((kps.SWLRT.y - kps.BWLTI.y) / (kps.SWLRT.x - kps.BWLTI.x)))
    console.log('backWindowAngle: ', backWindowAngle)

    return {
        width: walipini.length + walipini.wall.thickness * 2,
        height: walipini.roof.beam.height,
        length: bwh,
        color: backWindow.color,
        transparent: backWindow.transparent,
        opacity: backWindow.opacity,
        castShadow: backWindow.castShadow,

        translate: {
            x: -(walipini.width / 2 + walipini.wall.thickness) + bwp / 2,
            y: roofHeight(walipini) - (bwh * Math.sin(toRad(wsElevation)) /2),
            z: 0
        },

        rotate: {
            x: toRad(backWindowAngle),
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
