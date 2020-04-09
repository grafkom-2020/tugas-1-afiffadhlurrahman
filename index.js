let full = false;
let resized = false;
const identity = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

function main() {

  // Inisiasi kanvas WebGL
    var leftCanvas = document.getElementById("leftCanvas");
    var rightCanvas = document.getElementById("rightCanvas");
    var leftGL = leftCanvas.getContext("webgl");
    var rightGL = rightCanvas.getContext("webgl");
    resize();

    // Inisiasi verteks persegi
    var rectangleVertices = [
      -0.3,  0.3,
      -0.3, -0.3,
      0.3, -0.3,
    
      -0.3,  0.3,  
      0.3, -0.3,
      0.3, 0.3,
    
      
      0.3,  0.3,
      0.3,  0.1,
      0.5,  0.1,

      0.3,  0.3,
      0.5,  0.1,
      0.5,  0.3
    ];

    // Inisiasi verteks kubus
    var cubeVertices = [];
    var cubePoints = [
      [-0.2,  0.2,  0.2],   // A, 0
      [-0.2, -0.2,  0.2],   // B, 1
      [ 0.2, -0.2,  0.2],   // C, 2 
      [ 0.2,  0.2,  0.2],   // D, 3
      [-0.2,  0.2, -0.4],   // E, 4
      [-0.2, -0.2, -0.4],   // F, 5
      [ 0.2, -0.2, -0.4],   // G, 6
      [ 0.2,  0.2, -0.4],    // H, 7
      
      // y kanan kiri, x atas bawah
      [ 0.15, 0.2,0.35],   // A, 8
      [ 0.15, 0,  0.35],   // B, 9
      [ 0.2,  0,  0.35],   // C, 10 
      [ 0.2, 0.2, 0.35],   // D, 11
      [ 0.15, 0.2, 0.2],   // E, 12
      [ 0.15,   0, 0.2],   // F, 13
      [ 0.2,    0, 0.2],   // G, 14
      [ 0.2,  0.2, 0.2],    // H, 15

      // y kanan kiri, x atas bawah
      [ 0.1 ,      0,  0.35],   // A, 8
      [ 0.1 ,   -0.2,  0.35],   // B, 9
      [ 0.15,   -0.2,  0.35],   // C, 10 
      [ 0.15,      0,  0.35],   // D, 11
      [ 0.1 ,      0,   0.2],   // E, 12
      [ 0.1 ,   -0.2,   0.2],   // F, 13
      [ 0.15,   -0.2,   0.2],   // G, 14
      [ 0.15,      0,   0.2],    // H, 15
    ];
    var cubeColors = [
        [],
        [0.1, 0.1, 0.1],    // merah
        [0.6, 0.6, 0.6],    // hijau
        [0.3, 0.3, 0.3],    // biru
        [1.0, 1.0, 1.0],    // putih
        [0.1, 0.1, 0.1],    // oranye
        [0.3, 0.3, 0.3],    // kuning
        [],
        [],
        [0.6, 0.6, 0.6],    // abu abu, 9 -> 13, top, abu cerah kurang
        [0.2, 0.2, 0.2],    // abu abu, 10, samping ,abu cerah
        [0.1, 0.1, 0.1],    // abu abu, 11, sejajar biru, depan, abu gelap
        [0.2, 0.2, 0.2],    // abu abu, 12, abu gelap
        [0.6, 0.6, 0.6],    // abu abu, 13 -> 9
        [0.1, 0.1, 0.1],    // abu abu, 14 -> 11
        [],
        [],
        [0.6, 0.6, 0.6],    // abu abu, 9 -> 13, top, abu cerah kurang
        [0.2, 0.2, 0.2],    // abu abu, 10, samping ,abu cerah
        [0.1, 0.1, 0.1],    // abu abu, 11, sejajar biru, depan, abu gelap
        [0.2, 0.2, 0.2],    // abu abu, 12, abu gelap
        [0.6, 0.6, 0.6],    // abu abu, 13 -> 9
        [0.1, 0.1, 0.1],    // abu abu, 14 -> 11
        []
    ];
    function quad(a, b, c, d) {
        var indices = [a, b, c, c, d, a];
        for (var i=0; i<indices.length; i++) {  
            for (var j=0; j<3; j++) {
                cubeVertices.push(cubePoints[indices[i]][j]);
            }
            for (var j=0; j<3; j++) {
                cubeVertices.push(cubeColors[a][j]);
            }
        }
    }
     
    quad(1, 2, 3, 0); // Kubus depan
    quad(2, 6, 7, 3); // Kubus kanan
    quad(3, 7, 4, 0); // Kubus atas
    quad(4, 5, 1, 0); // Kubus kiri
    quad(5, 4, 7, 6); // Kubus belakang
    quad(6, 2, 1, 5); // Kubus bawah

    quad(9, 10, 11, 8);    // Kubus depan
    quad(10, 14, 15, 11);  // Kubus kanan
    quad(11, 15, 12, 8);   // Kubus atas
    quad(12, 13, 9, 8);    // Kubus kiri
    quad(13, 12, 15, 14);  // Kubus belakang
    quad(14, 10, 9, 13);   // Kubus bawah

    quad(17, 18, 19, 16);    // Kubus depan
    quad(18, 22, 23, 19);  // Kubus kanan
    quad(19, 23, 20, 16);   // Kubus atas
    quad(20, 21, 17, 16);    // Kubus kiri
    quad(21, 20, 23, 14);  // Kubus belakang
    quad(22, 18, 17, 21);   // Kubus bawah

    // Inisiasi VBO (Vertex Buffer Object)
    var leftVertexBuffer = leftGL.createBuffer();
    leftGL.bindBuffer(leftGL.ARRAY_BUFFER, leftVertexBuffer);
    leftGL.bufferData(leftGL.ARRAY_BUFFER, new Float32Array(rectangleVertices), leftGL.STATIC_DRAW);
    leftGL.bindBuffer(leftGL.ARRAY_BUFFER, null);
    var rightVertexBuffer = rightGL.createBuffer();
    rightGL.bindBuffer(rightGL.ARRAY_BUFFER, rightVertexBuffer);
    rightGL.bufferData(rightGL.ARRAY_BUFFER, new Float32Array(cubeVertices), rightGL.STATIC_DRAW);
    rightGL.bindBuffer(rightGL.ARRAY_BUFFER, null);

    // Definisi Shaders
    var leftVertexShaderCode = `
    attribute vec2 aPosition;
    uniform mat4 uModel;
    attribute vec3 aColor;
    varying vec3 vColor;
    void main(void) {
      gl_Position = uModel * vec4(aPosition, -0.5, 1.0);
    }
  `
  var leftFragmentShaderCode = `
    precision mediump float;
    varying vec3 vColor;
    void main() {
      gl_FragColor = vec4(vColor, 1.0);
    }
  `
    var rightVertexShaderCode = `
      attribute vec3 aPosition;
      attribute vec3 aColor;
      uniform mat4 uProjection;
      uniform mat4 uModel;
      varying vec3 vColor;
      void main(void) {
        vColor = aColor;
        gl_Position = uProjection * uModel * vec4(aPosition, 1.0);
      }
    `
    var rightFragmentShaderCode = `
      precision mediump float;
      varying vec3 vColor;
      void main() {
        gl_FragColor = vec4(vColor, 1.0);
      }
    `

  // Proses kompilasi, penautan (linking), dan eksekusi Shaders
  var vertexShader = leftGL.createShader(leftGL.VERTEX_SHADER);
  leftGL.shaderSource(vertexShader, leftVertexShaderCode);
  leftGL.compileShader(vertexShader);
  var fragmentShader = leftGL.createShader(leftGL.FRAGMENT_SHADER);
  leftGL.shaderSource(fragmentShader, leftFragmentShaderCode);
  leftGL.compileShader(fragmentShader);
  var leftShaderProgram = leftGL.createProgram();
  leftGL.attachShader(leftShaderProgram, vertexShader);
  leftGL.attachShader(leftShaderProgram, fragmentShader);
  leftGL.linkProgram(leftShaderProgram);
  leftGL.useProgram(leftShaderProgram);

  var vertexShader = rightGL.createShader(rightGL.VERTEX_SHADER);
  rightGL.shaderSource(vertexShader, rightVertexShaderCode);
  rightGL.compileShader(vertexShader);
  var fragmentShader = rightGL.createShader(rightGL.FRAGMENT_SHADER);
  rightGL.shaderSource(fragmentShader, rightFragmentShaderCode);
  rightGL.compileShader(fragmentShader);
  var rightShaderProgram = rightGL.createProgram();
  rightGL.attachShader(rightShaderProgram, vertexShader);
  rightGL.attachShader(rightShaderProgram, fragmentShader);
  rightGL.linkProgram(rightShaderProgram);
  rightGL.useProgram(rightShaderProgram);

  // Pengikatan VBO dan pengarahan pointer atribut posisi dan warna
  leftGL.bindBuffer(leftGL.ARRAY_BUFFER, leftVertexBuffer);
  var leftPosition = leftGL.getAttribLocation(leftShaderProgram, "aPosition");
  leftGL.vertexAttribPointer(leftPosition, 2, leftGL.FLOAT, false, 2 * Float32Array.BYTES_PER_ELEMENT, 0);
  leftGL.enableVertexAttribArray(leftPosition);

  rightGL.bindBuffer(rightGL.ARRAY_BUFFER, rightVertexBuffer);
  var rightPosition = rightGL.getAttribLocation(rightShaderProgram, "aPosition");
  rightGL.vertexAttribPointer(rightPosition, 3, rightGL.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 0);
  rightGL.enableVertexAttribArray(rightPosition);

  var leftcolor = leftGL.getAttribLocation(leftShaderProgram, "aColor");
  leftGL.vertexAttribPointer(leftcolor, 3, leftGL.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
  leftGL.enableVertexAttribArray(leftcolor);

  var rightcolor = rightGL.getAttribLocation(rightShaderProgram, "aColor");
  rightGL.vertexAttribPointer(rightcolor, 3, rightGL.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
  rightGL.enableVertexAttribArray(rightcolor);
  
  var n = 1, f = 50, fov = 60;
	var r = n * Math.tan(fov * Math.PI / 180 / 2);
	var projectionMatrix = [
		n/r, 0, 0, 0,
		0, n/r, 0, 0,
		0, 0, -(f+n)/(f-n), -1,
		0, 0, -2*f*n/(f-n), 0
	];
	
	var projection = rightGL.getUniformLocation(rightShaderProgram, "uProjection");
	rightGL.uniformMatrix4fv(projection, false, new Float32Array(projectionMatrix));
	
  // Persiapan tampilan layar dan mulai menggambar secara berulang (animasi)
  var rotX = 0, rotY = 0, rotZ = 0;
  function render() {
    if (resized) {
        leftGL.viewport(0, (leftGL.canvas.height - leftGL.canvas.width)/2, leftGL.canvas.width, leftGL.canvas.width);
        rightGL.viewport(0, (leftGL.canvas.height - leftGL.canvas.width)/2, rightGL.canvas.width, rightGL.canvas.width);
        resized = false;
    }
        rotX -= 0.25;
        rotY -= 0.75;
        rotZ += 0.5;
        if (rotX > 360) rotX += 360;
        if (rotY > 360) rotY += 360;
        if (rotZ > 360) rotZ += 360;

        var leftModelMatrix = [...identity];
		leftModelMatrix[10] = -1;
		leftModelMatrix = translate(leftModelMatrix, 0, 0.3, 0);
		leftModelMatrix = rotateZ(leftModelMatrix, rotZ);

        var leftModel = leftGL.getUniformLocation(leftShaderProgram, "uModel");
        leftGL.uniformMatrix4fv(leftModel, false, new Float32Array(leftModelMatrix));
        
        var rightModelMatrix = [...identity];
		rightModelMatrix = translate(rightModelMatrix, 0, -0.3, 0);
		rightModelMatrix = rotateX(rightModelMatrix, rotX);
		rightModelMatrix = rotateY(rightModelMatrix, rotY);
		rightModelMatrix = scale(rightModelMatrix, 2, 2, 2);
        rightModelMatrix = translate(rightModelMatrix, 0, 0, -4);
        
        var rightModel = rightGL.getUniformLocation(rightShaderProgram, "uModel");
        rightGL.uniformMatrix4fv(rightModel, false, new Float32Array(rightModelMatrix));
        
        leftGL.clear(leftGL.COLOR_BUFFER_BIT | rightGL.DEPTH_BUFFER_BIT);
        leftGL.drawArrays(leftGL.TRIANGLES, 0, cubeVertices.length);
        rightGL.clear(rightGL.COLOR_BUFFER_BIT | rightGL.DEPTH_BUFFER_BIT);
        rightGL.drawArrays(rightGL.TRIANGLES, 0, cubeVertices.length);
        requestAnimationFrame(render);
  }
  leftGL.clearColor(0.75, 0.75, 0.75, 1.0);
  leftGL.viewport(0, (leftGL.canvas.height - leftGL.canvas.width)/2, leftGL.canvas.width, leftGL.canvas.width);
  rightGL.clearColor(0.0, 0.0, 0.0, 1.0);
  rightGL.enable(rightGL.DEPTH_TEST);
  rightGL.viewport(0, (leftGL.canvas.height - leftGL.canvas.width)/2, rightGL.canvas.width, rightGL.canvas.width);
  render();
}

function rotateX(matrix, theta) {
	theta = theta * Math.PI / 180;
	return multiply(matrix, [
		1, 0, 0, 0,
		0, Math.cos(theta), -Math.sin(theta), 0,
		0, Math.sin(theta), Math.cos(theta), 0,
		0, 0, 0, 1
	]);
}

function rotateY(matrix, theta) {
	theta = theta * Math.PI / 180;
	return multiply(matrix, [
		Math.cos(theta), 0, -Math.sin(theta), 0,
		0, 1, 0, 0,
		Math.sin(theta), 0, Math.cos(theta), 0,
		0, 0, 0, 1
	]);
}

function rotateZ(matrix, theta) {
	theta = theta * Math.PI / 180;
	return multiply(matrix, [
		Math.cos(theta), -Math.sin(theta), 0, 0,
		Math.sin(theta), Math.cos(theta), 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1
	]);
}

function scale(matrix, x, y, z) {
	return multiply(matrix, [
		x, 0, 0, 0,
		0, y, 0, 0,
		0, 0, z, 0,
		0, 0, 0, 1
	]);
}

function translate(matrix, x, y, z) {
	return multiply(matrix, [
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		x, y, z, 1
	]);
}

function multiply(a, b) {
	return [
		a[0] * b[0] + a[1] * b[4] + a[2] * b[8] + a[3] * b[12],
		a[0] * b[1] + a[1] * b[5] + a[2] * b[9] + a[3] * b[13],
		a[0] * b[2] + a[1] * b[6] + a[2] * b[10] + a[3] * b[14],
		a[0] * b[3] + a[1] * b[7] + a[2] * b[11] + a[3] * b[15],
		a[4] * b[0] + a[5] * b[4] + a[6] * b[8] + a[7] * b[12],
		a[4] * b[1] + a[5] * b[5] + a[6] * b[9] + a[7] * b[13],
		a[4] * b[2] + a[5] * b[6] + a[6] * b[10] + a[7] * b[14],
		a[4] * b[3] + a[5] * b[7] + a[6] * b[11] + a[7] * b[15],
		a[8] * b[0] + a[9] * b[4] + a[10] * b[8] + a[11] * b[12],
		a[8] * b[1] + a[9] * b[5] + a[10] * b[9] + a[11] * b[13],
		a[8] * b[2] + a[9] * b[6] + a[10] * b[10] + a[11] * b[14],
		a[8] * b[3] + a[9] * b[7] + a[10] * b[11] + a[11] * b[15],
		a[12] * b[0] + a[13] * b[4] + a[14] * b[8] + a[15] * b[12],
		a[12] * b[1] + a[13] * b[5] + a[14] * b[9] + a[15] * b[13],
		a[12] * b[2] + a[13] * b[6] + a[14] * b[10] + a[15] * b[14],
		a[12] * b[3] + a[13] * b[7] + a[14] * b[11] + a[15] * b[15]
	];
}

function resize() {
    var leftCanvas = document.getElementById("leftCanvas");
    var rightCanvas = document.getElementById("rightCanvas");
    leftCanvas.width = rightCanvas.width = window.innerWidth / 2 - 3;
    leftCanvas.height = rightCanvas.height = window.innerHeight;
    resized = true;
  }

function fullscreen() 
    {
      if (full) 
      {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { /* Firefox */
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE/Edge */
          document.msExitFullscreen();
        }
      } 
      else 
      {
        if (document.body.requestFullscreen) {
          document.body.requestFullscreen();
        } else if (document.body.mozRequestFullScreen) { /* Firefox */
          document.body.mozRequestFullScreen();
        } else if (document.body.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
          document.body.webkitRequestFullscreen();
        } else if (document.body.msRequestFullscreen) { /* IE/Edge */
          document.body.msRequestFullscreen();
        }
      }
      full = !full;
    }
