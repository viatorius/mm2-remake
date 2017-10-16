// see https://webglfundamentals.org/webgl/lessons/webgl-3d-textures.html
// https://webglfundamentals.org/webgl/resources/webgl-utils.js

/*
 * Copyright notice for webgl-utils.js:
 * Copyright 2012, Gregg Tavares.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Gregg Tavares. nor the names of his
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

class ProjectedWall {
    constructor(game, x, y, distortL, distortR) {
        this.x = x;
        this.y = y;
        this.width;
        this.height;
        this.distortL = distortL;
        this.distortR = distortR;
        this.game = game;
        this.canvas;
        this.sprite;
        this.ready = false;
        this.rescale, this.extL;
        this.create();
    }
    
    create() {
  // Get A WebGL context
    this.canvas = document.getElementById("canvas", {antialias: false});
  var gl = this.canvas.getContext("webgl");
  if (!gl) {
    return;
  }

  // setup GLSL program
  this.program = ProjectedTile.createProgramFromScripts(gl, ["3d-vertex-shader", "3d-fragment-shader"]);

  // look up where the vertex data needs to go.
  this.positionLocation = gl.getAttribLocation(this.program, "a_position");
  this.texcoordLocation = gl.getAttribLocation(this.program, "a_texcoord");

  // lookup uniforms
  this.matrixLocation = gl.getUniformLocation(this.program, "u_matrix");
  this.textureLocation = gl.getUniformLocation(this.program, "u_texture");

  // Create a buffer for positions
  this.positionBuffer = gl.createBuffer();
  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
  // Put the positions in the buffer
  ProjectedTile.setGeometry(gl);

  // provide texture coordinates for the rectangle.
  this.texcoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoordBuffer);
  // Set Texcoords.
  ProjectedTile.setTexcoords(gl);

  // Create a texture.
  var texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  // Fill the texture with a 1x1 blue pixel.
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                new Uint8Array([0, 0, 255, 255]));
  // Asynchronously load an image
  var image = new Image();
  image.src = "assets/stone.png";
        image.spriteHolder = this;
  image.addEventListener('load', function() {
    // Now that the image has loaded make copy it to the texture.
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);

    // Check if the image is a power of 2 in both dimensions.
    if (ProjectedTile.isPowerOf2(image.width) && ProjectedTile.isPowerOf2(image.height)) {
       // Yes, it's a power of 2. Generate mips.
       gl.generateMipmap(gl.TEXTURE_2D);
    } else {
       // No, it's not a power of 2. Turn of mips and set wrapping to clamp to edge
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
    this.spriteHolder.drawScene();
  });
    }



  //drawScene();

  // Draw the scene.
  drawScene() {
      var gl = this.canvas.getContext("webgl");
    //ProjectedTile.resizeCanvasToDisplaySize(gl.canvas);

    // Tell WebGL how to convert from clip space to pixels
      gl.viewport(0, 0, ProjectedTile.SIZE, ProjectedTile.SIZE);
      //console.log(gl.canvas.width+", "+gl.canvas.height);
    //gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    // Clear the framebuffer texture.
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(this.program);

    // Turn on the position attribute
    gl.enableVertexAttribArray(this.positionLocation);

    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);

    // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 3;          // 3 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        this.positionLocation, size, type, normalize, stride, offset)

    // Turn on the teccord attribute
    gl.enableVertexAttribArray(this.texcoordLocation);

    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoordBuffer);

    // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        this.texcoordLocation, size, type, normalize, stride, offset)
      
      //var matrix = ProjectedTile.translationMatrix(-0.5, -0.5, 0);
      var identityMat = ProjectedTile.transform2d(0, 0, 1, 0, 0, 1, 1, 1);
      var transformMat = ProjectedTile.transform2d(0, 0, 1, 0, 0+this.distortL, 1, 1+this.distortR, 1);
      //matrix = ProjectedTile.multmm4(matrix, matrix2);
      //console.log("mat:  "+matrix);
      //console.log("mat2: "+transformMat);
      
      var extL = -Math.min(0, this.distortL);
      var extR = Math.max(0, this.distortR);
      var rescale = 1/(1+extL+extR);
      //console.log("**"+extL+", "+extR+", "+rescale);
      
      //rescale = 0.5
      
      var scaleMat = ProjectedTile.scaleMatrix(2*rescale, 2, 0, 1);
      var translationMat = ProjectedTile.translationMatrix(-rescale+extL*rescale, -1, 0);
      if(extL == 0) var translationMat = ProjectedTile.translationMatrix(-1, -1, 0);
      //console.log("mat3: "+matrix3);
      
      var matrix = ProjectedTile.multmm4(ProjectedTile.multmm4(transformMat, scaleMat), translationMat);
      this.rescale = rescale;
      this.extL = extL;
      
      // Set the matrix.
      gl.uniformMatrix4fv(this.matrixLocation, false, matrix);
      
      //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR_MIPMAP_LINEAR);

      // Tell the shader to use texture unit 0 for u_texture
      gl.uniform1i(this.textureLocation, 0);

      // Draw the geometry.
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      
      this.drawSprite();
  }

    
    drawSprite() {
        var baseTexture = new PIXI.BaseTexture(this.canvas);
        var texture = new PIXI.Texture(baseTexture);
        var textureFrame = new Phaser.Frame(0, 0, 0, ProjectedTile.SIZE, ProjectedTile.SIZE);
        this.sprite = this.game.add.sprite(0, 0);
        this.sprite.loadTexture(texture, 0);
        this.sprite.x = this.x-this.width*this.extL;
        this.sprite.y = this.y;
        this.ready = true;
        //console.log("$"+this.sprite.width+", "+this.sprite.height);
        var offset = 1.02;
        this.sprite.scale.setTo(offset*this.width/ProjectedTile.SIZE/this.rescale, offset*this.height/ProjectedTile.SIZE);
    }
    
    setWidthHeight(w, h) {
        this.width = w;
        this.height = h;
    }
}


// Fill the buffer with the values that define a plane.
ProjectedTile.setGeometry = function(gl) {
  var positions = new Float32Array(
      [
    0, 0, 0,
    1, 0, 0,
    0, 1, 0,
    0, 1, 0,
    1, 0, 0,
    1, 1, 0
    ]);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
}

// Fill the buffer with texture coordinates for a plane.
ProjectedTile.setTexcoords = function(gl) {
  gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(
        [
        1, 1,
        0, 1,
        1, 0,
        1, 0,
        0, 1,
        0, 0,

      ]),
      gl.STATIC_DRAW);
}

ProjectedTile.resizeCanvasToDisplaySize = function(canvas, multiplier) {
    multiplier = multiplier || 1;
    var width  = canvas.clientWidth  * multiplier | 0;
    var height = canvas.clientHeight * multiplier | 0;
    if (canvas.width !== width ||  canvas.height !== height) {
      canvas.width  = width;
      canvas.height = height;
      return true;
    }
    return false;
  }

ProjectedTile.defaultShaderType = [
    "VERTEX_SHADER",
    "FRAGMENT_SHADER",
  ];

ProjectedTile.createProgramFromScripts = function(
      gl, shaderScriptIds, opt_attribs, opt_locations, opt_errorCallback) {
    var shaders = [];
    for (var ii = 0; ii < shaderScriptIds.length; ++ii) {
      shaders.push(ProjectedTile.createShaderFromScript(
          gl, shaderScriptIds[ii], gl[ProjectedTile.defaultShaderType[ii]], opt_errorCallback));
    }
    return ProjectedTile.createProgram(gl, shaders, opt_attribs, opt_locations, opt_errorCallback);
  }

ProjectedTile.createShaderFromScript = function(
      gl, scriptId, opt_shaderType, opt_errorCallback) {
    var shaderSource = "";
    var shaderType;
    var shaderScript = document.getElementById(scriptId);
    if (!shaderScript) {
      throw ("*** Error: unknown script element" + scriptId);
    }
    shaderSource = shaderScript.text;

    if (!opt_shaderType) {
      if (shaderScript.type === "x-shader/x-vertex") {
        shaderType = gl.VERTEX_SHADER;
      } else if (shaderScript.type === "x-shader/x-fragment") {
        shaderType = gl.FRAGMENT_SHADER;
      } else if (shaderType !== gl.VERTEX_SHADER && shaderType !== gl.FRAGMENT_SHADER) {
        throw ("*** Error: unknown shader type");
      }
    }

    return ProjectedTile.loadShader(
        gl, shaderSource, opt_shaderType ? opt_shaderType : shaderType,
        opt_errorCallback);
  }

ProjectedTile.loadShader = function(gl, shaderSource, shaderType, opt_errorCallback) {
    var errFn = opt_errorCallback;
    // Create the shader object
    var shader = gl.createShader(shaderType);

    // Load the shader source
    gl.shaderSource(shader, shaderSource);

    // Compile the shader
    gl.compileShader(shader);

    // Check the compile status
    var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
      // Something went wrong during compilation; get the error
      var lastError = gl.getShaderInfoLog(shader);
      errFn("*** Error compiling shader '" + shader + "':" + lastError);
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

ProjectedTile.createProgram = function(
      gl, shaders, opt_attribs, opt_locations, opt_errorCallback) {
    var errFn = opt_errorCallback;
    var program = gl.createProgram();
    shaders.forEach(function(shader) {
      gl.attachShader(program, shader);
    });
    if (opt_attribs) {
      opt_attribs.forEach(function(attrib, ndx) {
        gl.bindAttribLocation(
            program,
            opt_locations ? opt_locations[ndx] : ndx,
            attrib);
      });
    }
    gl.linkProgram(program);

    // Check the link status
    var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked) {
        // something went wrong with the link
        var lastError = gl.getProgramInfoLog(program);
        errFn("Error in program linking:" + lastError);

        gl.deleteProgram(program);
        return null;
    }
    return program;
  }

ProjectedTile.isPowerOf2 = function(value) {
    return (value & (value - 1)) == 0;
}

ProjectedTile.adj = function(m) { // Compute the adjugate of m
  return [
    m[4]*m[8]-m[5]*m[7], m[2]*m[7]-m[1]*m[8], m[1]*m[5]-m[2]*m[4],
    m[5]*m[6]-m[3]*m[8], m[0]*m[8]-m[2]*m[6], m[2]*m[3]-m[0]*m[5],
    m[3]*m[7]-m[4]*m[6], m[1]*m[6]-m[0]*m[7], m[0]*m[4]-m[1]*m[3]
  ];
}
ProjectedTile.multmm = function(a, b) { // multiply two matrices
  var c = Array(9);
  for (var i = 0; i != 3; ++i) {
    for (var j = 0; j != 3; ++j) {
      var cij = 0;
      for (var k = 0; k != 3; ++k) {
        cij += a[3*i + k]*b[3*k + j];
      }
      c[3*i + j] = cij;
    }
  }
  return c;
}
ProjectedTile.multmm4 = function(a, b) { // multiply two matrices
  var c = Array(16);
  for (var i = 0; i != 4; ++i) {
    for (var j = 0; j != 4; ++j) {
      var cij = 0;
      for (var k = 0; k != 4; ++k) {
        cij += a[4*i + k]*b[4*k + j];
      }
      c[4*i + j] = cij;
    }
  }
  return c;
}
ProjectedTile.multmv = function(m, v) { // multiply matrix and vector
  return [
    m[0]*v[0] + m[1]*v[1] + m[2]*v[2],
    m[3]*v[0] + m[4]*v[1] + m[5]*v[2],
    m[6]*v[0] + m[7]*v[1] + m[8]*v[2]
  ];
}
ProjectedTile.pdbg = function(m, v) {
  var r = ProjectedTile.multmv(m, v);
  return r + " (" + r[0]/r[2] + ", " + r[1]/r[2] + ")";
}
ProjectedTile.basisToPoints = function(x1, y1, x2, y2, x3, y3, x4, y4) {
  var m = [
    x1, x2, x3,
    y1, y2, y3,
     1,  1,  1
  ];
  var v = ProjectedTile.multmv(ProjectedTile.adj(m), [x4, y4, 1]);
  return ProjectedTile.multmm(m, [
    v[0], 0, 0,
    0, v[1], 0,
    0, 0, v[2]
  ]);
}
ProjectedTile.translationMatrix = function(tx, ty, tz) {
    return [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      tx, ty, tz, 1,
    ];
  },
    
ProjectedTile.scaleMatrix = function(sx, sy, sz, sw) {
    return [
      sx, 0, 0, 0,
      0, sy, 0, 0,
      0, 0, sz, 0,
      0, 0, 0, sw,
    ];
  },

ProjectedTile.general2DProjection = function(
  x1s, y1s, x1d, y1d,
  x2s, y2s, x2d, y2d,
  x3s, y3s, x3d, y3d,
  x4s, y4s, x4d, y4d
) {
  var s = ProjectedTile.basisToPoints(x1s, y1s, x2s, y2s, x3s, y3s, x4s, y4s);
  var d = ProjectedTile.basisToPoints(x1d, y1d, x2d, y2d, x3d, y3d, x4d, y4d);
  return ProjectedTile.multmm(d, ProjectedTile.adj(s));
}
ProjectedTile.project = function(m, x, y) {
  var v = ProjectedTile.multmv(m, [x, y, 1]);
  return [v[0]/v[2], v[1]/v[2]];
}
ProjectedTile.transform2d = function(x1, y1, x2, y2, x3, y3, x4, y4) {
  //var w = elt.offsetWidth, h = elt.offsetHeight;
    var w = 1;
    var h = 1;
  var t = ProjectedTile.general2DProjection
    (0, 0, x1, y1, w, 0, x2, y2, 0, h, x3, y3, w, h, x4, y4);
    //var maxi = 0;
    //for(var i=0;i<t.length;i++) {if(maxi < Math.abs(t[i])) maxi = Math.abs(t[i]);}
    for(i = 0; i != 9; ++i) t[i] = t[i]/t[8];
    //console.log(maxi);
    //t[8] = 1;
  t = [t[0], t[3], 0, t[6],
       t[1], t[4], 0, t[7],
       0   , 0   , 1, 0   ,
       0, 0, 0, t[8]];
    return t;
}

/*corners = [100, 100, 300, 100, 100, 300, 300, 300];
function update() {
  var box = document.getElementById("box");
  transform2d(box, corners[0], corners[1], corners[2], corners[3],
                   corners[4], corners[5], corners[6], corners[7]);
  for (var i = 0; i != 8; i += 2) {
    var elt = document.getElementById("marker" + i);
    elt.style.left = corners[i] + "px";
    elt.style.top = corners[i + 1] + "px";
  }
}*/

ProjectedTile.SIZE = 100;