class TileFactory {
    constructor(game) {
        this.game = game;
        this.tileHolders;
        this.creating = false;
        this.finished = false;
        
        this.tileHolders = new Array(ViewDisplay.N2);
        for(var j=0;j<this.tileHolders.length;j++) {
            this.tileHolders[j] = new Array(ViewDisplay.N);
        }
        
        this.i = -(ViewDisplay.N-1)/2;
        this.j = 0;
        this.k = 0;
    }
    
    createTile(i, j, k) {
        if(k == 0) {
            var base = ViewDisplay.trapX(i+1,j+1) - ViewDisplay.trapX(i,j+1);
            var height = ViewDisplay.trapY(j) - ViewDisplay.trapY(j+1);
            var offsetX = 0;//-i*base/80; // edges don't look too well, make them overlap a bit more
            var dis = 0.25*(-0.00001+i+3*j);
            var x = ViewDisplay.VIEW_BX + ViewDisplay.trapX(i,j+1) + offsetX;
            var y = ViewDisplay.VIEW_BY - ViewDisplay.trapY(j);
            var leftX = (-ViewDisplay.trapX(i,j+1) + ViewDisplay.trapX(i,j))/base;
            var rightX = (-ViewDisplay.trapX(i+1,j+1) + ViewDisplay.trapX(i+1,j))/base;
            //console.log("lr("+i+", "+j+"): "+leftX+", "+rightX);
            this.tileHolders[j][i] = new ProjectedTile(this.game, x, y, leftX, rightX, TerrainData.DATA.length);
            this.tileHolders[j][i].setWidthHeight(base, height);
        } 
        if(!(TerrainData.DATA[k][4] == "")) {
            this.tileHolders[j][i].create("assets/"+TerrainData.DATA[k][4], k);
        } else {
            this.tileHolders[j][i].drawPlainTileFrame(TerrainData.DATA[k][1], k);
        }
        this.creating = true;
    }
    
    update() {
        if(!this.creating) {
            this.createTile(this.i+(ViewDisplay.N-1)/2, this.j, this.k);
        }
        else {
            var tile = this.tileHolders[this.j][this.i+(ViewDisplay.N-1)/2];
            if(tile.ready) {
                this.creating = false;
                this.k++;
                if(this.k == TerrainData.DATA.length) {
                    this.k = 0;
                    tile.finaliseSpritesheet();
                    //tile.sprite.frame = 1;
                    this.i++;
                }
                if(this.i == (ViewDisplay.N-1)/2+1) {
                    this.i = -(ViewDisplay.N-1)/2;
                    this.j++;
                }
                if(this.j == ViewDisplay.N2) {
                    this.finished = true;
                    //document.getElementById("canvas").style.display="none";
                }
            }
        }
    }
    
    createSprites(viewDisplay) {
        viewDisplay.tiles = new Array(ViewDisplay.N2);
        for(var j=0;j<viewDisplay.tiles.length;j++) {
            viewDisplay.tiles[j] = new Array(ViewDisplay.N);
            for(var i=0;i<viewDisplay.tiles[j].length;i++) {
                this.tileHolders[j][i].createSprite();
                viewDisplay.tiles[j][i] = this.tileHolders[j][i].sprite;
            }
        }
    }
}