const THREE = require('three')
const extrude = require('./geometry').extrude

const createWall = (geometry, tx, ty, tz) => {
    geometry.translate(tx, ty, tz)

    var wall = new THREE.Mesh(geometry)

    wall.material =  new THREE.MeshLambertMaterial({
        color: wall.color,
        transparent: false,
        opacity: 0.6
    })
    wall.castShadow = true
    return wall
}

const create = (options) => {

    const wallThickness = options.walipini.wall.thickness
    const length = options.walipini.length + wallThickness * 2
    const sideWallDistLeft = -length / 2
    const sideWallDistRight = length / 2 - wallThickness

    const frontWall = createWall(createFrontWallGeometry(options), 0, 0, -length / 2)
    const backWall = createWall(createBackWallGeometry(options), 0, 0, -length / 2)
    const sideWallLeft = createWall(createSideWallGeometry(options), 0, 0, sideWallDistLeft)
    const sideWallRight = createWall(createSideWallGeometry(options), 0, 0, sideWallDistRight)

    const result = new THREE.Object3D()

    result.add(frontWall)
    result.add(backWall)
    result.add(sideWallLeft)
    result.add(sideWallRight)
    result.rotateY(THREE.Math.degToRad(- options.walipini.orientation))

    return result
}

const createFrontWallGeometry = (options) => {
    const kps = options.walipini.kps
    const wallThickness = options.walipini.wall.thickness
    const vertices = [kps.FWLBI, kps.FWLTI, kps.FWLTM, kps.FWLTE, kps.FWLBE, kps.FWLBI]
    const length = options.walipini.length + wallThickness * 2

    return extrude(vertices, length)
}

const createBackWallGeometry = (options) => {
    const kps = options.walipini.kps
    const wallThickness = options.walipini.wall.thickness
    const vertices = [kps.BWLBE, kps.BWLTE, kps.BWLTI, kps.BWLBI, kps.BWLBE]
    const length = options.walipini.length + wallThickness * 2

    return extrude(vertices, length)
}

const createSideWallGeometry = (options) => {
    const kps = options.walipini.kps
    const wallThickness = options.walipini.wall.thickness
    const vertices = [
        kps.BWLBE, kps.BWLTE, kps.SWLRT, kps.FWLTM, kps.FWLTE,
        kps.FWLBE, kps.SWLBF, kps.SWLDF, kps.SWLDB, kps.SWLBB, kps.BWLBE
    ]

    return extrude(vertices, wallThickness)
}

module.exports = {
    create: create,
    createFrontWallGeometry: createFrontWallGeometry,
    createBackWallGeometry: createBackWallGeometry,
    createSideWallGeometry: createSideWallGeometry
}
