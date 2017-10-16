// see https://webglfundamentals.org/webgl/lessons/webgl-3d-textures.html
// and ProjectionTools.js

class ProjectedTile {
    constructor(game, x, y, distortL, distortR, maxIdx) {
        this.x = x;
        this.y = y;
        this.width;
        this.height;
        this.distortL = distortL;
        this.distortR = distortR;
        this.game = game;
        this.canvas;
        this.sprite;
        this.ready;
        this.rescale, this.extL;
        this.idx = -1;
        this.maxIdx = maxIdx;
        this.bitmapData;
    }
    
    create(fileName, idx) {
        this.idx = idx;
        this.ready = false;
  // Get A WebGL context
    this.canvas = document.getElementById("canvas", {antialias: false});
  var gl = this.canvas.getContext("webgl");
  if (!gl) {
    return;
  }

  // setup GLSL program
  this.program = ProjectionTools.createProgramFromScripts(gl, ["3d-vertex-shader", "3d-fragment-shader"]);

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
  image.src = fileName;
        image.spriteHolder = this;
  image.addEventListener('load', function() {
    // Now that the image has loaded make copy it to the texture.
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);

    // Check if the image is a power of 2 in both dimensions.
    if (ProjectionTools.isPowerOf2(image.width) && ProjectionTools.isPowerOf2(image.height)) {
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
      var identityMat = ProjectionTools.transform2d(0, 0, 1, 0, 0, 1, 1, 1);
      var transformMat = ProjectionTools.transform2d(0, 0, 1, 0, 0+this.distortL, 1, 1+this.distortR, 1);
      //matrix = ProjectedTile.multmm4(matrix, matrix2);
      //console.log("mat:  "+matrix);
      //console.log("mat2: "+transformMat);
      
      var extL = -Math.min(0, this.distortL);
      var extR = Math.max(0, this.distortR);
      var rescale = 1/(1+extL+extR);
      //console.log("**"+extL+", "+extR+", "+rescale);
      
      //rescale = 0.5
      
      var scaleMat = ProjectionTools.scaleMatrix(2*rescale, 2, 0, 1);
      var translationMat = ProjectionTools.translationMatrix(-rescale+extL*rescale, -1, 0);
      if(extL == 0) var translationMat = ProjectedTile.translationMatrix(-1, -1, 0);
      //console.log("mat3: "+matrix3);
      
      var matrix = ProjectionTools.multmm4(ProjectionTools.multmm4(transformMat, scaleMat), translationMat);
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
      
      this.drawTextureFrame();
  }
    
/*
http://www.html5gamedevs.com/topic/3099-get-pixel-value-in-a-sprite/

var bmd = game.make.bitmapData(100, 100);
bmd.draw(game.cache.getImage('yourImage'), 0, 0);
bmd.update();
var sprite = game.add.sprite(0, 0, bmd);
// in your onclick fn
var posX, posY;
posX = pointer.x - sprite.x;
posY = pointer.y - sprite.y;
var hex = bmd.getPixel32(posX,posY);
r = ( hex       ) & 0xFF; // get the r
g = ( hex >>  8 ) & 0xFF; // get the g
b = ( hex >> 16 ) & 0xFF; // get the b
a = ( hex >> 24 ) & 0xFF; // get the alpha
if (a > 0) {// hit here!}
*/
    
    /*
    http://www.html5gamedevs.com/topic/5338-how-to-create-sprite-animations-dynamically/
    
    var dataURL, bmd, ctx, width, height;
    width = 100;
    height = 100;
    bmd = game.add.bitmapData( width * 2, height );
    ctx = bmd.context;
    bmd.clear();
    ctx.fillStyle = "#2E8B57";
    ctx.fillRect(0,0,width,height);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0,0,width/2,height/2);
    ctx.fillRect(width/2,height/2,width/2,height/2);
    ctx.fillStyle = "#2E8B57";
    ctx.fillRect(width,0,width,height);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(width+width/2,0,width/2,height/2);
    ctx.fillRect(width,height/2,width/2,height/2);
    dataURL = bmd.canvas.toDataURL();
    game.load.spritesheet('myDynamicSpritesheet', dataURL, width, height);
    
    */
    
        
    initialiseBitmapData() {
        this.bitmapData = this.game.add.bitmapData(ProjectedTile.SIZE*this.maxIdx, ProjectedTile.SIZE);
    }
    
    finaliseSpritesheet() {
        var dataURL = this.bitmapData.canvas.toDataURL();
        this.game.cache.addSpriteSheet('spritesheet'+this.x+","+this.y, dataURL, this.bitmapData.canvas, ProjectedTile.SIZE, ProjectedTile.SIZE);
        console.log("add to cache: "+'spritesheet'+this.x+","+this.y);
    }
    
    createSprite() {
        this.sprite = this.game.add.sprite(0, 0, 'spritesheet'+this.x+","+this.y);
        //this.sprite = this.game.add.sprite(0, 0, 'spritesheet'+this.x+","+this.y);
        this.sprite.x = this.x-this.width*this.extL;
        this.sprite.y = this.y;
        //console.log("$"+this.sprite.width+", "+this.sprite.height);
        var offset = 1.02;
        this.sprite.scale.setTo(offset*this.width/ProjectedTile.SIZE/this.rescale, offset*this.height/ProjectedTile.SIZE);
    }
    
    drawTextureFrame() {
        //console.log("begin draw frame!");
        var baseTexture = new PIXI.BaseTexture(this.canvas);
        var texture = new PIXI.Texture(baseTexture);
        var tempSprite = this.game.add.sprite(0, 0);
        tempSprite.loadTexture(texture, 0);
        if(this.bitmapData == null) this.initialiseBitmapData();
        //this.game.stage.updateTransform();
        //this.bitmapData.update();
        this.bitmapData.draw(tempSprite, ProjectedTile.SIZE*this.idx, 0);
        //this.bitmapData.update();
        //tempSprite.destroy();
        this.ready = true;
        //console.log("end draw frame!");
    }
    
    drawPlainTileFrame(colour, idx) {
        this.idx = idx;
        var trp = this.game.add.graphics(0, 0);
        trp.beginFill(colour);
        /*trp.moveTo(this.distortL*this.width,0);
        trp.lineTo(0+this.width+this.distortR*this.width,0);
        trp.lineTo(0+this.width,0+this.height);
        trp.lineTo(0,0+this.height);
        trp.lineTo(this.distortL*this.width,0);*/
        var extL = -Math.min(0, this.distortL);
        var extR = Math.max(0, this.distortR);
        var rescale = 1/(1+extL+extR);
        trp.moveTo(Math.max(0, this.distortL*rescale)*ProjectedTile.SIZE,0);
        trp.lineTo((1+Math.min(0, this.distortR*rescale))*ProjectedTile.SIZE,0);
        trp.lineTo((1-extR*rescale)*ProjectedTile.SIZE,ProjectedTile.SIZE);
        trp.lineTo(extL*rescale*ProjectedTile.SIZE,ProjectedTile.SIZE);
        trp.moveTo(Math.max(0, this.distortL*rescale)*ProjectedTile.SIZE,0);
        trp.endFill();
        var texture = trp.generateTexture();
        //var baseTexture = new PIXI.BaseTexture(trp);
        //var texture = new PIXI.Texture(baseTexture);
        if(this.bitmapData == null) this.initialiseBitmapData();
        var tempSprite = this.game.add.sprite(0, 0);
        tempSprite.loadTexture(texture, 0);
        //console.log(tempSprite.width+", "+tempSprite.height);
        this.bitmapData.draw(tempSprite, ProjectedTile.SIZE*this.idx, 0);
        trp.destroy();
        texture.destroy();
        //tempSprite.destroy();
        this.ready = true;
    }
    
    setWidthHeight(w, h) {
        this.width = w;
        this.height = h;
    }
}

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