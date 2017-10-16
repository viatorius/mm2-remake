class MapWindow extends Window {
    constructor(game, x, y) {
        super(game, x, y, 340, 340);
        this.map;
        
        this.texts.push(game.add.text(x+8, y+8, "map name", Window.TEXT_STYLE))
        
        this.buttons.push(new TextButton(this.game, this.x+this.width-26, this.y+6, 20, 20, "X", this.closeWindow, this));
        
        this.mapWidth = (MapWindow.MAP_WIDTH-1) * MiniMap.MINIMAP_SQUARE_SIZE;
        this.mapHeight = (MapWindow.MAP_HEIGHT-1) * MiniMap.MINIMAP_SQUARE_SIZE;
            
        this.mapSquares = [];
        this.mapHzWalls = [];
        this.mapVtWalls = [];
        
        this.dragging = false;
        this.startDragX = -1;
        this.startDragY = -1;
        this.prevMouseX = -1;
        this.prevMouseY = -1;
        
        this.cSquareX, this.cSquareY;
        this.cTdX, this.cTdY;
        this.prevTdX, this.prevTdY;
        
        this.mapEdge, this.topRect, this.leftRect, this.rightRect, this.bottomRect;
    }
    
    loadMap(map) {
        this.texts[0].text = map.name+"    ("+map.pcParty.x+", "+map.pcParty.y+")";
        this.map = map;
        
        this.mapSquares = new Array(MapWindow.MAP_WIDTH);
        this.mapHzWalls = new Array(MapWindow.MAP_WIDTH);
        this.mapVtWalls = new Array(MapWindow.MAP_WIDTH);
        for(var i=0;i<MapWindow.MAP_WIDTH;i++) {
            this.mapSquares[i] = new Array(MapWindow.MAP_HEIGHT);
            this.mapHzWalls[i] = new Array(MapWindow.MAP_HEIGHT);
            this.mapVtWalls[i] = new Array(MapWindow.MAP_HEIGHT);
            for(var j=0;j<MapWindow.MAP_HEIGHT;j++) {
                this.mapSquares[i][j] = this.game.add.sprite(this.x + MapWindow.BX + MiniMap.MINIMAP_SQUARE_SIZE*i, this.y + MapWindow.BY + MiniMap.MINIMAP_SQUARE_SIZE*j, 'minimapSquare');
                
                this.mapHzWalls[i][j] = this.game.add.graphics(this.x + MapWindow.BX + MiniMap.MINIMAP_SQUARE_SIZE*i, this.y + MapWindow.BY + MiniMap.MINIMAP_SQUARE_SIZE*j);
                this.mapHzWalls[i][j].lineStyle(2, 0xFFFFFF, 1);
                this.mapHzWalls[i][j].moveTo(0, 0);
                this.mapHzWalls[i][j].lineTo(MiniMap.MINIMAP_SQUARE_SIZE, 0);
                
                this.mapVtWalls[i][j] = this.game.add.graphics(this.x + MapWindow.BX + MiniMap.MINIMAP_SQUARE_SIZE*i, this.y + MapWindow.BY + MiniMap.MINIMAP_SQUARE_SIZE*j);
                this.mapVtWalls[i][j].lineStyle(2, 0xFFFFFF, 1);
                this.mapVtWalls[i][j].moveTo(0, 0);
                this.mapVtWalls[i][j].lineTo(0, MiniMap.MINIMAP_SQUARE_SIZE);
            }
        }
        
        this.cSquareX = map.pcParty.x-Math.floor(MapWindow.MAP_WIDTH/2);
        this.cSquareY = map.pcParty.y-Math.floor(MapWindow.MAP_HEIGHT/2);
        this.cTdX = this.cSquareX;
        this.cTdY = this.cSquareY;
        this.prevTdX = this.cTdX;
        this.prevTdY = this.cTdY;
        
        //rectangles:        
        this.topRect = this.game.add.graphics(this.x + MapWindow.BX, this.y + MapWindow.BY);
        this.topRect.lineStyle(0, 0x000000, 1);
        this.topRect.beginFill(WindowFrame.LIGHT_COLOUR);
        this.topRect.drawRect(-1, -1, (MapWindow.MAP_WIDTH+1)*MiniMap.MINIMAP_SQUARE_SIZE+2, MiniMap.MINIMAP_SQUARE_SIZE+2);
        this.topRect.endFill();
        
        this.leftRect = this.game.add.graphics(this.x + MapWindow.BX, this.y + MapWindow.BY);
        this.leftRect.lineStyle(0, 0x000000, 1);
        this.leftRect.beginFill(WindowFrame.LIGHT_COLOUR);
        this.leftRect.drawRect(-1, -1, MiniMap.MINIMAP_SQUARE_SIZE+2, (MapWindow.MAP_HEIGHT+1)*MiniMap.MINIMAP_SQUARE_SIZE+2);
        this.leftRect.endFill();
        
        this.bottomRect = this.game.add.graphics(this.x + MapWindow.BX, this.y + MapWindow.BY + MapWindow.MAP_HEIGHT*MiniMap.MINIMAP_SQUARE_SIZE);
        this.bottomRect.lineStyle(0, 0x000000, 1);
        this.bottomRect.beginFill(WindowFrame.LIGHT_COLOUR);
        this.bottomRect.drawRect(-1, -1, (MapWindow.MAP_WIDTH+1)*MiniMap.MINIMAP_SQUARE_SIZE+2, MiniMap.MINIMAP_SQUARE_SIZE+2);
        this.bottomRect.endFill();
        
        this.rightRect = this.game.add.graphics(this.x + MapWindow.BX + MapWindow.MAP_WIDTH*MiniMap.MINIMAP_SQUARE_SIZE, this.y + MapWindow.BY);
        this.rightRect.lineStyle(0, 0x000000, 1);
        this.rightRect.beginFill(WindowFrame.LIGHT_COLOUR);
        this.rightRect.drawRect(-1, -1, MiniMap.MINIMAP_SQUARE_SIZE+2, (MapWindow.MAP_HEIGHT+1)*MiniMap.MINIMAP_SQUARE_SIZE+2);
        this.rightRect.endFill();
        
        this.mapEdge = this.game.add.graphics(this.x + MapWindow.BX, this.y + MapWindow.BY);
        this.mapEdge.lineStyle(2, 0x000000, 1);
        this.mapEdge.drawRect(MiniMap.MINIMAP_SQUARE_SIZE, MiniMap.MINIMAP_SQUARE_SIZE, this.mapWidth, this.mapHeight);
        
        this.reload();
    }
    
    closeWindow() {
        this.window.setVisible(false);
        for(var i=0;i<MapWindow.MAP_WIDTH;i++) {
            for(var j=0;j<MapWindow.MAP_HEIGHT;j++) {
                this.window.mapSquares[i][j].destroy();
                this.window.mapHzWalls[i][j].destroy();
                this.window.mapVtWalls[i][j].destroy();
            }
        }
        this.window.mapSquares = [];
        this.window.mapEdge.destroy();
        this.window.topRect.destroy();
        this.window.leftRect.destroy();
        this.window.bottomRect.destroy();
        this.window.rightRect.destroy();
    }
    
    handleMouseDown() {
        super.handleMouseDown();
        if(this.game.input.mousePointer.x - MiniMap.MINIMAP_SQUARE_SIZE>= this.x + MapWindow.BX &&
          this.game.input.mousePointer.x - MiniMap.MINIMAP_SQUARE_SIZE < this.x + MapWindow.BX + this.mapWidth &&
          this.game.input.mousePointer.y - MiniMap.MINIMAP_SQUARE_SIZE >= this.y + MapWindow.BY &&
          this.game.input.mousePointer.y - MiniMap.MINIMAP_SQUARE_SIZE < this.y + MapWindow.BY+ this.mapHeight) {
            this.dragging = true;
            this.startDragX = this.game.input.mousePointer.x;
            this.startDragY = this.game.input.mousePointer.y;
        } 
    }
    
    handleMouseUp() {
        super.handleMouseUp();
        this.dragging = false;
        this.prevTdX = this.cTdX;
        this.prevTdY = this.cTdY;
    }
        
    reload() {
        for(var i=0;i<MapWindow.MAP_WIDTH;i++) {
            for(var j=0;j<MapWindow.MAP_HEIGHT;j++) {
                var mX = this.cSquareX+i;
                var mY = this.cSquareY+j;
                if(mX <0 || mX >= this.map.terrain.length || mY <0 || mY >= this.map.terrain[0].length) {
                    this.mapSquares[i][j].frame = 0;
                    this.mapHzWalls[i][j].visible = false;
                    this.mapVtWalls[i][j].visible = false;
                } else {
                        if(this.map.explored[mX][mY]) this.mapSquares[i][j].frame = this.map.terrain[mX][mY];
                    else this.mapSquares[i][j].frame = 0;
                    if(this.map.hzWalls[mX][mY] > 0) {
                        if(this.map.explored[mX][mY]) {
                            this.mapHzWalls[i][j].visible = true;
                            this.mapHzWalls[i][j].tint = WallData.DATA[this.map.hzWalls[mX][mY]][2];
                        } else this.mapHzWalls[i][j].visible = false;
                    } else {
                        this.mapHzWalls[i][j].visible = false;
                    }
                    if(this.map.vtWalls[mX][mY] > 0) {
                        if(this.map.explored[mX][mY]) {
                            this.mapVtWalls[i][j].visible = true;
                            this.mapVtWalls[i][j].tint = WallData.DATA[this.map.vtWalls[mX][mY]][2];
                        } else this.mapVtWalls[i][j].visible = false;
                    } else {
                        this.mapVtWalls[i][j].visible = false;
                    }
                }
            }
        }
    }
    
    update() {
        super.update();
        if(this.dragging) {
            var dX = -(this.game.input.mousePointer.x - this.startDragX)/MiniMap.MINIMAP_SQUARE_SIZE;
            var dY = -(this.game.input.mousePointer.y - this.startDragY)/MiniMap.MINIMAP_SQUARE_SIZE;
            this.cTdX = dX + this.prevTdX;
            this.cTdY = dY + this.prevTdY;
            if(this.game.input.mousePointer.x != this.prevMouseX || this.game.input.mousePointer.y != this.prevMouseY) {
                for(var i=0;i<MapWindow.MAP_WIDTH;i++) {
                    for(var j=0;j<MapWindow.MAP_HEIGHT;j++) {
                        this.mapSquares[i][j].x = this.x + MapWindow.BX + MiniMap.MINIMAP_SQUARE_SIZE*(i+Math.ceil(this.cTdX) - this.prevTdX) + (this.game.input.mousePointer.x - this.startDragX);
                        this.mapSquares[i][j].y = this.y + MapWindow.BY + MiniMap.MINIMAP_SQUARE_SIZE*(j+Math.ceil(this.cTdY) - this.prevTdY) + (this.game.input.mousePointer.y - this.startDragY);
                        
                        this.mapHzWalls[i][j].x = this.x + MapWindow.BX + MiniMap.MINIMAP_SQUARE_SIZE*(i+Math.ceil(this.cTdX) - this.prevTdX) + (this.game.input.mousePointer.x - this.startDragX);
                        this.mapHzWalls[i][j].y = this.y + MapWindow.BY + MiniMap.MINIMAP_SQUARE_SIZE*(j+Math.ceil(this.cTdY) - this.prevTdY) + (this.game.input.mousePointer.y - this.startDragY);
                        
                        this.mapVtWalls[i][j].x = this.x + MapWindow.BX + MiniMap.MINIMAP_SQUARE_SIZE*(i+Math.ceil(this.cTdX) - this.prevTdX) + (this.game.input.mousePointer.x - this.startDragX);
                        this.mapVtWalls[i][j].y = this.y + MapWindow.BY + MiniMap.MINIMAP_SQUARE_SIZE*(j+Math.ceil(this.cTdY) - this.prevTdY) + (this.game.input.mousePointer.y - this.startDragY);
                    }
                }
            }
            
            if(Math.ceil(this.cTdX) != this.cSquareX || Math.ceil(this.cTdY) != this.cSquareY) {
                this.cSquareX = Math.ceil(this.cTdX);
                this.cSquareY = Math.ceil(this.cTdY);
                this.reload();
            }
        }
        
        this.prevMouseX = this.game.input.mousePointer.x;
        this.prevMouseY = this.game.input.mousePointer.y;
    }
}

MapWindow.BX = 30;
MapWindow.BY = 30;
MapWindow.MAP_WIDTH = 13;
MapWindow.MAP_HEIGHT = 13;