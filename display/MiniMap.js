class MiniMap {
    constructor(game, party) {
        this.game = game;
        this.pcParty = party;
        this.mMapSquares = [];
        this.mMapHzWalls = [];
        this.mMapVtWalls = [];
        this.mMapArrow = null;
        this.edge;
    }
    
    createMiniMap() {
        this.mMapSquares = new Array(MiniMap.MINIMAP_SIZE);
        for(var i=0;i<MiniMap.MINIMAP_SIZE;i++) {
            this.mMapSquares[i] = new Array(MiniMap.MINIMAP_SIZE);
            for(var j=0;j<MiniMap.MINIMAP_SIZE;j++) {
                this.mMapSquares[i][j] = this.game.add.sprite(MiniMap.MINIMAP_BX + MiniMap.MINIMAP_SQUARE_SIZE*i, MiniMap.MINIMAP_BY+MiniMap.MINIMAP_SQUARE_SIZE*j, 'minimapSquare');
            }
        }
        for(var i=0;i<MiniMap.MINIMAP_SIZE;i++) {
            this.mMapHzWalls[i] = new Array(MiniMap.MINIMAP_SIZE);
            for(var j=0;j<MiniMap.MINIMAP_SIZE;j++) {
                this.mMapHzWalls[i][j] = this.game.add.graphics(MiniMap.MINIMAP_BX + MiniMap.MINIMAP_SQUARE_SIZE*(i), MiniMap.MINIMAP_BY+MiniMap.MINIMAP_SQUARE_SIZE*j);
                this.mMapHzWalls[i][j].lineStyle(2, 0xFFFFFF, 1);
                this.mMapHzWalls[i][j].moveTo(0, 0);
                this.mMapHzWalls[i][j].lineTo(MiniMap.MINIMAP_SQUARE_SIZE, 0);
            }
        }
        for(var i=0;i<MiniMap.MINIMAP_SIZE;i++) {
            this.mMapVtWalls[i] = new Array(MiniMap.MINIMAP_SIZE);
            for(var j=0;j<MiniMap.MINIMAP_SIZE;j++) {
                this.mMapVtWalls[i][j] = this.game.add.graphics(MiniMap.MINIMAP_BX + MiniMap.MINIMAP_SQUARE_SIZE*(i), MiniMap.MINIMAP_BY+MiniMap.MINIMAP_SQUARE_SIZE*j);
                this.mMapVtWalls[i][j].lineStyle(2, 0xFFFFFF, 1);
                this.mMapVtWalls[i][j].moveTo(0, 0);
                this.mMapVtWalls[i][j].lineTo(0, MiniMap.MINIMAP_SQUARE_SIZE);
            }
        }
        this.mMapArrow = this.game.add.sprite(MiniMap.MINIMAP_BX+MiniMap.ARROW_BX, MiniMap.MINIMAP_BY+MiniMap.ARROW_BY, 'minimapArrow');
        this.mMapArrow.tint = 0xBB0000;
        this.updateMinimap();
        
        this.edge = this.game.add.graphics(MiniMap.MINIMAP_BX-1, MiniMap.MINIMAP_BY-1);
        this.edge.lineStyle(3, 0x000000, 1);
        this.edge.drawRect(0, 0, MiniMap.MINIMAP_SIZE*MiniMap.MINIMAP_SQUARE_SIZE+2, MiniMap.MINIMAP_SIZE*MiniMap.MINIMAP_SQUARE_SIZE+2);
    }
    
    updateMinimap() {
        var map = this.pcParty.cMap;
        for(var i=0;i<MiniMap.MINIMAP_SIZE;i++) {
            for(var j=0;j<MiniMap.MINIMAP_SIZE;j++) {
                var mX = map.pcParty.x+i-Math.floor(MiniMap.MINIMAP_SIZE/2);
                var mY = map.pcParty.y+j-Math.floor(MiniMap.MINIMAP_SIZE/2);
                if(mX <0 || mX > map.terrain.length || mY <0 || mY > map.terrain[0].length) {
                    this.mMapSquares[i][j].frame = 0;
                    this.mMapHzWalls[i][j].visible = false;
                    this.mMapVtWalls[i][j].visible = false;
                } else {
                    if(mX < map.terrain.length && mY < map.terrain[0].length) this.mMapSquares[i][j].frame = map.terrain[mX][mY];
                    else this.mMapSquares[i][j].frame = 0;
                    if(mX < map.hzWalls.length && mY < map.hzWalls[0].length) {
                        if(map.hzWalls[mX][mY] > 0) {
                            this.mMapHzWalls[i][j].visible = true;
                            this.mMapHzWalls[i][j].tint = WallData.DATA[map.hzWalls[mX][mY]][2];
                        } else {
                            this.mMapHzWalls[i][j].visible = false;
                        }
                    } else this.mMapHzWalls[i][j].visible = false;
                    if(mX < map.vtWalls.length && mY < map.vtWalls[0].length) {
                        if(map.vtWalls[mX][mY] > 0) {
                            this.mMapVtWalls[i][j].visible = true;
                            this.mMapVtWalls[i][j].tint = WallData.DATA[map.vtWalls[mX][mY]][2];
                        } else {
                            this.mMapVtWalls[i][j].visible = false;
                        }
                    } else this.mMapVtWalls[i][j].visible = false;
                }
                if(map.pcParty.dir == 0) {
                    this.mMapArrow.angle = 0; 
                    this.mMapArrow.x = MiniMap.MINIMAP_BX+MiniMap.ARROW_BX;
                    this.mMapArrow.y = MiniMap.MINIMAP_BY+MiniMap.ARROW_BY;
                }
                if(map.pcParty.dir == 1) {
                    this.mMapArrow.angle = 90;
                    this.mMapArrow.x = MiniMap.MINIMAP_BX+MiniMap.ARROW_BX+MiniMap.MINIMAP_SQUARE_SIZE;
                    this.mMapArrow.y = MiniMap.MINIMAP_BY+MiniMap.ARROW_BY;
                }
                if(map.pcParty.dir == 2) {
                    this.mMapArrow.angle = 180;
                    this.mMapArrow.x = MiniMap.MINIMAP_BX+MiniMap.ARROW_BX+MiniMap.MINIMAP_SQUARE_SIZE;
                    this.mMapArrow.y = MiniMap.MINIMAP_BY+MiniMap.ARROW_BY+MiniMap.MINIMAP_SQUARE_SIZE;
                }
                if(map.pcParty.dir == 3) {
                    this.mMapArrow.angle = 270;
                    this.mMapArrow.x = MiniMap.MINIMAP_BX+MiniMap.ARROW_BX;
                    this.mMapArrow.y = MiniMap.MINIMAP_BY+MiniMap.ARROW_BY+MiniMap.MINIMAP_SQUARE_SIZE;
                }
            }
        }
    }
}

MiniMap.MINIMAP_SIZE = 7;
MiniMap.MINIMAP_SQUARE_SIZE = 20;
MiniMap.MINIMAP_BX = 442;
MiniMap.MINIMAP_BY = 18.5;
MiniMap.ARROW_BX = Math.floor(MiniMap.MINIMAP_SIZE/2)*MiniMap.MINIMAP_SQUARE_SIZE;
MiniMap.ARROW_BY = Math.floor(MiniMap.MINIMAP_SIZE/2)*MiniMap.MINIMAP_SQUARE_SIZE;