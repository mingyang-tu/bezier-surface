const BG_COLOR = [0.8, 0.9, 1.0, 1.0];

var gl;
var modelShaderProgram, controlPointShaderProgram, controlLineShaderProgram, axesShaderProgram;

var modelLocation = [0, -1, -7];

var mvMatrix = mat4.create();
var normalMVMatrix = mat3.create();
var pMatrix = mat4.create();

var textures = {};

var modelBuffer = {};
var axesBuffer = {};
var controlPointsModelsBuffers = Array.from({ length: 16 }, () => ({}));
var evaluatePointModelBuffer = {};
var controlLinesBuffer = {};


function startWebGL() {
    var canvas = document.getElementById("WebGL-canvas");
    initGL(canvas);
    initCallbacks(canvas);

    textures["Blue"] = loadTexture("Blue");

    modelShaderProgram = initShaders(MODEL_VERTEX, MODEL_FRAGMENT);
    controlPointShaderProgram = initShaders(POINT_VERTEX, POINT_FRAGMENT);
    controlLineShaderProgram = initShaders(LINE_VERTEX, LINE_FRAGMENT);
    axesShaderProgram = initShaders(AXES_VERTEX, AXES_FRAGMENT);

    loadAxes();

    tick();
}


function initGL(canvas) {
    gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) {
        console.error("Your browser does not support WebGL.");
        return;
    }

    var realToCSSPixels = window.devicePixelRatio || 1;
    canvas.width = Math.floor(canvas.clientWidth * realToCSSPixels);
    canvas.height = Math.floor(canvas.clientHeight * realToCSSPixels);

    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;

    gl.clearColor(BG_COLOR[0], BG_COLOR[1], BG_COLOR[2], BG_COLOR[3]);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
}


function initCallbacks(canvas) {
    canvas.onmousedown = mousedown;
    canvas.onmouseup = mouseup;
    canvas.onmousemove = mousemove;
    canvas.onwheel = wheelscroll;
    canvas.addEventListener("touchstart", touchstart, { passive: false });
    canvas.addEventListener("touchend", touchend, { passive: false });
    canvas.addEventListener("touchmove", touchmove, { passive: false });
}


function getShader(shaderSource, type) {
    var shader;
    if (type == "vertex")
        shader = gl.createShader(gl.VERTEX_SHADER);
    else if (type == "fragment")
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    else {
        console.error("Invalid shader type");
        return;
    }

    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Error compiling " + type + " shader!", gl.getShaderInfoLog(shader));
        return;
    }
    return shader;
}


function initShaders(vertexShaderSource, fragmentShaderSource) {
    var vertexShader = getShader(vertexShaderSource, "vertex");
    var fragmentShader = getShader(fragmentShaderSource, "fragment");

    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Error linking program!", gl.getProgramInfoLog(program));
        return;
    }
    return program;
}


