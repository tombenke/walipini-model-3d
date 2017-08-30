const THREE = require('three')
const ThreeBSP = require('three-js-csg')(THREE)
const extrude = require('./geometry').extrude

const create = function(options) {
    const ground = options.ground
    const grass = ground.grass
    const soil = ground.soil
    const underSoil = ground.underSoil
    const walipini = options.walipini

    var stairwayDigBSP = new ThreeBSP(createStairwayDig(options))

    // Create Walipini Dig
    var walipiniDig = new THREE.Mesh(new THREE.BoxGeometry(walipini.width, walipini.height, walipini.length))
    walipiniDig.position.set(0, walipini.height/2-walipini.dig.depth, 0)
    walipiniDig.rotateY(THREE.Math.degToRad(-options.walipini.orientation))
    var walipiniDigBSP = stairwayDigBSP.union(new ThreeBSP(walipiniDig))

    // Create Grass
    var grassVol = new THREE.Mesh(new THREE.BoxGeometry(ground.width, grass.thickness, ground.length))
    grassVol.position.set(0, -grass.thickness/2, 0)
    var grassVolBSP = new ThreeBSP(grassVol)
    var grassWithDig = grassVolBSP.subtract(walipiniDigBSP).toMesh()
    grassWithDig.material =  new THREE.MeshLambertMaterial({ color: grass.color })
    grassWithDig.receiveShadow = true
    grassWithDig.castShadow = true

    // Create Soil
    var soilVol = new THREE.Mesh( new THREE.BoxGeometry(ground.width, soil.thickness, ground.length))
    soilVol.position.set(0, -(grass.thickness + soil.thickness/2), 0)
    var soilVolBSP = new ThreeBSP(soilVol)
    var soilWithDig = soilVolBSP.subtract(walipiniDigBSP).toMesh()
    soilWithDig.material =  new THREE.MeshLambertMaterial({ color: soil.color })
    soilWithDig.receiveShadow = true
    soilWithDig.castShadow = true

    // Create Under-Soil
    var underSoilVol = new THREE.Mesh(new THREE.BoxGeometry(ground.width, underSoil.thickness, ground.length, underSoil.color))
    underSoilVol.position.set(0, -(grass.thickness + soil.thickness + underSoil.thickness/2), 0)
    var underSoilVolBSP = new ThreeBSP(underSoilVol)
    var underSoilWithDig = underSoilVolBSP.subtract(walipiniDigBSP).toMesh()
    underSoilWithDig.receiveShadow = true
    underSoilWithDig.castShadow = true
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

const createStairwayDig = (options) => {
    const lowerWidth = options.walipini.length + options.walipini.wall.thickness * 2
    const upperWidth = lowerWidth + options.walipini.dig.depth * 2
    const UL = new THREE.Vector2(-upperWidth / 2, 0.01)
    const UR = new THREE.Vector2(upperWidth / 2, 0.01)
    const LL = new THREE.Vector2(-lowerWidth / 2, -options.walipini.dig.depth)
    const LR = new THREE.Vector2(lowerWidth / 2, -options.walipini.dig.depth)
    const vertices = [UL, UR, LR, LL, UL]
    console.log('stairwayDig: ', vertices)
    const length = options.walipini.door.width

    const stairwayDigGeometry = extrude(vertices, length)
    stairwayDigGeometry.translate(0, 0, -length / 2)
    stairwayDigGeometry.rotateY(THREE.Math.degToRad(-options.walipini.orientation - 90))

    return new THREE.Mesh(stairwayDigGeometry)
}

module.exports = {
    create: create
}
