const THREE = require('three')

const create = (options) => {

    const doorDist = (options.walipini.length + options.walipini.door.thickness) / 2
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
    //result.add(createDoorFrame(options))

    // Add lintel
    const leftLintel = createLintel(options)
    const rightLintel = leftLintel.clone(true)
    const lintelHeight = (options.walipini.door.height + options.walipini.door.lintelThickness) / 2

    leftLintel.translateZ(-lintelDist)
    leftLintel.translateY(lintelHeight)
    rightLintel.translateZ(lintelDist)
    rightLintel.translateY(lintelHeight)

    result.add(leftLintel)
    result.add(rightLintel)

    result.translateY(options.walipini.door.height / 2 -options.walipini.dig.depth)
    result.rotateY(THREE.Math.degToRad(- options.walipini.orientation))

    return result
}

const createDoor = (options) => {
    const door = options.walipini.door
    var doorMesh = new THREE.Mesh(new THREE.BoxGeometry(door.width, door.height, door.thickness))
    doorMesh.receiveShadow = true
    doorMesh.castShadow = true
    doorMesh.material =  new THREE.MeshLambertMaterial({
        opacity: 0.6,
        transparent: false,
        color: door.color
    })
    return doorMesh
}

const createLintel = (options) => {
    const door = options.walipini.door
    var lintelMesh = new THREE.Mesh(new THREE.BoxGeometry(door.width + 0.5, door.lintelThickness, options.walipini.wall.thickness + 0.06))
    lintelMesh.receiveShadow = true
    lintelMesh.castShadow = true
    lintelMesh.material =  new THREE.MeshLambertMaterial({
        opacity: 0.6,
        transparent: false,
        color: door.color
    })
    return lintelMesh
}

module.exports = {
    create: create
}
