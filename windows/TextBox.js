class TextBox{
    constructor(game, x, y, width, height, text, xOffset=0) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.visible = true;
        this.rectangle = this.game.add.graphics(this.x, this.y);
        this.rectangle.beginFill(0xFFFFFF);
        this.rectangle.lineStyle(1.5, 0x000000, 1);
        this.rectangle.drawRect(0, 0, width, height);
        this.text = this.game.add.text(this.x+(this.height-Window.TEXT_SIZE)/2+xOffset, this.y+(this.height-Window.TEXT_SIZE)/2, text, Window.TEXT_STYLE);
    }
    
    setTint(tint) {
        this.rectangle.tint = tint;
    }
    
    setVisible(vis) {
        this.visible = vis;
        this.rectangle.visible = vis;
        this.text.visible = vis;
    }
    
    isMouseOver() {
        if(this.visible) {
            if(this.game.input.mousePointer.x >= this.x &&
                this.game.input.mousePointer.x < this.x + this.width &&
                this.game.input.mousePointer.y >= this.y &&
                this.game.input.mousePointer.y < this.y + this.height) return true;
        }
        return false;
    }
}