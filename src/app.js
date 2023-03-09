var gl; // глобальная переменная для контекста WebGL

const vsSource = 'attribute vec3 vertPosition;\n' +
                 'attribute vec3 vertColor;\n' +
                 'varying vec3 fragColor;\n' +
                 'varying vec3 fragPosition;\n' +
                 'uniform mat4 mWorld;\n' +
                 'void main()\n' +
                 '{\n' +
                 '  fragColor = vertColor;\n' +
                 '  fragPosition = vertPosition;\n' +
                 '  gl_Position = mWorld * vec4(vertPosition, 1.0);\n' +
                 '}'

const fsSource = 'precision mediump float;\n' +
                 'varying vec3 fragColor;\n' +
                 'void main()\n' + 
                 '{\n' +
                 '  gl_FragColor = vec4(fragColor, 1.0);\n' +
                 '}'

const fsSourceLines = 'precision mediump float;\n' +
                'varying vec3 fragColor;\n' +
                'varying vec3 fragPosition;\n' +
                'void main()\n' + 
                '{\n' +
                'int x = int(fragPosition.x * 10.0);\n' +
                'float y = mod(float(x), 2.0);\n' + 
                'if ((y == 0.0) && (x < 0) || (y != 0.0) && (x >= 0) || fragPosition.x <= 0.0 && fragPosition.x >= -0.1){\n' +
                'gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n' +
                '}\n' +
                'else{' +
                'gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);' +
                '}\n' +
                '}'
                 
function initWebGL(canvas) 
{
    gl = null;
    try 
    { // Попытаться получить стандартный контекст.
    // Если не получится, попробовать получить экспериментальный.
        gl = canvas.getContext("webgl2") || canvas.getContext("webgl") || canvas.getContext("experimentalwebgl");
    }
    catch(e) {}
    // Если мы не получили контекст GL, завершить работу
    if (!gl) {
        alert("Unable to initialize WebGL. Your browser may not support it.");
        gl = null;
    }

    return gl;
}

function loadShader(gl, type, source) 
{
    const shader = gl.createShader(type);
    // Send the source to the shader object
    gl.shaderSource(shader, source);
    // Compile the shader program
    gl.compileShader(shader);
    // See if it compiled successfully
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) 
    {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

function initBuffersPolygon() 
{
	let triangleVerticesBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVerticesBuffer);

	let vertices = 
    [
        0.0, 0.0, 0.0,  1.0, 0.0, 0.0,
        -0.6, -0.1, 0.0, 1.0, 0.0, 0.0,
		0.0, -0.5, 0.0, 1.0, 0.0, 0.0,
		-0.35, 0.5, 0.0, 1.0, 0.0, 0.0 ,
        0.35, 0.5, 0.0, 1.0, 0.0, 0.0 ,
        0.6, -0.1, 0.0, 1.0, 0.0, 0.0 ,
        0.0, -0.5, 0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 0.0, 1.0, 0.0, 0.0,
	];

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
}

