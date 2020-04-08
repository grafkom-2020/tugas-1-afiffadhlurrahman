var vertexShaderText = 
[
'precision mediump float;',
'',
'attribute vec3 vertPosition;',
'attribute vec3 vertColor;',
'varying vec3 fragColor;',
'uniform mat4 mWorld;',
'uniform mat4 mView;',
'uniform mat4 mProj;',
'',
'void main()',
'{',
'  fragColor = vertColor;',
'  gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);',
'}'
].join('\n');

var fragmentShaderText =
[
'precision mediump float;',
'',
'varying vec3 fragColor;',
'void main()',
'{',
'  gl_FragColor = vec4(fragColor, 1.0);',
'}'
].join('\n');

var InitDemo = function () {
	console.log('This is working');

	var canvas = document.getElementById('model');
	var gl = canvas.getContext('webgl');

	if (!gl) {
		console.log('WebGL not supported, falling back on experimental-webgl');
		gl = canvas.getContext('experimental-webgl');
	}

	if (!gl) {
		alert('Your browser does not support WebGL');
	}

	gl.clearColor(0.75, 0.85, 0.8, 0.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	gl.frontFace(gl.CCW);
	gl.cullFace(gl.BACK);

	//
	// Create shaders
	// 
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(vertexShader, vertexShaderText);
	gl.shaderSource(fragmentShader, fragmentShaderText);

	gl.compileShader(vertexShader);
	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
		return;
	}

	gl.compileShader(fragmentShader);
	if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
		return;
	}

	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error('ERROR linking program!', gl.getProgramInfoLog(program));
		return;
	}
	gl.validateProgram(program);
	if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
		console.error('ERROR validating program!', gl.getProgramInfoLog(program));
		return;
	}

	//
	// Create buffer
	//
	var boxVertices = 
	[ // X, Y, Z           R, G, B
		// Top 1
		-0.5, 0.5, -0.9,   0.4, 0.3, 0.25,       // 0
		-0.5, 0.5, 0.5,    0.4, 0.3, 0.25,       // 1
		0.5, 0.5, 0.5,     0.4, 0.3, 0.25,       // 2
		0.5, 0.5, -0.9,    0.4, 0.3, 0.25,       // 3

		// Left 1
		-0.5, 0.5, 0.5,     0.55, 0.55, 0.5,     // 4
		-0.5, -0.5, 0.5,    0.55, 0.55, 0.5,     // 5
		-0.5, -0.5, -0.9,   0.55, 0.55, 0.5,     // 6
		-0.5, 0.5, -0.9,    0.55, 0.55, 0.5,     // 7

		// Right 1
		0.5, 0.5, 0.5,    0.55, 0.55, 0.5,      // 8
		0.5, -0.5, 0.5,   0.55, 0.55, 0.5,      // 9
		0.5, -0.5, -0.9,  0.55, 0.55, 0.5,      // 10
		0.5, 0.5, -0.9,   0.55, 0.55, 0.5,      // 11

		// Front 1
		0.5, 0.5, 0.5,    0.5, 0.55, 0.55,      // 12
		0.5, -0.5, 0.5,   0.5, 0.55, 0.55,      // 13
		-0.5, -0.5, 0.5,  0.5, 0.55, 0.55,      // 14
		-0.5, 0.5, 0.5,   0.5, 0.55, 0.55,      // 15
		// Back 1
		0.5, 0.5, -0.9,    0.5, 0.55, 0.55,     // 16
		0.5, -0.5, -0.9,   0.5, 0.55, 0.55,     // 17
		-0.5, -0.5, -0.9,  0.5, 0.55, 0.55,     // 18
		-0.5, 0.5, -0.9,   0.5, 0.55, 0.55,     // 19

		// Bottom 1 - bawah
		-0.5, -0.5, -0.9,   0.5, 0.5, 0.5,      // 20
		-0.5, -0.5, 0.5,    0.5, 0.5, 0.5,      // 21
		0.5, -0.5, 0.5,    0.5, 0.5, 0.5,       // 22
        0.5, -0.5, -0.9,    0.5, 0.5, 0.5,      // 23
        // --------------------------------------------------------------
        // Top 2 - atas
        // atap bawah
		-0.1, 0.3, 0.5,   0.6, 0.5, 0.4,     // 24
		-0.1, 0.3, 0.75,    0.6, 0.5, 0.4,    // 25
		0.5, 0.3, 0.75,     0.6, 0.5, 0.4,    // 26
		0.5, 0.3, 0.5,    0.6, 0.5, 0.4,     // 27

		// Left 2
		-0.1, 0.3, 0.75,     0.55, 0.55, 0.5,  // 28
		-0.1, 0.1, 0.75,    0.55, 0.55, 0.5,   // 29
		-0.1, 0.1, 0.5,   0.55, 0.55, 0.5,    // 30
		-0.1, 0.3, 0.5,    0.55, 0.55, 0.5,   // 31

		// Right 2
		0.5, 0.3, 0.75,    0.55, 0.55, 0.5,   // 32
		0.5, 0.1, 0.75,   0.55, 0.55, 0.5,    // 33
		0.5, 0.1, 0.5,  0.55, 0.55, 0.5,     // 34
		0.5, 0.3, 0.5,   0.55, 0.55, 0.5,    // 35

		// Front 2
		0.5, 0.3, 0.75,    0.5, 0.55, 0.55,   // 36
		0.5, 0.1, 0.75,   0.5, 0.55, 0.55,    // 37
		-0.1, 0.1, 0.75,  0.5, 0.55, 0.55,    // 38
		-0.1, 0.3, 0.75,   0.5, 0.55, 0.55,   // 39
        
        // Back 2 done
		0.5, 0.3, 0.5,    0.5, 0.55, 0.55,   // 40
		0.5, 0.1, 0.5,   0.5, 0.55, 0.55,    // 41
		-0.1, 0.1, 0.5,  0.5, 0.55, 0.55,    // 42
		-0.1, 0.3, 0.5,   0.5, 0.55, 0.55,   // 43

		// Bottom 2
		-0.1, 0.1, 0.5,   0.5, 0.5, 0.5,     // 44
		-0.1, 0.1, 0.75,    0.5, 0.5, 0.5,    // 45
		0.5, 0.1, 0.75,    0.5, 0.5, 0.5,     // 46
        0.5, 0.1, 0.5,    0.5, 0.5, 0.5,     // 47
        //----------------------------------------------------
        // atap atas
        // Top 3 - atas
        -0.5, 0.5, 0.5,    0.6, 0.6, 0.6,       // 48
        -0.5, 0.5, 0.9,    0.6, 0.6, 0.6,       // 49
        0.1, 0.5, 0.9,     0.6, 0.6, 0.6,       // 50
        0.1, 0.5, 0.5,     0.6, 0.6, 0.6,       // 51

        // Left 3
        -0.5, 0.5, 0.9,     0.55, 0.55, 0.5,    // 52
        -0.5, 0.3, 0.9,    0.55, 0.55, 0.5,     // 53
        -0.5, 0.3, 0.5,   0.55, 0.55, 0.5,      // 54
        -0.5, 0.5, 0.5,    0.55, 0.55, 0.5,     // 55

        // Right 3
        0.1, 0.5, 0.9,    0.55, 0.55, 0.5,      // 56
        0.1, 0.3, 0.9,   0.55, 0.55, 0.5,       // 57
        0.1, 0.3, 0.5,  0.55, 0.55, 0.5,        // 58
        0.1, 0.5, 0.5,   0.55, 0.55, 0.5,       // 59

        // Front 3
        0.1, 0.5, 0.9,    0.5, 0.55, 0.55,      // 60
        0.1, 0.3, 0.9,   0.5, 0.55, 0.55,       // 61
        -0.5, 0.3, 0.9,  0.5, 0.55, 0.55,       // 62
        -0.5, 0.5, 0.9,   0.5, 0.55, 0.55,      // 63

        // Back 3 done
        0.1, 0.5, 0.5,    0.5, 0.55, 0.55,      // 64
        0.1, 0.3, 0.5,   0.5, 0.55, 0.55,       // 65
        -0.5, 0.3, 0.5,  0.5, 0.55, 0.55,       // 66
        -0.5, 0.5, 0.5,   0.5, 0.55, 0.55,      // 67

        // Bottom 3
        -0.5, 0.3, 0.5,   0.5, 0.5, 0.5,        // 68
        -0.5, 0.3, 0.9,    0.5, 0.5, 0.5,       // 69
        0.1, 0.3, 0.9,    0.5, 0.5, 0.5,        // 70
        0.1, 0.3, 0.5,    0.5, 0.5, 0.5         // 71
	];

	var boxIndices =
	[
		// Top
		0, 1, 2,
		0, 2, 3,

		// Left
		5, 4, 6,
		6, 4, 7,

		// Right
		8, 9, 10,
		8, 10, 11,

		// Front
		13, 12, 14,
		15, 14, 12,

		// Back
		16, 17, 18,
		16, 18, 19,

		// Bottom
		21, 20, 22,
        22, 20, 23,
        //---------------------------------
        //  2
        // Top
		24, 25, 26,
		24, 26, 27,

		// Left
		29, 28, 30,
		30, 28, 31,

		// Right
		32, 33, 34,
		32, 34, 35,

		// Front
		37, 36, 38,
		39, 38, 36,

		// Back
		40, 41, 42,
		40, 42, 43,

		// Bottom
		45, 44, 46,
        46, 44, 47,
        //-----------------------
        // 3
        // Top
		48, 49, 50,
		48, 50, 51,

		// Left
		53, 52, 54,
		54, 52, 55,

		// Right
		56, 57, 58,
		56, 58, 59,

		// Front
		61, 60, 62,
		63, 62, 60,

		// Back
		64, 65, 66,
		64, 66, 67,

		// Bottom
		69, 68, 70,
        70, 68, 71,
	];

	var boxVertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);

	var boxIndexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);

	var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
	var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
	gl.vertexAttribPointer(
		positionAttribLocation, // Attribute location
		3, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		6 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		0 // Offset from the beginning of a single vertex to this attribute
	);
	gl.vertexAttribPointer(
		colorAttribLocation, // Attribute location
		3, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		6 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
	);

	gl.enableVertexAttribArray(positionAttribLocation);
	gl.enableVertexAttribArray(colorAttribLocation);

	// Tell OpenGL state machine which program should be active.
	gl.useProgram(program);

	var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
	var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
	var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

	var worldMatrix = new Float32Array(16);
	var viewMatrix = new Float32Array(16);
	var projMatrix = new Float32Array(16);
	mat4.identity(worldMatrix);
	mat4.lookAt(viewMatrix, [0, 0, -5], [0, 0, 0], [0, 1, 0]);
	mat4.perspective(projMatrix, glMatrix.toRadian(45), canvas.clientWidth / canvas.clientHeight, 0.1, 1000.0);

	gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
	gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
	gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

	var xRotationMatrix = new Float32Array(16);
	var yRotationMatrix = new Float32Array(16);

	//
	// Main render loop
	//
	var identityMatrix = new Float32Array(16);
	mat4.identity(identityMatrix);
	var angle = 0;
	var loop = function () {
		angle = performance.now() / 1000 / 6 * 2 * Math.PI;
		mat4.rotate(yRotationMatrix, identityMatrix, angle, [0, 1, 0]);
		mat4.rotate(xRotationMatrix, identityMatrix, angle / 4, [1, 0, 0]);
		mat4.mul(worldMatrix, yRotationMatrix, xRotationMatrix);
		gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

		gl.clearColor(0.75, 0.85, 0.8, 1.0);
		gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
		gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);

		requestAnimationFrame(loop);
	};
	requestAnimationFrame(loop);
};

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