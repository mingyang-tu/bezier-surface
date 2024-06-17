var rotateAngle = { x: 0, y: 0 };
var scale = vec3.create([1.0, 1.0, 1.0]);

var ui = {
    dragging: false,
    lastX: -1,
    lastY: -1,
};


function mousedown(event) {
    var x = event.clientX;
    var y = event.clientY;
    var rect = event.target.getBoundingClientRect();
    if (rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom) {
        ui.lastX = x;
        ui.lastY = y;
        ui.dragging = true;
    }
}


function mouseup(event) {
    ui.dragging = false;
}


function mousemove(event) {
    var x = event.clientX;
    var y = event.clientY;
    if (ui.dragging) {
        var factor = 0.01;
        var dx = factor * (x - ui.lastX);
        var dy = factor * (y - ui.lastY);

        rotateAngle.x = rotateAngle.x + dy;
        rotateAngle.y = rotateAngle.y + dx;
    }
    ui.lastX = x;
    ui.lastY = y;
}


function wheelscroll(event) {
    event.preventDefault();

    var zoom = scale[0];
    zoom -= event.deltaY * 0.01;
    zoom = Math.min(Math.max(0.125, zoom), 4)
    for (var i = 0; i < 3; i++)
        scale[i] = zoom;
}
