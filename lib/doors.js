const THREE = require('three')
const extrude = require('./geometry').extrude

const create = (options) => {

    const doorDist = (options.walipini.length + options.walipini.door.thickness) / 2
    const doorFrameDist = options.walipini.length / 2
    const lintelDist = (options.walipini.length + options.walipini.wall.thickness) / 2

    const result = new THREE.Object3D()

    // Add left and right doors
    var leftDoor = createDoor(options)
    var rightDoor = leftDoor.clone(true)
    leftDoor.translateZ(-doorDist)
    rightDoor.translateZ(doorDist)

    result.add(leftDoor)
    result.add(rightDoor)

    // Add doorframe
    const leftDoorFrame = createDoorFrame(options)
    const rightDoorFrame = leftDoorFrame.clone(true)

    leftDoorFrame.translateZ(-doorFrameDist - options.walipini.wall.thickness - 0.01)
    rightDoorFrame.translateZ(doorFrameDist + 0.01)

    result.add(leftDoorFrame)
    result.add(rightDoorFrame)

    // Add lintel
    const leftLintel = createLintel(options)
    const rightLintel = leftLintel.clone(true)

    leftLintel.translateZ(-lintelDist)
    rightLintel.translateZ(lintelDist)

    result.add(leftLintel)
    result.add(rightLintel)

    result.rotateY(THREE.Math.degToRad(-options.walipini.orientation))

    return result
}

const createDoor = (options) => {
    const door = options.walipini.door
    var doorMesh = new THREE.Mesh(new THREE.BoxGeometry(door.width, door.height, door.thickness))
    doorMesh.translateY(options.walipini.door.height / 2 -options.walipini.dig.depth)
    doorMesh.receiveShadow = true
    doorMesh.castShadow = true
    doorMesh.material =  new THREE.MeshLambertMaterial({
        opacity: 0.6,
        transparent: false,
        color: door.color
    })
    return doorMesh
}

const createDoorFrame = (options) => {
    const door = options.walipini.door
    const doorWidth = options.walipini.door.width
    const frameThickness = options.walipini.door.frameThickness
    const doorTop = (options.walipini.door.height - options.walipini.dig.depth)
    const extDoorBottom = -(options.walipini.dig.depth + frameThickness)
    const intDoorBottom = -(options.walipini.dig.depth - 0.01)
    const extDist = doorWidth / 2 + frameThickness
    const intDist = doorWidth / 2 - 0.01
    const length = options.walipini.wall.thickness + 0.02

    const LBE = new THREE.Vector2(-extDist, extDoorBottom)
    const RBE = new THREE.Vector2(extDist, extDoorBottom)
    const LTE = new THREE.Vector2(-extDist, doorTop)
    const RTE = new THREE.Vector2(extDist, doorTop)
    const LBI = new THREE.Vector2(-intDist, intDoorBottom)
    const RBI = new THREE.Vector2(intDist, intDoorBottom)
    const LTI = new THREE.Vector2(-intDist, doorTop)
    const RTI = new THREE.Vector2(intDist, doorTop)

    const vertices = [LBE, RBE, RTE, RTI, RBI, LBI, LTI, LTE, LBE]
    console.log('doorFrame: ', vertices)

    var doorFrameMesh = new THREE.Mesh(extrude(vertices, length))

    doorFrameMesh.receiveShadow = true
    doorFrameMesh.castShadow = true
    doorFrameMesh.material =  new THREE.MeshLambertMaterial({
        opacity: 0.6,
        transparent: false,
        color: "sienna"
    })
    return doorFrameMesh
}

const createLintel = (options) => {
    const door = options.walipini.door
    const lintelHeight = (options.walipini.door.height + options.walipini.door.lintelThickness) / 2 - 0.005
    var lintelMesh = new THREE.Mesh(new THREE.BoxGeometry(door.width + 0.5, door.lintelThickness, options.walipini.wall.thickness + 0.06))
    lintelMesh.translateY(options.walipini.door.height / 2 -options.walipini.dig.depth)
    lintelMesh.translateY(lintelHeight)
    lintelMesh.receiveShadow = true
    lintelMesh.castShadow = true
    lintelMesh.material =  new THREE.MeshLambertMaterial({
        opacity: 0.6,
        transparent: false,
        color: "sienna"
    })
    return lintelMesh
}

module.exports = {
    create: create
}
