const THREE = require('three')
const ThreeBSP = require('three-js-csg')(THREE)

const toRad = THREE.Math.degToRad

const createBoxBSP = (x, y, z, width, height, length) => {
    var volume = new THREE.Mesh(new THREE.BoxGeometry(width, height, length))
    volume.position.set(x, y, z)
    return new ThreeBSP(volume)
}

const create = (options) => {
    const walipini = options.walipini
    const wall = options.walipini.wall
    const maxWallHeight = walipini.height - walipini.dig.depth
    const frontWallLength = walipini.length + 2 * wall.thickness
    const sideWallLength = walipini.width + 2 * wall.thickness

    // Create Front Wall
    var frontWallBSP = createBoxBSP((walipini.width + wall.thickness)/2, wall.frontHeight/2, 0, wall.thickness, wall.frontHeight, frontWallLength)

    // Create Back Wall
    var backWallBSP = createBoxBSP(-(walipini.width + wall.thickness)/2, maxWallHeight/2, 0, wall.thickness, maxWallHeight, frontWallLength)

    // Create Side Walls
    var leftWallBSP = createBoxBSP(0, maxWallHeight/2, -(walipini.length + wall.thickness)/2, sideWallLength, maxWallHeight, wall.thickness)
    var rightWallBSP = createBoxBSP(0, maxWallHeight/2, +(walipini.length + wall.thickness)/2, sideWallLength, maxWallHeight, wall.thickness)

    // Create union of walls
    var wallsBSP = frontWallBSP.union(backWallBSP)
    wallsBSP = wallsBSP.union(leftWallBSP)
    wallsBSP = wallsBSP.union(rightWallBSP)

    // Create cutter to the back wall
    const cutterWidth = walipini.width * 2
    const cutterHeight = maxWallHeight
    const cutterLength = frontWallLength * 2

    var bwCutter = new THREE.Mesh(new THREE.BoxGeometry(cutterLength, cutterHeight, cutterWidth))
    const bw = walipini.roof.backWindow
    bwCutter.rotateY(-bw.rotate.y)
    bwCutter.rotateX(bw.rotate.x)
    bwCutter.position.set(bw.translate.x, bw.translate.y + cutterHeight / (2*Math.cos(toRad(options.winterSolsticeElevation))), bw.translate.z)
    var bwCutterBSP = new ThreeBSP(bwCutter)

    var fwCutter = new THREE.Mesh(new THREE.BoxGeometry(cutterLength, cutterHeight, cutterWidth))
    const fw = walipini.roof.frontWindow
    fwCutter.rotateY(-fw.rotate.y)
    fwCutter.rotateX(fw.rotate.x)
    fwCutter.position.set(fw.translate.x + cutterHeight / (2*Math.cos(toRad(options.winterSolsticeElevation))), fw.translate.y, bw.translate.z)
    var fwCutterBSP = new ThreeBSP(fwCutter)

    wallsBSP = wallsBSP.subtract(bwCutterBSP)
    wallsBSP = wallsBSP.subtract(fwCutterBSP)

    var walls = wallsBSP.toMesh()
    walls.material =  new THREE.MeshLambertMaterial({
        color: wall.color,
        transparent: false,
        opacity: 0.6
    })
    walls.castShadow = true

    const result = new THREE.Object3D()
    result.add(walls)

    return result
}

module.exports = {
    create: create
}