function loadTexture(url) {
    const newTexture = gl.createTexture();

    if (url == null || url == "Blue") {
        gl.bindTexture(gl.TEXTURE_2D, newTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
        gl.bindTexture(gl.TEXTURE_2D, null);
    } else {
        const image = new Image();
        image.onload = () => {
            gl.bindTexture(gl.TEXTURE_2D, newTexture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

            gl.bindTexture(gl.TEXTURE_2D, null);
        };
        image.src = "assets/" + url + ".png";
    }

    return newTexture;
}


function drawAxes() {
    // vertex
    gl.bindBuffer(gl.ARRAY_BUFFER, axesBuffer.vertexBuffer);
    gl.vertexAttribPointer(axesBuffer.positionAttribLocation, 3, gl.FLOAT, false, 0, 0);

    // color
    gl.bindBuffer(gl.ARRAY_BUFFER, axesBuffer.colorBuffer);
    gl.vertexAttribPointer(axesBuffer.colorAttribLocation, 3, gl.FLOAT, false, 0, 0);

    // index
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, axesBuffer.indexBuffer);

    gl.drawElements(gl.LINES, axesBuffer.indicesLength, gl.UNSIGNED_SHORT, 0);
}


function drawModel() {
    // vertex
    gl.bindBuffer(gl.ARRAY_BUFFER, modelBuffer.vertexBuffer);
    gl.vertexAttribPointer(modelBuffer.positionAttribLocation, 3, gl.FLOAT, false, 0, 0);

    // normal
    gl.bindBuffer(gl.ARRAY_BUFFER, modelBuffer.normalBuffer);
    gl.vertexAttribPointer(modelBuffer.normalAttribLocation, 3, gl.FLOAT, false, 0, 0);

    // texture coord
    gl.bindBuffer(gl.ARRAY_BUFFER, modelBuffer.textureBuffer);
    gl.vertexAttribPointer(modelBuffer.textureAttribLocation, 2, gl.FLOAT, false, 0, 0);

    // index
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, modelBuffer.indexBuffer);

    if (shaderName == "Wireframe")
        gl.drawElements(gl.LINES, modelBuffer.indicesLength, gl.UNSIGNED_SHORT, 0);
    else
        gl.drawElements(gl.TRIANGLES, modelBuffer.indicesLength, gl.UNSIGNED_SHORT, 0);
}


function drawControlPoints() {
    for (let i = 0; i < controlPointsModelsBuffers.length; i++) {
        // vertex
        gl.bindBuffer(gl.ARRAY_BUFFER, controlPointsModelsBuffers[i].vertexBuffer);
        gl.vertexAttribPointer(controlPointsModelsBuffers[i].positionAttribLocation, 3, gl.FLOAT, false, 0, 0);

        // color
        gl.bindBuffer(gl.ARRAY_BUFFER, controlPointsModelsBuffers[i].colorBuffer);
        gl.vertexAttribPointer(controlPointsModelsBuffers[i].colorAttribLocation, 3, gl.FLOAT, false, 0, 0);

        // index
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, controlPointsModelsBuffers[i].indexBuffer);

        gl.drawElements(gl.TRIANGLES, controlPointsModelsBuffers[i].indicesLength, gl.UNSIGNED_SHORT, 0);
    }
}


function drawEvaluatePoint() {
    // vertex
    gl.bindBuffer(gl.ARRAY_BUFFER, evaluatePointModelBuffer.vertexBuffer);
    gl.vertexAttribPointer(evaluatePointModelBuffer.positionAttribLocation, 3, gl.FLOAT, false, 0, 0);

    // color
    gl.bindBuffer(gl.ARRAY_BUFFER, evaluatePointModelBuffer.colorBuffer);
    gl.vertexAttribPointer(evaluatePointModelBuffer.colorAttribLocation, 3, gl.FLOAT, false, 0, 0);

    // index
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, evaluatePointModelBuffer.indexBuffer);

    gl.drawElements(gl.TRIANGLES, evaluatePointModelBuffer.indicesLength, gl.UNSIGNED_SHORT, 0);
}


function drawControlLines() {
    // vertex
    gl.bindBuffer(gl.ARRAY_BUFFER, controlLinesBuffer.vertexBuffer);
    gl.vertexAttribPointer(controlLinesBuffer.positionAttribLocation, 3, gl.FLOAT, false, 0, 0);

    // index
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, controlLinesBuffer.indexBuffer);

    gl.drawElements(gl.LINES, controlLinesBuffer.indicesLength, gl.UNSIGNED_SHORT, 0);
}


