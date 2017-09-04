const THREE = require('three')
const extrude = require('./geometry').extrude

const create = (options) => {
    const result = new THREE.Object3D()

    result.add(createFrontWindow(options))
    result.add(createBackWindow(options))
    result.add(createBeams(options))
    result.rotateY(THREE.Math.degToRad(- options.walipini.orientation))

    return result
}

/**
  * Create the front window    
  */
const createFrontWindow = (options) => {
    const kps = options.walipini.kps
    const roof = options.walipini.roof
    const wallThickness = options.walipini.wall.thickness
    const vertices = [kps.FWLTM, kps.FWLTE, kps.RTOP, kps.SWLRT, kps.FWLTM]
    const length = options.walipini.length + wallThickness * 2

    const windowGeometry = extrude(vertices, length)
    windowGeometry.translate(0, 0, - length / 2)
    let frontWindow = new THREE.Mesh(windowGeometry)

    frontWindow.material = new THREE.MeshLambertMaterial({
        color: roof.frontWindow.color,
        transparent: roof.frontWindow.transparent,
        opacity: roof.frontWindow.opacity
    })
    frontWindow.castShadow = roof.frontWindow.castShadow

    return frontWindow
}

/**
  * Create the back window
  */
const createBackWindow = (options) => {
    const kps = options.walipini.kps
    const roof = options.walipini.roof
    const wallThickness = options.walipini.wall.thickness
    const vertices = [kps.BWLTE, kps.SWLRT, kps.RTOP, kps.BWBT, kps.BWLTE]
    const length = options.walipini.length + wallThickness * 2

    const backWindowGeometry = extrude(vertices, length)
    backWindowGeometry.translate(0, 0, - length / 2)
    let backWindow = new THREE.Mesh(backWindowGeometry)

    backWindow.material = new THREE.MeshLambertMaterial({
        color: roof.backWindow.color,
        transparent: roof.backWindow.transparent,
        opacity: roof.backWindow.opacity
    })
    backWindow.castShadow = roof.backWindow.castShadow

    return backWindow
}

const createBeams = (options) => {
    const roof = options.walipini.roof
    const fullLength = roof.frontWindow.width - roof.beam.width
    const beamdistance = fullLength / roof.beam.numBeams
    const allBeams = new THREE.Object3D()
    const trans = - (fullLength + roof.beam.width) / 2
    const fullBeam = createFullBeam(options)

    for(var b = 0; b <= roof.beam.numBeams; b++) {
        let clone = fullBeam.clone(true)
        clone.translateZ(trans + b * beamdistance)
        allBeams.add(clone)
    }

    return allBeams
}

const createFullBeam = (options) => {
    const fullBeam = new THREE.Object3D()

    fullBeam.add(createFrontBeam(options))
    fullBeam.add(createBackBeam(options))
    fullBeam.translateY(-0.005)

    return fullBeam
}

const createBackBeam = (options) => {
    const kps = options.walipini.kps
    const roof = options.walipini.roof
    const beamWidth = roof.beam.width
    const vertices = [kps.BWLTE, kps.SWLRT, kps.RTOP, kps.BWBT, kps.BWLTE]

    const backBeamGeometry = extrude(vertices, beamWidth)
    let backBeam = new THREE.Mesh(backBeamGeometry)

    backBeam.material = new THREE.MeshLambertMaterial({
        color: 'sienna',
        transparent: false
    })
    backBeam.castShadow = true

    return backBeam
}

const createFrontBeam = (options) => {
    const kps = options.walipini.kps
    const roof = options.walipini.roof
    const beamWidth = roof.beam.width
    const vertices = [kps.FWLTM, kps.FWLTE, kps.RTOP, kps.SWLRT, kps.FWLTM]

    const frontBeamGeometry = extrude(vertices, beamWidth)
    let frontBeam = new THREE.Mesh(frontBeamGeometry)

    frontBeam.material = new THREE.MeshLambertMaterial({
        color: 'sienna',
        transparent: false
    })
    frontBeam.castShadow = true

    return frontBeam
}

module.exports = {
    create: create
}
