const THREE = require('three')

const create = (options) => {
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

module.exports = {
    create: create
}
