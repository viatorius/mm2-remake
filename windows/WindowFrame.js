    var WindowFrame = function(game, x, y, width, height, darkColor = WindowFrame.DARK_COLOUR, lightColor=WindowFrame.LIGHT_COLOUR, edgeColor=WindowFrame.EDGE_COLOUR) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        
        this.darkColor = darkColor;
        this.lightColor = lightColor;
        this.edgeColor = edgeColor;
        
        this.cornerTL = this.createCorner(x, y);
        this.cornerBL = this.createCorner(x, y+height-4);
        this.cornerTR = this.createCorner(x+width-4, y);
        this.cornerBR = this.createCorner(x+width-4, y+height-4);
        this.edgeT = this.createHorizontalEdge(x+4, y, width-8, 5);
        this.edgeB = this.createHorizontalEdge(x+4, y+height-4, width-8, 5);
        this.edgeL = this.createVerticalEdge(x, y+4, height-8, 5);
        this.edgeR = this.createVerticalEdge(x+width-4, y+4, height-8, 5);
        this.body = this.createBody(x+5, y+5, width-9, height-9);
        
        this.mouseOver = false;
        this.clicked = false;
        this.visible = true;
        this.processedClick = false;
    }
    
    WindowFrame.prototype.createCorner = function(xx, yy) {
        result = this.game.add.graphics(xx, yy);
        result.beginFill(this.darkCol);
        result.lineStyle(1, this.edgeCol, 1);
        result.moveTo(0,0);
        result.lineTo(4, 0);
        result.lineTo(4, 4); 
        result.lineTo(0, 4);
        result.lineTo(0, 0);
        result.endFill();
        return result;
    }
    
    WindowFrame.prototype.createHorizontalEdge = function(xx, yy, ww, th) {
        result = this.game.add.graphics(xx, yy);
        for(var i=0;i<th;i++) {
            result.lineStyle(1, this.edgeColor, 1);
            if(i % 2 > 0) {
                result.lineStyle(1, this.darkColor, 1);
            }
            result.moveTo(0,i);
            result.lineTo(ww, i);
        }
        return result;
    }
    
    WindowFrame.prototype.createVerticalEdge = function(xx, yy, hh, th) {
        result = this.game.add.graphics(xx, yy);
        for(var i=0;i<th;i++) {
            result.lineStyle(1, this.edgeColor, 1);
            if(i % 2 > 0) {
                result.lineStyle(1, this.darkColor, 1);
            }
            result.moveTo(i, 0);
            result.lineTo(i, hh);
        }
        return result;
    }
    
    WindowFrame.prototype.createBody = function(xx, yy, ww, hh) {
        result = this.game.add.graphics(xx, yy);
        result.beginFill(this.lightColor);
        result.lineStyle(0, this.edgeColor, 1);
        result.moveTo(0,0);
        result.lineTo(ww, 0);
        result.lineTo(ww, hh); 
        result.lineTo(0, hh);
        result.lineTo(0, 0);
        result.endFill();
        return result;
    }
    
    WindowFrame.prototype.setVisible = function(vis) {
        this.visible = vis;
        this.cornerTL.visible = vis;
        this.cornerBL.visible = vis;
        this.cornerTR.visible = vis;
        this.cornerBR.visible = vis;
        this.edgeT.visible = vis;
        this.edgeB.visible = vis;
        this.edgeL.visible = vis;
        this.edgeR.visible = vis;
        this.body.visible = vis;
    }
    
    WindowFrame.DARK_COLOUR = 0x444444;
    WindowFrame.LIGHT_COLOUR = 0xADADAD;
    WindowFrame.EDGE_COLOUR = 0x000000;