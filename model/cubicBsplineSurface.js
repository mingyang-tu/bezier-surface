function cubicBsplineSurface(controlPoints, num_sample) {
    var cubicbsplinesurface = {
        vertices: [],
        indices: [],
        normals: [],
        textureCoords: [],
    };
    for (var i = 0; i < num_sample; i++) {
        for (var j = 0; j < num_sample; j++) {
            var u = i / (num_sample - 1);
            var v = j / (num_sample - 1);
            var point = cubicBsplineEvaluateVertex(controlPoints, u, v);
            cubicbsplinesurface.vertices.push(point[0], point[1], point[2]);
            var normal = cubicBsplineEvaluateNormal(controlPoints, u, v);
            cubicbsplinesurface.normals.push(normal[0], normal[1], normal[2]);
            cubicbsplinesurface.textureCoords.push(u, v);
        }
    }
    for (var i = 0; i < num_sample - 1; i++) {
        for (var j = 0; j < num_sample - 1; j++) {
            var square = [
                (i * num_sample + j),
                (i * num_sample + j + 1),
                ((i + 1) * num_sample + j),
                ((i + 1) * num_sample + j + 1)
            ];
            cubicbsplinesurface.indices.push(square[2], square[1], square[0]);
            cubicbsplinesurface.indices.push(square[1], square[2], square[3]);
        }
    }
    return cubicbsplinesurface;
}


function cubicBsplineEvaluateVertex(controlPoints, u, v) {
    var point = [0, 0, 0];
    for (var i = 0; i <= DEGREE; i++) {
        for (var j = 0; j <= DEGREE; j++) {
            var Bi = cubicBsplineBasis(i, u);
            var Bj = cubicBsplineBasis(j, v);
            var B = Bi * Bj;
            for (var k = 0; k < 3; k++)
                point[k] += B * controlPoints[i * (DEGREE + 1) + j][k];
        }
    }
    return point;
}


function cubicBsplineBasis(i, u) {
    var u2 = u * u;
    var u3 = u2 * u;
    switch (i) {
        case 0:
            return (1 - 3 * u + 3 * u2 - u3) / 6;
        case 1:
            return (4 - 6 * u2 + 3 * u3) / 6;
        case 2:
            return (1 + 3 * u + 3 * u2 - 3 * u3) / 6;
        case 3:
            return u3 / 6;
    }
}


function cubicBsplineEvaluateNormal(controlPoints, u, v) {
    var dSdu = [0, 0, 0];
    var dSdv = [0, 0, 0];
    for (var i = 0; i <= DEGREE; i++) {
        for (var j = 0; j <= DEGREE; j++) {
            var Bi = cubicBsplineBasis(i, u);
            var Bj = cubicBsplineBasis(j, v);
            var dBi = cubicBsplineDerivative(i, u);
            var dBj = cubicBsplineDerivative(j, v);

            var dBdu = dBi * Bj;
            var dBdv = Bi * dBj;

            for (var k = 0; k < 3; k++) {
                dSdu[k] += dBdu * controlPoints[i * (DEGREE + 1) + j][k];
                dSdv[k] += dBdv * controlPoints[i * (DEGREE + 1) + j][k];
            }
        }
    }
    var normal = [
        dSdu[1] * dSdv[2] - dSdu[2] * dSdv[1],
        dSdu[2] * dSdv[0] - dSdu[0] * dSdv[2],
        dSdu[0] * dSdv[1] - dSdu[1] * dSdv[0]
    ];
    return normal;
}


function cubicBsplineDerivative(i, u) {
    var u2 = u * u;
    switch (i) {
        case 0:
            return (-3 + 6 * u - 3 * u2) / 6;
        case 1:
            return (-12 * u + 9 * u2) / 6;
        case 2:
            return (3 + 6 * u - 9 * u2) / 6;
        case 3:
            return u2 / 2;
    }
}
