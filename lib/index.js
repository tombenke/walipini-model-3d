const THREE = require('three')
const ground = require('./ground')
const walls = require('./walls')
const doors = require('./doors')
const roof = require('./roof')
const parameters = require('./parameters')
const reports = require('./reports')
const config = require('../config/')

const create = (rawOptions) => {
    const options = parameters.update(rawOptions)
    const walipini = new THREE.Object3D()

    walipini.add(ground.create(options))
    walipini.add(walls.create(options))
    walipini.add(doors.create(options))
    walipini.add(roof.create(options))

    return walipini
}

const makeReports = (rawOptions) => {
    const options = parameters.update(rawOptions)
    return reports.make(options)
}

module.exports = {
    create: create,
    reports: makeReports,
    config: config
}
