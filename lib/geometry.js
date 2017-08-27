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

/*
function customRound(number, fractiondigits) {
    with(Math) {
        return round(number * pow(10, fractiondigits)) / pow(10, fractiondigits);
    }
}

function SuperficialAreaOfMesh(points) {

    var _len = points.length,
        _area = 0.0;

    if (!_len) return 0.0;

    let i = 0
    let vols = 0
    let va
    let vb
    let vc

    do  {
        va = {
            X: points[i],
            Y: points[i + 1],
            Z: points[i + 2]
        }

        vb = {
            X: points[i + 3],
            Y: points[i + 4],
            Z: points[i + 5]
        }

        vc = {
            X: points[i + 6],
            Y: points[i + 7],
            Z: points[i + 8]
        }

        var ab = {
            X: vb.X - va.X,
            Y: vb.Y - va.Y,
            Z: vb.Z - va.Z
        }
        //vb.clone().sub(va);  var ac = {X:vc.X-va.X,Y:vc.Y-va.Y,Z:va.Z-vc.Z};
        //vc.clone().sub(va);   var cross = new THREE.Vector3();

        cross = crossVectors(ab, ac)
        _area += Math.sqrt(Math.pow(cross.X, 2) + Math.pow(cross.Y, 2) + Math.pow(cross.Z, 2)) / 2
        i += 9
    }
    while (i < points.length)

    return customRound(Math.abs(_area) / 100, 2)
}

function crossVectors( a, b ) {
    var ax = a.X
    var ay = a.Y
    var az = a.Z
    var bx = b.X
    var by = b.Y
    var bz = b.Z
    var P = {
        X: ay * bz - az * by,
        Y: az * bx - ax * bz,
        Z: ax * by - ay * bx
    }

   return P;
}

*/


