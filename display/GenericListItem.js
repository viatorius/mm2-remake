class GenericListItem {
    constructor(x, y, list, game, width, height) {
        this.x = x;
        this.y = y;
        this.list = list;
        this.game = game;
        
        this.height = height;
        this.width = width;
        
        this.texts = [];
        
        this.visible = true;
        this.create();
    }
    
    create() {
        this.behindBox = this.game.add.graphics(this.x, this.y);
        this.behindBox.beginFill(0xFFFFFF);
        this.behindBox.drawRect(0, 1, this.width, this.height-2);
    }
    
    setVisible(vis) {
        this.visible = vis;
        this.behindBox.visible = vis;
        for(var i=0;i<this.texts.length;i++) {
            this.texts[i].visible = vis;
        }
    }
    
    isMouseOver() {
        if(this.visible) {
            if(this.game.input.mousePointer.x >= this.x &&
               this.game.input.mousePointer.x < this.x + this.width &&
               this.game.input.mousePointer.y >= this.y &&
               this.game.input.mousePointer.y < this.y + this.height) {
                return true;
            }
        }
        return false;
    }
    
    load(generic) {
        this.setVisible(true);
        if(generic == null) {
            for(var i=0;i<this.texts.length;i++) {
                this.texts[i].text = "";
            }
            this.behindBox.visible = false;
        }
    }
    
    setNormal() {this.behindBox.visible = false;}
    setSelected() {this.behindBox.visible = true; this.behindBox.tint = 0xCCCCCC;}
    setInvalid() {this.behindBox.visible = true; this.behindBox.tint = 0xFF8888;}
    
}