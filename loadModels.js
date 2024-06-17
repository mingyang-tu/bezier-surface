const SAMPLE_POINTS = 50;


function loadModel() {
    var model = bezierSurface(controlPoints, SAMPLE_POINTS);

    // vertex
    modelBuffer.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, modelBuffer.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.vertices), gl.STATIC_DRAW);

    modelBuffer.positionAttribLocation = gl.getAttribLocation(modelShaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(modelBuffer.positionAttribLocation);

    // normal
    modelBuffer.normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, modelBuffer.normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.normals), gl.STATIC_DRAW);

    modelBuffer.normalAttribLocation = gl.getAttribLocation(modelShaderProgram, "aVertexNormal");
    gl.enableVertexAttribArray(modelBuffer.normalAttribLocation);

    // texture coord
    modelBuffer.textureBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, modelBuffer.textureBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.textureCoords), gl.STATIC_DRAW);

    modelBuffer.textureAttribLocation = gl.getAttribLocation(modelShaderProgram, "aTextureCoord");
    gl.enableVertexAttribArray(modelBuffer.textureAttribLocation);

    // index
    modelBuffer.indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, modelBuffer.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(model.indices), gl.STATIC_DRAW);

    modelBuffer.indicesLength = model.indices.length;
}


function loadAxes() {
    const axesVertex = new Float32Array([
        // X-axis (red)
        0.0, 0.0, 0.0,
        0.5, 0.0, 0.0,
        // Y-axis (green)
        0.0, 0.0, 0.0,
        0.0, 0.5, 0.0,
        // Z-axis (blue)
        0.0, 0.0, 0.0,
        0.0, 0.0, 0.5,
    ]);

    const axesColor = new Float32Array([
        // X-axis (red)
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        // Y-axis (green)
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        // Z-axis (blue)
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
    ]);

    const axesIndices = new Uint16Array([0, 1, 2, 3, 4, 5]);

    // vertex
    axesBuffer.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, axesBuffer.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, axesVertex, gl.STATIC_DRAW);

    axesBuffer.positionAttribLocation = gl.getAttribLocation(axesShaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(axesBuffer.positionAttribLocation);

    // color
    axesBuffer.colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, axesBuffer.colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, axesColor, gl.STATIC_DRAW);

    axesBuffer.colorAttribLocation = gl.getAttribLocation(axesShaderProgram, "aVertexColor");
    gl.enableVertexAttribArray(axesBuffer.colorAttribLocation);

    // index
    axesBuffer.indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, axesBuffer.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, axesIndices, gl.STATIC_DRAW);

    axesBuffer.indicesLength = axesIndices.length;
}


function loadControlPoints() {
    for (let i = 0; i < controlPoints.length; i++) {
        var controlPointsModel = createSphere(controlPoints[i], controlPointsColors[i]);

        // vertex
        controlPointsModelsBuffers[i].vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, controlPointsModelsBuffers[i].vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, controlPointsModel.vertices, gl.STATIC_DRAW);

        controlPointsModelsBuffers[i].positionAttribLocation = gl.getAttribLocation(controlPointShaderProgram, "aVertexPosition");
        gl.enableVertexAttribArray(controlPointsModelsBuffers[i].positionAttribLocation);

        // color
        controlPointsModelsBuffers[i].colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, controlPointsModelsBuffers[i].colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, controlPointsModel.colors, gl.STATIC_DRAW);

        controlPointsModelsBuffers[i].colorAttribLocation = gl.getAttribLocation(controlPointShaderProgram, "aVertexColor");
        gl.enableVertexAttribArray(controlPointsModelsBuffers[i].colorAttribLocation);

        // index
        controlPointsModelsBuffers[i].indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, controlPointsModelsBuffers[i].indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(controlPointsModel.indices), gl.STATIC_DRAW);

        controlPointsModelsBuffers[i].indicesLength = controlPointsModel.indices.length;
    }
}


function loadEvaluatePoint() {
    var evaluatePoint = bezierEvaluateVertex(controlPoints, toEvaluate["u"], toEvaluate["v"]);
    document.getElementById("evaluate-point").textContent = `(${evaluatePoint[0].toFixed(2)}, ${evaluatePoint[1].toFixed(2)}, ${evaluatePoint[2].toFixed(2)})`;

    var evaluatePointModel = createSphere(new Float32Array(evaluatePoint), [0.0, 1.0, 0.0]);

    // vertex
    evaluatePointModelBuffer.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, evaluatePointModelBuffer.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, evaluatePointModel.vertices, gl.STATIC_DRAW);

    evaluatePointModelBuffer.positionAttribLocation = gl.getAttribLocation(controlPointShaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(evaluatePointModelBuffer.positionAttribLocation);

    // color
    evaluatePointModelBuffer.colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, evaluatePointModelBuffer.colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, evaluatePointModel.colors, gl.STATIC_DRAW);

    evaluatePointModelBuffer.colorAttribLocation = gl.getAttribLocation(controlPointShaderProgram, "aVertexColor");
    gl.enableVertexAttribArray(evaluatePointModelBuffer.colorAttribLocation);

    // index
    evaluatePointModelBuffer.indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, evaluatePointModelBuffer.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(evaluatePointModel.indices), gl.STATIC_DRAW);

    evaluatePointModelBuffer.indicesLength = evaluatePointModel.indices.length;
}


const controlPointIndices = [
    0, 1, 1, 2, 2, 3,
    4, 5, 5, 6, 6, 7,
    8, 9, 9, 10, 10, 11,
    12, 13, 13, 14, 14, 15,
    0, 4, 4, 8, 8, 12,
    1, 5, 5, 9, 9, 13,
    2, 6, 6, 10, 10, 14,
    3, 7, 7, 11, 11, 15
];


function loadControlLines() {
    // vertex
    controlLinesBuffer.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, controlLinesBuffer.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(controlPoints.flat()), gl.STATIC_DRAW);

    controlLinesBuffer.positionAttribLocation = gl.getAttribLocation(controlLineShaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(controlLinesBuffer.positionAttribLocation);

    // index
    controlLinesBuffer.indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, controlLinesBuffer.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(controlPointIndices), gl.STATIC_DRAW);

    controlLinesBuffer.indicesLength = controlPointIndices.length;
}
