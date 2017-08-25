const geometry = require('./geometry')
const walls = require('./walls')

const make = (options) => ({
    volumes: volumes(options),
    surfaces: surfaces(options)

})

const volumes = (options) => {
    const dig = digVolumes(options)
    const walls = wallsVolumes(options)
    return {
        dig: dig,
        walls: walls,
        totals: dig.totals + walls.totals
    }
}

const soilVolume = (options) => {
    const soilThickness = options.ground.soil.thickness
    const totalDepth = options.walipini.dig.depth
    let digToSoil = soilThickness

    if (totalDepth < soilThickness) {
        digToSoil = soilThickness - totalDepth
    }

    return walipiniArea(options) * digToSoil
}

const underSoilVolume = (options) => {
    const soilThickness = options.ground.soil.thickness
    const totalDepth = options.walipini.dig.depth
    const digToUnderSoil = Math.max(totalDepth - soilThickness, 0)

    return walipiniArea(options) * digToUnderSoil
}

const staircaseVolume = (options) => options.walipini.door.width * Math.pow(options.walipini.dig.depth, 2)
const walipiniArea = (options) => options.walipini.width * options.walipini.length

const digVolumes = (options) => {
    const soil = soilVolume(options)
    const underSoil = underSoilVolume(options)
    const staircase = staircaseVolume(options)
    return {
        soil: soil,
        underSoil: underSoil,
        staircase: staircase,
        totals: soil + underSoil + staircase
    }
}

const wallsVolumes = (options) => {
    const front = geometry.volume(walls.createFrontWallGeometry(options))
    const back = geometry.volume(walls.createBackWallGeometry(options))
    const sides = geometry.volume(walls.createSideWallGeometry(options)) * 2
    return {
        front: front,
        back: back,
        sides: sides,
        totals: front + back + sides
    }
}

const surfaces = (options) => {
    const walipini = options.walipini
    const wallThickness = walipini.wall.thickness
    const frontWindow = options.walipini.roof.frontWindow
    const backWindow = options.walipini.roof.backWindow
    const frontWindowSurface = frontWindow.width * frontWindow.length
    const backWindowSurface = backWindow.width * backWindow.length
    const sideWallsArea = (walipini.width + 2 * wallThickness) * wallThickness * 2
    const mainWallsArea = walipini.length * wallThickness * 2
    const walls = sideWallsArea + mainWallsArea

    console.log(frontWindow, backWindow)
    return {
        roof: {
            frontWindow: frontWindowSurface,
            backWindow: backWindowSurface,
            totals: frontWindowSurface + backWindowSurface
        },
        building: {
            internal: walipiniArea(options),
            walls: walls,
            totals: walipiniArea(options) + walls
        }
    }
}

module.exports = {
    make: make
}
