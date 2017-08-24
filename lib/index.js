const THREE = require('three')
const ground = require('./ground')
const walls = require('./walls')
const roof = require('./roof')
const parameters = require('./parameters')

const create = (rawOptions) => {
    const options = parameters.update(rawOptions)
    const walipini = new THREE.Object3D()

    walipini.add(ground.create(options))
    walipini.add(walls.create(options))
    walipini.add(roof.create(options))

    return walipini
}

module.exports = {
    create: create
}
