const THREE = require('three')

const calculateVolume = (object) => {
    let volumes = 0.0

    for(var i = 0; i < object.faces.length; i++) {
        let Pi = object.faces[i].a
        let Qi = object.faces[i].b
        let Ri = object.faces[i].c

        let P = new THREE.Vector3(object.vertices[Pi].x, object.vertices[Pi].y, object.vertices[Pi].z)
        let Q = new THREE.Vector3(object.vertices[Qi].x, object.vertices[Qi].y, object.vertices[Qi].z)
        let R = new THREE.Vector3(object.vertices[Ri].x, object.vertices[Ri].y, object.vertices[Ri].z)
        volumes += volumeOfT(P, Q, R)
    }

    return Math.abs(volumes)
}

const volumeOfT = (p1, p2, p3) => {
    var v321 = p3.x * p2.y * p1.z;
    var v231 = p2.x * p3.y * p1.z;
    var v312 = p3.x * p1.y * p2.z;
    var v132 = p1.x * p3.y * p2.z;
    var v213 = p2.x * p1.y * p3.z;
    var v123 = p1.x * p2.y * p3.z;
    return (-v321 + v231 + v312 - v132 - v213 + v123) / 6.0;
}

const extrude = (vertices, height) => {

    var shape = new THREE.Shape()

    shape.moveTo(vertices[0].x, vertices[0].y)
    for (var i=1; i < vertices.length; i++) {
        shape.lineTo(vertices[i].x, vertices[i].y)
    }
    shape.lineTo(vertices[0].x, vertices[0].y)

    var settings = {
        amount: height,
        bevelEnabled: false
    }
    return new THREE.ExtrudeGeometry(shape, settings)
}

module.exports = {
    volume: calculateVolume,
    extrude: extrude
}
