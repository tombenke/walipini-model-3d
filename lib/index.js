const THREE = require('three')
const ThreeBSP = require('three-js-csg')(THREE)

const toDegree = (rad) => rad / (2 * Math.PI / 360)
const toRad = (degree) => degree * (2 * Math.PI / 360)

const createGround = function(options) {
    const ground = options.ground
    const grass = ground.grass
    const soil = ground.soil
    const underSoil = ground.underSoil
    const walipini = options.walipini

    // Create Walipini Dig
    var walipiniDig = new THREE.Mesh(new THREE.BoxGeometry(walipini.width, walipini.height, walipini.length))
    walipiniDig.position.set(0, walipini.height/2-walipini.depth, 0)
    var walipiniDigBSP = new ThreeBSP(walipiniDig)

    // Create Grass
    var grassVol = new THREE.Mesh(new THREE.BoxGeometry(ground.width, grass.thickness, ground.length))
    grassVol.position.set(0, -grass.thickness/2, 0)
    var grassVolBSP = new ThreeBSP(grassVol)
    var grassWithDig = grassVolBSP.subtract(walipiniDigBSP).toMesh()
    grassWithDig.material =  new THREE.MeshLambertMaterial({ color: grass.color })
    grassWithDig.receiveShadow = true

    // Create Soil
    var soilVol = new THREE.Mesh( new THREE.BoxGeometry(ground.width, soil.thickness, ground.length))
    soilVol.position.set(0, -(grass.thickness + soil.thickness/2), 0)
    var soilVolBSP = new ThreeBSP(soilVol)
    var soilWithDig = soilVolBSP.subtract(walipiniDigBSP).toMesh()
    soilWithDig.material =  new THREE.MeshLambertMaterial({ color: soil.color })
    soilWithDig.receiveShadow = true

    // Create Under-Soil
    var underSoilVol = new THREE.Mesh(new THREE.BoxGeometry(ground.width, underSoil.thickness, ground.length, underSoil.color))
    underSoilVol.position.set(0, -(grass.thickness + soil.thickness + underSoil.thickness/2), 0)
    var underSoilVolBSP = new ThreeBSP(underSoilVol)
    var underSoilWithDig = underSoilVolBSP.subtract(walipiniDigBSP).toMesh()
    underSoilWithDig.receiveShadow = true
    underSoilWithDig.material =  new THREE.MeshLambertMaterial({
        opacity: 0.6,
        transparent: false,
        color: underSoil.color
    })

    const result = new THREE.Object3D()
    result.add(grassWithDig)
    result.add(soilWithDig)
    result.add(underSoilWithDig)

    return result
}

const createBoxBSP = (x, y, z, width, height, length) => {
    var volume = new THREE.Mesh(new THREE.BoxGeometry(width, height, length))
    volume.position.set(x, y, z)
    return new ThreeBSP(volume)
}

const createWalls = function(options) {
    const walipini = options.walipini
    const wall = options.walipini.wall
    const maxWallHeight = walipini.height - walipini.depth
    const backWallLength = walipini.length + 2 * wall.thickness
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

const createRoof = (options) => {
    const roof = options.walipini.roof
    const result = new THREE.Object3D()

    // Create the front window    
    const frontWindow = new THREE.Mesh(new THREE.BoxGeometry(roof.frontWindow.width, roof.frontWindow.height, roof.frontWindow.length))
    frontWindow.rotateY(-roof.frontWindow.rotate.y)
    frontWindow.rotateX(roof.frontWindow.rotate.x)
    frontWindow.position.set(roof.frontWindow.translate.x-roof.frontWindow.height/2, roof.frontWindow.translate.y, roof.frontWindow.translate.z)
    frontWindow.material = new THREE.MeshLambertMaterial({
        color: 'white' /*roof.frontWindow.color*/,
        transparent: true,
        opacity: 0.6
    })
    frontWindow.castShadow = true
    result.add(frontWindow)

    // Create the back window
    const backWindow = new THREE.Mesh(new THREE.BoxGeometry(roof.backWindow.width, roof.backWindow.height, roof.backWindow.length))
    backWindow.rotateY(-roof.backWindow.rotate.y)
    backWindow.rotateX(roof.backWindow.rotate.x)
    backWindow.position.set(roof.backWindow.translate.x, roof.backWindow.translate.y, roof.backWindow.translate.z)
    backWindow.material = new THREE.MeshLambertMaterial({
        color: 'white' /*roof.frontWindow.color*/,
        transparent: true,
        opacity: 0.6
    })
    backWindow.castShadow = true
    result.add(backWindow)

    return result
}

const roofHeight = (walipini) => walipini.height - walipini.depth

const frontWindowHeight = (walipini, wsElevation) => (roofHeight(walipini) - walipini.wall.frontHeight) / Math.cos(wsElevation)

const frontWindowProjection = (walipini, wsElevation) => frontWindowHeight(walipini, wsElevation) * Math.sin(toRad(wsElevation))

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

const recalcWalipiniOptions = (options) => {
    var walipini = options.walipini
    walipini.roof.frontWindow = frontWindow(walipini, options.winterSolsticeElevation)
    walipini.roof.backWindow = backWindow(walipini, options.winterSolsticeElevation)
    console.log(options)
    return options
}

const create = (rawOptions) => {
    const options = recalcWalipiniOptions(rawOptions)
    const walipini = new THREE.Object3D()

    walipini.add(createGround(options))
    walipini.add(createWalls(options))
    walipini.add(createRoof(options))

    return walipini
}

module.exports = {
    create: create
}
