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

class ProjectionTools {}



// Fill the buffer with the values that define a plane.

ProjectionTools.resizeCanvasToDisplaySize = function(canvas, multiplier) {
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

ProjectionTools.defaultShaderType = [
    "VERTEX_SHADER",
    "FRAGMENT_SHADER",
  ];

ProjectionTools.createProgramFromScripts = function(
      gl, shaderScriptIds, opt_attribs, opt_locations, opt_errorCallback) {
    var shaders = [];
    for (var ii = 0; ii < shaderScriptIds.length; ++ii) {
      shaders.push(ProjectionTools.createShaderFromScript(
          gl, shaderScriptIds[ii], gl[ProjectionTools.defaultShaderType[ii]], opt_errorCallback));
    }
    return ProjectionTools.createProgram(gl, shaders, opt_attribs, opt_locations, opt_errorCallback);
  }

ProjectionTools.createShaderFromScript = function(
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

    return ProjectionTools.loadShader(
        gl, shaderSource, opt_shaderType ? opt_shaderType : shaderType,
        opt_errorCallback);
  }

ProjectionTools.loadShader = function(gl, shaderSource, shaderType, opt_errorCallback) {
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

ProjectionTools.createProgram = function(
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

ProjectionTools.isPowerOf2 = function(value) {
    return (value & (value - 1)) == 0;
}

ProjectionTools.adj = function(m) { // Compute the adjugate of m
  return [
    m[4]*m[8]-m[5]*m[7], m[2]*m[7]-m[1]*m[8], m[1]*m[5]-m[2]*m[4],
    m[5]*m[6]-m[3]*m[8], m[0]*m[8]-m[2]*m[6], m[2]*m[3]-m[0]*m[5],
    m[3]*m[7]-m[4]*m[6], m[1]*m[6]-m[0]*m[7], m[0]*m[4]-m[1]*m[3]
  ];
}
ProjectionTools.multmm = function(a, b) { // multiply two matrices
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
ProjectionTools.multmm4 = function(a, b) { // multiply two matrices
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
ProjectionTools.multmv = function(m, v) { // multiply matrix and vector
  return [
    m[0]*v[0] + m[1]*v[1] + m[2]*v[2],
    m[3]*v[0] + m[4]*v[1] + m[5]*v[2],
    m[6]*v[0] + m[7]*v[1] + m[8]*v[2]
  ];
}
ProjectionTools.pdbg = function(m, v) {
  var r = ProjectionTools.multmv(m, v);
  return r + " (" + r[0]/r[2] + ", " + r[1]/r[2] + ")";
}
ProjectionTools.basisToPoints = function(x1, y1, x2, y2, x3, y3, x4, y4) {
  var m = [
    x1, x2, x3,
    y1, y2, y3,
     1,  1,  1
  ];
  var v = ProjectionTools.multmv(ProjectionTools.adj(m), [x4, y4, 1]);
  return ProjectionTools.multmm(m, [
    v[0], 0, 0,
    0, v[1], 0,
    0, 0, v[2]
  ]);
}
ProjectionTools.translationMatrix = function(tx, ty, tz) {
    return [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      tx, ty, tz, 1,
    ];
  },
    
ProjectionTools.scaleMatrix = function(sx, sy, sz, sw) {
    return [
      sx, 0, 0, 0,
      0, sy, 0, 0,
      0, 0, sz, 0,
      0, 0, 0, sw,
    ];
  },

ProjectionTools.general2DProjection = function(
  x1s, y1s, x1d, y1d,
  x2s, y2s, x2d, y2d,
  x3s, y3s, x3d, y3d,
  x4s, y4s, x4d, y4d
) {
  var s = ProjectionTools.basisToPoints(x1s, y1s, x2s, y2s, x3s, y3s, x4s, y4s);
  var d = ProjectionTools.basisToPoints(x1d, y1d, x2d, y2d, x3d, y3d, x4d, y4d);
  return ProjectionTools.multmm(d, ProjectionTools.adj(s));
}
ProjectionTools.project = function(m, x, y) {
  var v = ProjectionTools.multmv(m, [x, y, 1]);
  return [v[0]/v[2], v[1]/v[2]];
}
ProjectionTools.transform2d = function(x1, y1, x2, y2, x3, y3, x4, y4) {
  //var w = elt.offsetWidth, h = elt.offsetHeight;
    var w = 1;
    var h = 1;
  var t = ProjectionTools.general2DProjection
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