function setModelUniforms() {
    var mvMatrixUniformLocation = gl.getUniformLocation(modelShaderProgram, "uMVMatrix");
    gl.uniformMatrix4fv(mvMatrixUniformLocation, false, mvMatrix);

    var normalMVMatrixUniformLocation = gl.getUniformLocation(modelShaderProgram, "uNormalMVMatrix");
    gl.uniformMatrix3fv(normalMVMatrixUniformLocation, false, normalMVMatrix);

    var pMatrixUniformLocation = gl.getUniformLocation(modelShaderProgram, "uPMatrix");
    gl.uniformMatrix4fv(pMatrixUniformLocation, false, pMatrix);

    var KaUniformLocation = gl.getUniformLocation(modelShaderProgram, "Ka");
    gl.uniform1f(KaUniformLocation, Ka);

    var KdUniformLocation = gl.getUniformLocation(modelShaderProgram, "Kd");
    gl.uniform1f(KdUniformLocation, Kd);

    var KsUniformLocation = gl.getUniformLocation(modelShaderProgram, "Ks");
    gl.uniform1f(KsUniformLocation, Ks);

    var light1UniformLocation = gl.getUniformLocation(modelShaderProgram, "light1Location");
    gl.uniform3fv(light1UniformLocation, lightLocations["light1"]);

    var light2UniformLocation = gl.getUniformLocation(modelShaderProgram, "light2Location");
    gl.uniform3fv(light2UniformLocation, lightLocations["light2"]);

    var light1ColorUniformLocation = gl.getUniformLocation(modelShaderProgram, "light1Color");
    gl.uniform3fv(light1ColorUniformLocation, lightColor["light1"]);

    var light2ColorUniformLocation = gl.getUniformLocation(modelShaderProgram, "light2Color");
    gl.uniform3fv(light2ColorUniformLocation, lightColor["light2"]);

    var samplerUniformLocation = gl.getUniformLocation(modelShaderProgram, "uSampler");
    gl.uniform1i(samplerUniformLocation, 0);
}


function setOthersUniforms(shaderProgram) {
    var mvMatrixUniformLocation = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    gl.uniformMatrix4fv(mvMatrixUniformLocation, false, mvMatrix);

    var pMatrixUniformLocation = gl.getUniformLocation(shaderProgram, "uPMatrix");
    gl.uniformMatrix4fv(pMatrixUniformLocation, false, pMatrix);
}


function drawScene() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

    mat4.identity(mvMatrix);

    // translate
    mat4.translate(mvMatrix, modelLocation);
    // scale
    mat4.scale(mvMatrix, scale);
    // rotate
    mat4.rotateX(mvMatrix, rotateAngle.x);
    mat4.rotateY(mvMatrix, rotateAngle.y);

    // normal matrix
    var inverseMVMatrix = mat4.create();
    mat4.inverse(mvMatrix, inverseMVMatrix);
    mat4.toMat3(inverseMVMatrix, normalMVMatrix);
    mat3.transpose(normalMVMatrix);

    // draw model
    gl.useProgram(modelShaderProgram);
    if (modelChanged) {
        loadModel();
        modelChanged = false;
    }
    setModelUniforms();

    if (textures[textureName] == null)
        textures[textureName] = loadTexture(textureName, "color");
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textures[textureName]);

    drawModel();

    // draw evaluation point
    if (showEvaluatePoint) {
        if (evaluatePointChanged) {
            loadEvaluatePoint();
            evaluatePointChanged = false;
        }
        gl.useProgram(controlPointShaderProgram);
        setOthersUniforms(controlPointShaderProgram);
        drawEvaluatePoint();
    }

    // draw control points and lines
    if (showControlPoints) {
        if (controlPointsChanged) {
            loadControlPoints();
            loadControlLines();
            controlPointsChanged = false;
        }
        gl.useProgram(controlPointShaderProgram);
        setOthersUniforms(controlPointShaderProgram);
        drawControlPoints();
        gl.useProgram(controlLineShaderProgram);
        setOthersUniforms(controlLineShaderProgram);
        drawControlLines();
    }

    // draw axes
    gl.useProgram(axesShaderProgram);
    setOthersUniforms(axesShaderProgram);
    drawAxes();
}


function tick() {
    requestAnimFrame(tick);
    drawScene();
}
