const geometry = require('./geometry')
const walls = require('./walls')

const make = (options) => ({
    volumes: volumes(options),
    surfaces: surfaces(options),
    sizes: sizes(options)
})

const volumes = (options) => {
    const dig = digVolumes(options)
    const walls = wallsVolumes(options)
    return {
        dig: dig,
        walls: walls,
        balance: (dig.totals - walls.totals).toFixed(1)
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
        soil: soil.toFixed(1),
        underSoil: underSoil.toFixed(1),
        staircase: staircase.toFixed(1),
        totals: (soil + underSoil + staircase).toFixed(1)
    }
}

const wallsVolumes = (options) => {
    const front = geometry.volume(walls.createFrontWallGeometry(options))
    const back = geometry.volume(walls.createBackWallGeometry(options))
    const sides = geometry.volume(walls.createSideWallGeometry(options)) * 2
    return {
        front: front.toFixed(1),
        back: back.toFixed(1),
        sides: sides.toFixed(1),
        totals: (front + back + sides).toFixed(1)
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

    return {
        roof: {
            frontWindow: frontWindowSurface.toFixed(1),
            backWindow: backWindowSurface.toFixed(1),
            totals: (frontWindowSurface + backWindowSurface).toFixed(1)
        },
        building: {
            internal: walipiniArea(options).toFixed(1),
            walls: walls.toFixed(1),
            totals: (walipiniArea(options) + walls).toFixed(1)
        }
    }
}

const sizes = (options) => {
    const walipini = options.walipini
    const wallThickness = walipini.wall.thickness
    const frontWindow = options.walipini.roof.frontWindow
    const backWindow = options.walipini.roof.backWindow
    const fullWidth = walipini.width + wallThickness * 2
    const fullLength = walipini.length + wallThickness * 2

    return {
        roof: {
            frontWindowWidth: frontWindow.length.toFixed(1),
            backWindowWidth: backWindow.length.toFixed(1),
            totalWidth: (frontWindow.length + backWindow.length).toFixed(1),
            length: fullLength.toFixed(1), // + overhanging
        },
        building: {
            internal: {
                width: walipini.width.toFixed(1),
                length: walipini.length.toFixed(1)
            },
            external: {
                width: fullWidth.toFixed(1),
                length: fullLength.toFixed(1)
            }
        }
    }
}

module.exports = {
    make: make
}