function initBuffersCube() 
{
	let squareVerticesBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);

	let vertices = 
    [ // X, Y, Z           R, G, B
		// Front
		-0.5, -0.5, -0.5,   0.5, 0.5, 0.5, // 3
		-0.5, 0.5, -0.5,    0.5, 0.5, 0.5, // 1
		0.5, 0.5, -0.5,     0.5, 0.5, 0.5, // 2

        -0.5, -0.5, -0.5,   0.5, 0.5, 0.5, // 3
		0.5, 0.5, -0.5,     0.5, 0.5, 0.5, // 2
        0.5, -0.5, -0.5,     0.5, 0.5, 0.5, // 4

        // Top
        -0.5, 0.5, -0.5,    0.2, 0.7, 0.1, // 1
        -0.5, 0.5, 0.5,    0.2, 0.7, 0.1, // 5
        0.5, 0.5, 0.5,     0.2, 0.7, 0.1, // 6

        -0.5, 0.5, -0.5,    0.2, 0.7, 0.1, // 1
        0.5, 0.5, -0.5,     0.2, 0.7, 0.1, // 2
        0.5, 0.5, 0.5,     0.2, 0.7, 0.1, // 6

        // Bottom
        -0.5, -0.5, -0.5,   0.1, 0.5, 0.0, // 3
		0.5, -0.5, 0.5,     0.1, 0.5, 0.0, // 8
        0.5, -0.5, -0.5,     0.1, 0.5, 0.0, // 4

        -0.5, -0.5, -0.5,   0.1, 0.5, 0.0, // 3
		0.5, -0.5, 0.5,     0.1, 0.5, 0.0, // 8
        -0.5, -0.5, 0.5,   0.1, 0.5, 0.0, // 7

        // Left
        -0.5, -0.5, -0.5,   0.5, 0.0, 1.0, // 3
		-0.5, 0.5, -0.5,    0.5, 0.0, 1.0, // 1
        -0.5, -0.5, 0.5,   0.5, 0.0, 1.0, // 7

        -0.5, 0.5, 0.5,    0.5, 0.0, 1.0, // 5
		-0.5, 0.5, -0.5,    0.5, 0.0, 1.0, // 1
        -0.5, -0.5, 0.5,   0.5, 0.0, 1.0, // 7

        //Right
        0.5, 0.5, -0.5,     0.2, 1.0, 0.1, // 2
		0.5, -0.5, 0.5,     0.2, 1.0, 0.1, // 8
        0.5, -0.5, -0.5,     0.2, 1.0, 0.1, // 4

        0.5, 0.5, -0.5,     0.2, 1.0, 0.1, // 2
		0.5, -0.5, 0.5,     0.2, 1.0, 0.1, // 8
        0.5, 0.5, 0.5,     0.2, 1.0, 0.1, // 6

        //Back
        -0.5, 0.5, 0.5,    0.2, 0.3, 0.5, // 5
		0.5, 0.5, 0.5,     0.2, 0.3, 0.5, // 6
        -0.5, -0.5, 0.5,   0.2, 0.3, 0.5, // 7

        0.5, -0.5, 0.5,     0.2, 0.3, 0.5, // 8
		0.5, 0.5, 0.5,     0.2, 0.3, 0.5, // 6
        -0.5, -0.5, 0.5,   0.2, 0.3, 0.5, // 7
	];

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
}

function initBuffersSquare()
{
    let squareVerticesBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);

	let vertices = 
    [ 
        -0.5, -0.5, 0.0,     0.2, 0.3, 0.5,
        -0.5, 0.5, 0.0,     0.2, 0.3, 0.5,
        0.5, -0.5, 0.0,     0.2, 0.3, 0.5,
        0.5, 0.5, 0.0,     0.2, 0.3, 0.5,
        0.0, 0.0, 0.0,     0.2, 0.3, 0.5,
	];

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
}

function initShaderProgram(gl, vsSource, fsSource) 
{
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource); 

    // Create the shader program
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    // If creating the shader program failed, alert
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) 
    {
        alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }

    return shaderProgram;
}

let vertexPositionAttribute
let vertColorAttribute

function drawScenePolygon() {
	gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 6*Float32Array.BYTES_PER_ELEMENT, 0);
	gl.vertexAttribPointer(vertColorAttribute, 3, gl.FLOAT, false, 6*Float32Array.BYTES_PER_ELEMENT, 3*Float32Array.BYTES_PER_ELEMENT);
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 80);
}

function drawSceneCube() {

	gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 6*Float32Array.BYTES_PER_ELEMENT, 0);
	gl.vertexAttribPointer(vertColorAttribute, 3, gl.FLOAT, false, 6*Float32Array.BYTES_PER_ELEMENT, 3*Float32Array.BYTES_PER_ELEMENT);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

	gl.drawArrays(gl.TRIANGLES, 0, 40);
}

function drawSceneLineQuad() {

	gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 6*Float32Array.BYTES_PER_ELEMENT, 0);
	gl.vertexAttribPointer(vertColorAttribute, 3, gl.FLOAT, false, 6*Float32Array.BYTES_PER_ELEMENT, 3*Float32Array.BYTES_PER_ELEMENT);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 40);

}

