function bezierSurface(controlPoints, num_sample) {
    var beziersurface = {
        vertices: [],
        indices: [],
        normals: [],
        textureCoords: [],
    };
    for (var i = 0; i < num_sample; i++) {
        for (var j = 0; j < num_sample; j++) {
            var u = i / (num_sample - 1);
            var v = j / (num_sample - 1);
            var point = bezierEvaluateVertex(controlPoints, u, v);
            beziersurface.vertices.push(point[0], point[1], point[2]);
            var normal = bezierEvaluateNormal(controlPoints, u, v);
            beziersurface.normals.push(normal[0], normal[1], normal[2]);
            beziersurface.textureCoords.push(u, v);
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
            beziersurface.indices.push(square[2], square[1], square[0]);
            beziersurface.indices.push(square[1], square[2], square[3]);
        }
    }
    return beziersurface;
}


function bezierEvaluateVertex(controlPoints, u, v) {
    var point = [0, 0, 0];
    for (var i = 0; i <= DEGREE; i++) {
        for (var j = 0; j <= DEGREE; j++) {
            var Bi = BERNSTEIN[i] * Math.pow(u, i) * Math.pow(1 - u, DEGREE - i);
            var Bj = BERNSTEIN[j] * Math.pow(v, j) * Math.pow(1 - v, DEGREE - j);
            var B = Bi * Bj;
            for (var k = 0; k < 3; k++)
                point[k] += B * controlPoints[i * (DEGREE + 1) + j][k];
        }
    }
    return point;
}


function bezierEvaluateNormal(controlPoints, u, v) {
    var dSdu = [0, 0, 0];
    var dSdv = [0, 0, 0];
    for (var i = 0; i <= DEGREE; i++) {
        for (var j = 0; j <= DEGREE; j++) {
            var Bi = BERNSTEIN[i] * Math.pow(u, i) * Math.pow(1 - u, DEGREE - i);
            var Bj = BERNSTEIN[j] * Math.pow(v, j) * Math.pow(1 - v, DEGREE - j);
            var dBi = BERNSTEIN[i] * bezierDerivative(u, i);
            var dBj = BERNSTEIN[j] * bezierDerivative(v, j);

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


function bezierDerivative(u, i) {
    if (i == 0)
        return -DEGREE * Math.pow(1 - u, DEGREE - 1);
    else if (i == DEGREE)
        return DEGREE * Math.pow(u, DEGREE - 1);
    else
        return (
            i * Math.pow(u, i - 1) * Math.pow(1 - u, DEGREE - i) -
            (DEGREE - i) * Math.pow(u, i) * Math.pow(1 - u, DEGREE - i - 1)
        );
}
