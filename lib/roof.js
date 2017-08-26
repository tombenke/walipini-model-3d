const THREE = require('three')

const create = (options) => {
    const roof = options.walipini.roof
    const result = new THREE.Object3D()

    result.add(createFrontWindow(roof))
    result.add(createBackWindow(roof))
    result.add(createBeams(roof))

    return result
}

/**
  * Create the front window    
  */
const createFrontWindow = (roof) => {
    const frontWindow = new THREE.Mesh(new THREE.BoxGeometry(roof.frontWindow.width, roof.frontWindow.height, roof.frontWindow.length))
    frontWindow.rotateY(-roof.frontWindow.rotate.y)
    frontWindow.rotateX(roof.frontWindow.rotate.x)
    frontWindow.position.set(roof.frontWindow.translate.x-roof.frontWindow.height/2, roof.frontWindow.translate.y, roof.frontWindow.translate.z)
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
const createBackWindow = (roof) => {
    const backWindow = new THREE.Mesh(new THREE.BoxGeometry(roof.backWindow.width, roof.backWindow.height, roof.backWindow.length))
    backWindow.rotateY(-roof.backWindow.rotate.y)
    backWindow.rotateX(roof.backWindow.rotate.x)
    backWindow.position.set(roof.backWindow.translate.x, roof.backWindow.translate.y, roof.backWindow.translate.z)
    backWindow.material = new THREE.MeshLambertMaterial({
        color: roof.backWindow.color,
        transparent: roof.backWindow.transparent,
        opacity: roof.backWindow.opacity
    })
    backWindow.castShadow = roof.backWindow.castShadow

    return backWindow
}

const createBeams = (roof) => {
    const fullLength = roof.frontWindow.width
    const beamdistance = fullLength / roof.beam.numBeams
    const allBeams = new THREE.Object3D()
    const trans = - fullLength / 2
    const fullBeam = createFullBeam(roof)

    for(var b = 0; b <= roof.beam.numBeams; b++) {
        let clone = fullBeam.clone(true)
        clone.translateZ(trans + b * beamdistance)
        allBeams.add(clone)
    }

    return allBeams
}

const createFullBeam = (roof) => {
    const fullBeam = new THREE.Object3D()

    fullBeam.add(createFrontBeam(roof))
    fullBeam.add(createBackBeam(roof))

    return fullBeam
}

const createFrontBeam = (roof) => {
    const frontWindow = roof.frontWindow
    const beamLength = roof.frontWindow.length
    const frontBeam = new THREE.Mesh(new THREE.BoxGeometry(beamLength, roof.beam.height, roof.beam.width))
    frontBeam.rotateZ(roof.frontWindow.rotate.x)
    frontBeam.position.set(frontWindow.translate.x - frontWindow.height/2, frontWindow.translate.y, frontWindow.translate.z)
    frontBeam.material = new THREE.MeshLambertMaterial({
        color: 'brown',
        transparent: false
    })
    frontBeam.castShadow = true

    return frontBeam
}

const createBackBeam = (roof) => {
    const backWindow = roof.backWindow
    const beamLength = roof.backWindow.length
    const backBeam = new THREE.Mesh(new THREE.BoxGeometry(beamLength, roof.beam.height, roof.beam.width))
    backBeam.rotateZ(roof.backWindow.rotate.x)
    backBeam.position.set(backWindow.translate.x - backWindow.height/2, backWindow.translate.y, backWindow.translate.z)
    backBeam.material = new THREE.MeshLambertMaterial({
        color: 'brown',
        transparent: false
    })
    backBeam.castShadow = true

    return backBeam
}

module.exports = {
    create: create
}
