function createSphere(center, color, radius = 0.04) {
    const LATITUDE_BANDS = 8;
    const LONGITUDE_BANDS = 8;

    let vertices = [];
    let colors = [];
    let indices = [];

    for (let latNumber = 0; latNumber <= LATITUDE_BANDS; latNumber++) {
        let theta = latNumber * Math.PI / LATITUDE_BANDS;
        let sinTheta = Math.sin(theta);
        let cosTheta = Math.cos(theta);

        for (let longNumber = 0; longNumber <= LONGITUDE_BANDS; longNumber++) {
            let phi = longNumber * 2 * Math.PI / LONGITUDE_BANDS;
            let sinPhi = Math.sin(phi);
            let cosPhi = Math.cos(phi);

            let x = cosPhi * sinTheta;
            let y = cosTheta;
            let z = sinPhi * sinTheta;

            vertices.push(radius * x + center[0]);
            vertices.push(radius * y + center[1]);
            vertices.push(radius * z + center[2]);

            colors.push(color[0]);
            colors.push(color[1]);
            colors.push(color[2]);
        }
    }

    for (let latNumber = 0; latNumber < LATITUDE_BANDS; latNumber++) {
        for (let longNumber = 0; longNumber < LONGITUDE_BANDS; longNumber++) {
            let first = (latNumber * (LATITUDE_BANDS + 1)) + longNumber;
            let second = first + LONGITUDE_BANDS + 1;

            indices.push(first);
            indices.push(second);
            indices.push(first + 1);

            indices.push(second);
            indices.push(second + 1);
            indices.push(first + 1);
        }
    }

    return {
        vertices: new Float32Array(vertices),
        colors: new Float32Array(colors),
        indices: new Uint16Array(indices)
    };
}
