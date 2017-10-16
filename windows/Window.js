class Window {
    constructor(game, x, y, width, height) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.windowFrame = new WindowFrame(game, x, y, width, height);
        this.texts = [];
        this.buttons = [];
        this.icons = [];
        this.visible = true;
    }
    
    setVisible(vis) {
        this.visible = vis;
        this.windowFrame.setVisible(vis);
        for(var i=0;i<this.buttons.length;i++) {
            this.buttons[i].setVisible(vis);
        }
        for(var i=0;i<this.texts.length;i++) {
            this.texts[i].visible = vis;
        }
        for(var i=0;i<this.icons.length;i++) {
            this.icons[i].visible = vis;
        }
    }
    
    isMouseOver() {
        return this.visible && this.game.input.mousePointer.x >= this.x &&
                this.game.input.mousePointer.x < this.x + this.width &&
                this.game.input.mousePointer.y >= this.y &&
                this.game.input.mousePointer.y < this.y + this.height;
    }
    
    update() {
        //this.windowFrame.update();
        for(var i=0;i<this.buttons.length;i++) {
            this.buttons[i].update();
        }
    }
    
    handleMouseDown() {
        for(var i=0;i<this.buttons.length;i++) {
            if(this.buttons[i].mouseOver && this.buttons[i].active) {
                this.buttons[i].clicked = true;
            }
        }
    }
    
    handleMouseUp() {
        for(var i=0;i<this.buttons.length;i++) {
            if(this.buttons[i].clicked && this.buttons[i].mouseOver) {
                this.buttons[i].activateFunction();
            }
            this.buttons[i].clicked = false;
        }
    }
}

Window.TEXT_SIZE = 16;
Window.TEXT_STYLE = { fontSize: Window.TEXT_SIZE+'px', fill: '#000'};