function start() 
{
    // ============== Polygon =============
    var canvas = document.getElementById("glcanvas");
    gl = initWebGL(canvas); // инициализация контекста GL – сами пишем

    const shaderProgramPoltgon = initShaderProgram(gl, vsSource, fsSource);
    // продолжать только если WebGL доступен и работает  

    if (gl) 
    { // продолжать только если WebGL доступен и работает
        // Устанавливаем размер вьюпорта
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        // установить в качестве цвета очистки буфера цвета черный, полная непрозрачность
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        // включает использование буфера глубины
        gl.enable(gl.DEPTH_TEST);
        // определяет работу буфера глубины: более ближние объекты перекрывают дальние
        gl.depthFunc(gl.LEQUAL);
        // очистить буфер цвета и буфер глубины
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT); 
    }

    initBuffersPolygon()
    vertexPositionAttribute = gl.getAttribLocation(shaderProgramPoltgon, "vertPosition");
    vertColorAttribute = gl.getAttribLocation(shaderProgramPoltgon, "vertColor");
    gl.enableVertexAttribArray(vertexPositionAttribute);
    gl.enableVertexAttribArray(vertColorAttribute);
    gl.useProgram(shaderProgramPoltgon);

    var matWorldUniformLocation = gl.getUniformLocation(shaderProgramPoltgon, 'mWorld');

	var worldMatrix = new Float32Array(16);
	glMatrix.mat4.identity(worldMatrix);

	gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

    drawScenePolygon()

    // ============== Cube =============

    var canvas2 = document.getElementById("cubeCanvas");
    initWebGL(canvas2)
    if (gl) 
    { // продолжать только если WebGL доступен и работает
        // Устанавливаем размер вьюпорта
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        // установить в качестве цвета очистки буфера цвета черный, полная непрозрачность
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        // включает использование буфера глубины
        gl.enable(gl.DEPTH_TEST);
        // определяет работу буфера глубины: более ближние объекты перекрывают дальние
        gl.depthFunc(gl.LEQUAL);
        // очистить буфер цвета и буфер глубины
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT); 
    }

    const shaderProgramCube = initShaderProgram(gl, vsSource, fsSource);

    initBuffersCube()
    vertexPositionAttribute = gl.getAttribLocation(shaderProgramCube, "vertPosition");
    vertColorAttribute = gl.getAttribLocation(shaderProgramCube, "vertColor");
    gl.enableVertexAttribArray(vertexPositionAttribute);
    gl.enableVertexAttribArray(vertColorAttribute);
    gl.useProgram(shaderProgramCube);

    matWorldUniformLocation = gl.getUniformLocation(shaderProgramCube, 'mWorld');

	worldMatrix = new Float32Array(16);
	glMatrix.mat4.identity(worldMatrix);

	gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

    var xRotationMatrix = new Float32Array(16);
	var yRotationMatrix = new Float32Array(16);

	var identityMatrix = new Float32Array(16);
	glMatrix.mat4.identity(identityMatrix);
	var angle = 0.25 * Math.PI;
    glMatrix.mat4.rotate(yRotationMatrix, identityMatrix, angle * 3, [0, 1, 0]);
    glMatrix.mat4.rotate(xRotationMatrix, identityMatrix, angle / 3, [1, 0, 0]);
    glMatrix.mat4.mul(worldMatrix, yRotationMatrix, xRotationMatrix);
    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

    drawSceneCube()

    // ============== Square =============

    var canvas3 = document.getElementById("lineSquareCanvas");
    initWebGL(canvas3); // инициализация контекста GL – сами пишем

    const shaderProgramLineSquare = initShaderProgram(gl, vsSource, fsSourceLines);
    // продолжать только если WebGL доступен и работает  

    if (gl) 
    { // продолжать только если WebGL доступен и работает
        // Устанавливаем размер вьюпорта
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        // установить в качестве цвета очистки буфера цвета черный, полная непрозрачность
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        // включает использование буфера глубины
        gl.enable(gl.DEPTH_TEST);
        // определяет работу буфера глубины: более ближние объекты перекрывают дальние
        gl.depthFunc(gl.LEQUAL);
        // очистить буфер цвета и буфер глубины
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT); 
    }

    initBuffersSquare()

    vertexPositionAttribute = gl.getAttribLocation(shaderProgramLineSquare, "vertPosition");
    vertColorAttribute = gl.getAttribLocation(shaderProgramLineSquare, "vertColor");
    gl.enableVertexAttribArray(vertexPositionAttribute);
    gl.enableVertexAttribArray(vertColorAttribute);
    gl.useProgram(shaderProgramLineSquare);

    var matWorldUniformLocation = gl.getUniformLocation(shaderProgramLineSquare, 'mWorld');

	var worldMatrix = new Float32Array(16);
	glMatrix.mat4.identity(worldMatrix);

	gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

    drawSceneLineQuad()
}

start() 