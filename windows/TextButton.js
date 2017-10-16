class TextButton{
    constructor(game, x, y, width, height, text, activateFunction, window, standardColor, mouseOverColor, pressedColor, grayColor, edgeColor) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.textField = text;

        this.standardColor = standardColor;
        this.mouseOverColor = mouseOverColor;
        this.pressedColor = pressedColor;
        this.grayColor = grayColor;
        this.edgeColor = edgeColor;

        this.TEXT_SIZE = 16;
        this.TEXT_STYLE = { fontSize: this.TEXT_SIZE+'px', fill: '#000000'};

        this.edge = this.createEdge(x, y, width, height);
        this.body = this.createBody(x+1, y+1, width-1, height-1);
        this.textField = game.add.text(x+4, y+(height - this.TEXT_SIZE)/2, text, this.TEXT_STYLE);

        this.mouseOver = false;
        this.clicked = false;
        this.visible = true;
        this.active = true;

        this.window = window;
        this.activateFunction = activateFunction;
    }

    createEdge(xx, yy, ww, hh) {
        result = this.game.add.graphics(xx, yy);
        result.lineStyle(1, this.edgeCol, 1);
        result.moveTo(0,0);
        result.lineTo(ww, 0);
        result.lineTo(ww, hh); 
        result.lineTo(0, hh);
        result.lineTo(0, 0);
        return result;
    }

    createBody(xx, yy, ww, hh) {
        result = this.game.add.graphics(xx, yy);
        result.beginFill(0xFFFFFF);
        result.lineStyle(0, this.edgeCol, 1);
        result.moveTo(0,0);
        result.lineTo(ww, 0);
        result.lineTo(ww, hh); 
        result.lineTo(0, hh);
        result.lineTo(0, 0);
        result.endFill();
        return result;
    }

    setVisible(vis) {
        this.visible = vis;
        this.edge.visible = vis;
        this.body.visible = vis;
        this.textField.visible = vis;
    }

    update() {
        this.mouseOver = this.visible && this.game.input.mousePointer.x >= this.x &&
                this.game.input.mousePointer.x < this.x + this.width &&
                this.game.input.mousePointer.y >= this.y &&
                this.game.input.mousePointer.y < this.y + this.height;

        //console.log("aaa "+this.mouseOver);
        if(!this.active) {
            this.body.tint = 0xBBBBBB;
        }
        else {
            if(this.clicked) this.body.tint = 0xFF0000;
            else if(this.mouseOver) this.body.tint = 0xFFFF00;
            else this.body.tint = 0xFFFFFF;
        }
    }
}