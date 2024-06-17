const KNOTS = [
    [],
    [[0, 0, 0.4, 0.6, 1, 1], [0, 0, 0.4, 0.6, 1, 1]],
    [[0, 0, 0, 0.5, 1, 1, 1], [0, 0, 0, 0.5, 1, 1, 1]],
    [[0, 0, 0, 0, 1, 1, 1, 1], [0, 0, 0, 0, 1, 1, 1, 1]],
];


function bsplineSurface(controlPoints, degree, num_sample) {
    var bsplinesurface = {
        vertices: [],
        indices: [],
        normals: [],
        textureCoords: [],
    };
    for (var i = 0; i < num_sample; i++) {
        for (var j = 0; j < num_sample; j++) {
            var u = i / (num_sample - 1);
            var v = j / (num_sample - 1);
            var point = bsplineEvaluateVertex(controlPoints, degree, u, v);
            bsplinesurface.vertices.push(point[0], point[1], point[2]);
            var normal = bsplineEvaluateNormal(controlPoints, degree, u, v);
            bsplinesurface.normals.push(normal[0], normal[1], normal[2]);
            bsplinesurface.textureCoords.push(u, v);
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
            bsplinesurface.indices.push(square[2], square[1], square[0]);
            bsplinesurface.indices.push(square[1], square[2], square[3]);
        }
    }
    return bsplinesurface;
}


function bsplineEvaluateVertex(controlPoints, degree, u, v) {
    var point = [0.0, 0.0, 0.0];
    for (var i = 0; i < NUM_CONTROL_POINTS; i++) {
        for (var j = 0; j < NUM_CONTROL_POINTS; j++) {
            var Bi = bsplineBasis(KNOTS[degree][0], i, degree, u);
            var Bj = bsplineBasis(KNOTS[degree][1], j, degree, v);
            var B = Bi * Bj;
            for (var k = 0; k < 3; k++)
                point[k] += B * controlPoints[i * NUM_CONTROL_POINTS + j][k];
        }
    }
    return point;
}


function bsplineBasis(knots, i, degree, u) {
    if (degree == 0) {
        if (u == 1)
            return (u == knots[i + 1]) ? 1 : 0;
        return (knots[i] <= u && u < knots[i + 1]) ? 1 : 0;
    } else {
        var B = 0;
        var D1 = knots[i + degree] - knots[i];
        var D2 = knots[i + degree + 1] - knots[i + 1];
        if (D1 != 0)
            B += (u - knots[i]) / D1 * bsplineBasis(knots, i, degree - 1, u);
        if (D2 != 0)
            B += (knots[i + degree + 1] - u) / D2 * bsplineBasis(knots, i + 1, degree - 1, u);
        return B;
    }
}


function bsplineEvaluateNormal(controlPoints, degree, u, v) {
    var dSdu = [0, 0, 0];
    var dSdv = [0, 0, 0];
    for (var i = 0; i < NUM_CONTROL_POINTS; i++) {
        for (var j = 0; j < NUM_CONTROL_POINTS; j++) {
            var Bi = bsplineBasis(KNOTS[degree][0], i, degree, u);
            var Bj = bsplineBasis(KNOTS[degree][1], j, degree, v);
            var dBi = bsplineDerivativeBasis(KNOTS[degree][0], i, degree, u);
            var dBj = bsplineDerivativeBasis(KNOTS[degree][1], j, degree, v);

            var dBdu = dBi * Bj;
            var dBdv = Bi * dBj;

            for (var k = 0; k < 3; k++) {
                dSdu[k] += dBdu * controlPoints[i * NUM_CONTROL_POINTS + j][k];
                dSdv[k] += dBdv * controlPoints[i * NUM_CONTROL_POINTS + j][k];
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


function bsplineDerivativeBasis(knots, i, degree, u) {
    if (degree == 0)
        return 0;
    else {
        var B = 0;
        var D1 = knots[i + degree] - knots[i];
        var D2 = knots[i + degree + 1] - knots[i + 1];
        if (D1 != 0) {
            B += 1 / D1 * bsplineBasis(knots, i, degree - 1, u);
            B += (u - knots[i]) / D1 * bsplineDerivativeBasis(knots, i, degree - 1, u);
        }
        if (D2 != 0) {
            B -= 1 / D2 * bsplineBasis(knots, i + 1, degree - 1, u);
            B += (knots[i + degree + 1] - u) / D2 * bsplineDerivativeBasis(knots, i + 1, degree - 1, u);
        }
        return B;
    }
}
