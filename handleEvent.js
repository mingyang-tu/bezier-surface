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


function touchstart(event) {
    if (event.touches.length == 1) {
        var touch = event.touches[0];
        var x = touch.clientX;
        var y = touch.clientY;
        var rect = event.target.getBoundingClientRect();
        if (rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom) {
            ui.lastX = x;
            ui.lastY = y;
            ui.dragging = true;
        }
    } else if (event.touches.length == 2) {
        ui.lastTouchDistance = getTouchDistance(event);
    }
}


function touchend(event) {
    ui.dragging = false;
}


function touchmove(event) {
    event.preventDefault();

    if (event.touches.length == 1 && ui.dragging) {
        var touch = event.touches[0];
        var x = touch.clientX;
        var y = touch.clientY;
        var factor = 0.01;
        var dx = factor * (x - ui.lastX);
        var dy = factor * (y - ui.lastY);

        rotateAngle.x = rotateAngle.x + dy;
        rotateAngle.y = rotateAngle.y + dx;

        ui.lastX = x;
        ui.lastY = y;
    } else if (event.touches.length == 2) {
        var newDistance = getTouchDistance(event);
        var scaleFactor = newDistance / ui.lastTouchDistance;
        ui.lastTouchDistance = newDistance;

        var zoom = scale[0] * scaleFactor;
        zoom = Math.min(Math.max(0.125, zoom), 4);
        for (var i = 0; i < 3; i++)
            scale[i] = zoom;
    }
}


function getTouchDistance(event) {
    var dx = event.touches[0].clientX - event.touches[1].clientX;
    var dy = event.touches[0].clientY - event.touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
}
