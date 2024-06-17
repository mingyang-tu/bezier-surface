var Ka = 0.3;
var Kd = 0.3;
var Ks = 0.2;

var lightLocations = {
    "light1": new Float32Array([-100, 100, 100]),
    "light2": new Float32Array([100, 100, 100]),
};
var lightColor = {
    "light1": new Float32Array([1, 1, 1]),
    "light2": new Float32Array([1, 1, 1]),
};

var modelChanged = true;
var controlPointsChanged = true;
var evaluatePointChanged = true;

var showControlPoints = true;
var showEvaluatePoint = false;

var selectedPoint = 0;

var controlPoints = [
    [-1.5, 0.0, -1.5],
    [-1.5, 0.5, -0.5],
    [-1.5, 0.5, 0.5],
    [-1.5, 0.0, 1.5],
    [-0.5, 0.5, -1.5],
    [-0.5, 1.0, -0.5],
    [-0.5, 1.0, 0.5],
    [-0.5, 0.5, 1.5],
    [0.5, 0.5, -1.5],
    [0.5, 1.0, -0.5],
    [0.5, 1.0, 0.5],
    [0.5, 0.5, 1.5],
    [1.5, 0.0, -1.5],
    [1.5, 0.5, -0.5],
    [1.5, 0.5, 0.5],
    [1.5, 0.0, 1.5]
];

var controlPointsColors = [
    [1.0, 0.0, 0.0],
    [1.0, 0.0, 0.0],
    [1.0, 0.0, 0.0],
    [1.0, 0.0, 0.0],
    [1.0, 0.0, 0.0],
    [1.0, 0.0, 0.0],
    [1.0, 0.0, 0.0],
    [1.0, 0.0, 0.0],
    [1.0, 0.0, 0.0],
    [1.0, 0.0, 0.0],
    [1.0, 0.0, 0.0],
    [1.0, 0.0, 0.0],
    [1.0, 0.0, 0.0],
    [1.0, 0.0, 0.0],
    [1.0, 0.0, 0.0],
    [1.0, 0.0, 0.0]
];

var toEvaluate = { u: 0.0, v: 0.0 };

var shaderName = "Phong";
var textureName = "Blue";


function update_selected_point() {
    controlPointsChanged = true;

    if (selectedPoint > 0 || selectedPoint < controlPoints.length)
        controlPointsColors[selectedPoint - 1] = [1.0, 0.0, 0.0];

    var tmp = parseInt(document.getElementById("selected-point").value);
    if (isNaN(tmp) || tmp <= 0 || tmp > controlPoints.length) {
        document.getElementById("pointX").value = "";
        document.getElementById("pointY").value = "";
        document.getElementById("pointZ").value = "";
        return;
    }
    selectedPoint = tmp;
    controlPointsColors[selectedPoint - 1] = [1.0, 0.9, 0.2];
    document.getElementById("pointX").value = controlPoints[selectedPoint - 1][0];
    document.getElementById("pointY").value = controlPoints[selectedPoint - 1][1];
    document.getElementById("pointZ").value = controlPoints[selectedPoint - 1][2];
}


function update_point() {
    if (selectedPoint <= 0 || selectedPoint > controlPoints.length)
        return;
    var x = parseFloat(document.getElementById("pointX").value);
    var y = parseFloat(document.getElementById("pointY").value);
    var z = parseFloat(document.getElementById("pointZ").value);
    controlPoints[selectedPoint - 1] = [x, y, z];
    modelChanged = true;
    controlPointsChanged = true;
    evaluatePointChanged = true;
}


function update_evaluate_point() {
    toEvaluate["u"] = parseFloat(document.getElementById("evaluate-u").value);
    toEvaluate["v"] = parseFloat(document.getElementById("evaluate-v").value);
    document.getElementById("u-value").textContent = `u = ${toEvaluate["u"].toFixed(2)}`;
    document.getElementById("v-value").textContent = `v = ${toEvaluate["v"].toFixed(2)}`;
    evaluatePointChanged = true;
}


function toggle_control_points() {
    showControlPoints = document.getElementById("control-points-toggle").checked;
}


function toggle_evaluate_point() {
    showEvaluatePoint = document.getElementById("evaluate-point-toggle").checked;
}


function update_Ka() {
    Ka = document.getElementById("item-ka").value;
}


function update_Kd() {
    Kd = document.getElementById("item-kd").value;
}


function update_Ks() {
    Ks = document.getElementById("item-ks").value;
}


function update_light_location(light) {
    lightLocations[light][0] = document.getElementById(light + "-locX").value;
    lightLocations[light][1] = document.getElementById(light + "-locY").value;
    lightLocations[light][2] = document.getElementById(light + "-locZ").value;
}


function toggle_light(light) {
    if (document.getElementById(light + "-toggle").checked) {
        for (var i = 0; i < 3; i++)
            lightColor[light][i] = 1.0;
    }
    else {
        for (var i = 0; i < 3; i++)
            lightColor[light][i] = 0.0;
    }
}


function update_shader() {
    shaderName = document.getElementById("item-shader").value;
}


function update_texture() {
    textureName = document.getElementById("item-texture").value;
}
