class WallFactory {
    constructor(game) {
        this.game = game;
        this.creating = false;
        this.finished = false;
        
        this.i = -(ViewDisplay.N-1)/2;
        this.j = 0;
    }
    
    createWall(i, j) {
        this.creating = true;
    }
    
    update() {
        this.finished = true;
        /*if(!this.creating) {
            this.createTile(this.i+(ViewDisplay.N-1)/2, this.j);
        }
        else {
            var tile = viewDisplay.tiles[this.j][this.i+(ViewDisplay.N-1)/2];
            if(tile.ready) {
                this.creating = false;
                this.i++;
                if(this.i == (ViewDisplay.N-1)/2+1) {
                    this.i = -(ViewDisplay.N-1)/2;
                    this.j++;
                }
                if(this.j == ViewDisplay.N2) {
                    this.finished = true;
                    //document.getElementById("canvas").style.display="none";
                }
            }
        }*/
    }
}