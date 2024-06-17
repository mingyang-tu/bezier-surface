const MODEL_VERTEX = /* glsl */ `
    precision mediump float;

    attribute vec3 aVertexPosition;
    attribute vec3 aVertexNormal;
    attribute vec2 aTextureCoord;

    uniform mat4 uMVMatrix;
    uniform mat4 uPMatrix;
    uniform mat3 uNormalMVMatrix;

    varying vec3 mvVertex;
    varying vec3 mvNormal;
    varying vec2 fragTextureCoord;

    void main(void) {
        mvVertex = (uMVMatrix * vec4(aVertexPosition, 1.0)).xyz;
        mvNormal = uNormalMVMatrix * aVertexNormal;
        fragTextureCoord = aTextureCoord;
        gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    }
`;

const MODEL_FRAGMENT = /* glsl */ `
    precision mediump float;

    // Ka, Kd, Ks
    uniform float Ka;
    uniform float Kd;
    uniform float Ks;
    // light location (x,y,z)
    uniform vec3 light1Location;
    uniform vec3 light2Location;
    // light intensity
    uniform vec3 light1Color;
    uniform vec3 light2Color;

    uniform sampler2D uSampler;

    varying vec3 mvVertex;
    varying vec3 mvNormal;
    varying vec2 fragTextureCoord;

    void main(void) {
        // V, N, L, H
        vec3 V = -normalize(mvVertex);
        vec3 N = normalize(mvNormal);
        if (gl_FrontFacing == false) {
            N = -N;
        }
        vec3 L1 = normalize(light1Location - mvVertex);
        vec3 L2 = normalize(light2Location - mvVertex);
        vec3 H1 = normalize(L1 + V);
        vec3 H2 = normalize(L2 + V);

        vec3 fragcolor = texture2D(uSampler, fragTextureCoord).rgb;
        vec3 ambient = Ka * fragcolor;
        vec3 diffuse1 = light1Color * Kd * fragcolor * max(dot(N, L1), 0.0);
        vec3 diffuse2 = light2Color * Kd * fragcolor * max(dot(N, L2), 0.0);
        vec3 specular1 = light1Color * Ks * pow(max(dot(N, H1), 0.0), 16.0);
        vec3 specular2 = light2Color * Ks * pow(max(dot(N, H2), 0.0), 16.0);

        vec3 color = ambient + diffuse1 + diffuse2 + specular1 + specular2;
        gl_FragColor = vec4(color, 1.0);
    }
`;

const POINT_VERTEX = /* glsl */ `
    precision mediump float;

    attribute vec3 aVertexPosition;
    attribute vec3 aVertexColor;

    uniform mat4 uMVMatrix;
    uniform mat4 uPMatrix;

    varying vec4 fragcolor;

    void main(void) {
        gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
        fragcolor = vec4(aVertexColor, 1.0);
    }
`;

const POINT_FRAGMENT = /* glsl */ `
    precision mediump float;

    varying vec4 fragcolor;

    void main(void) {
        gl_FragColor = fragcolor;
    }
`;

const LINE_VERTEX = /* glsl */ `
    precision mediump float;

    attribute vec3 aVertexPosition;

    uniform mat4 uMVMatrix;
    uniform mat4 uPMatrix;

    void main(void) {
        gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    }
`;

const LINE_FRAGMENT = /* glsl */ `
    precision mediump float;

    void main(void) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
`;

const AXES_VERTEX = /* glsl */ `
    precision mediump float;

    attribute vec3 aVertexPosition;
    attribute vec3 aVertexColor;

    uniform mat4 uMVMatrix;
    uniform mat4 uPMatrix;

    varying vec4 fragcolor;

    void main(void) {
        gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
        fragcolor = vec4(aVertexColor, 1.0);
    }
`;

const AXES_FRAGMENT = /* glsl */ `
    precision mediump float;

    varying vec4 fragcolor;

    void main(void) {
        gl_FragColor = fragcolor;
    }
`;
