class GenericList {
    constructor(x, y, window, game, size) {
        this.x = x;
        this.y = y;
        this.window = window;
        this.game = game;
        this.size = size;
        this.costMultiplier = 1;
        
        this.scrollHeight = this.size*InventoryListItem.HEIGHT-16;
                
        this.cScrollPosition = 0;
        this.scrollDrag = false;
        this.mouseStartDragY = -1;
        this.selectedItem = -1;
        
        this.visible = true;
        
        this.listData = [];
        this.isItemValid = [];
        this.isItemSelected = [];
        this.listItems = new Array(this.size);
        
        this.create();
    }
    
    create() {
        // scroll bar
        this.inventoryScrollUpArrow = this.game.add.sprite(this.x+225, this.y-8.5, 'smallArrow');
        this.inventoryScrollDownArrow = this.game.add.sprite(this.x+225, this.y+7.5+this.scrollHeight, 'smallArrow');
        this.inventoryScrollDownArrow.frame = 1;
        this.inventoryScrollBackgroundBar = this.game.add.graphics(this.x+225, this.y+9);
        this.inventoryScrollBackgroundBar.lineStyle(1.5, 0x000000, 1);
        this.inventoryScrollBackgroundBar.drawRect(1.75, 0, 15, this.scrollHeight);
        this.inventoryScrollBar = this.game.add.graphics(this.x+225, this.y+9);
        this.inventoryScrollBar.beginFill(0xFFFFFF);
        this.inventoryScrollBar.lineStyle(1.5, 0x000000, 1);
        this.inventoryScrollBar.drawRect(1.75, 0, 15, this.scrollHeight);
        
        //lines
        this.lines = new Array(2);
        this.lines[0] = this.game.add.graphics(this.x, this.y);
        this.lines[0].lineStyle(1.5, 0x000000, 1);
        this.lines[0].moveTo(0,0);
        this.lines[0].lineTo(InventoryListItem.WIDTH, 0);
        
        this.lines[1] = this.game.add.graphics(this.x, this.y+6.5+this.size*InventoryListItem.HEIGHT);
        this.lines[1].lineStyle(1.5, 0x000000, 1);
        this.lines[1].moveTo(0,0);
        this.lines[1].lineTo(InventoryListItem.WIDTH, 0);
    }
    
    setVisible(vis) {
        this.visible = vis;
        for(var i=0;i<this.size;i++) {
            if(this.listItems[i] != null) this.listItems[i].setVisible(vis);
        }
        for(var i=0;i<this.lines.length;i++) {
            this.lines[i].visible = vis;
        }
        this.inventoryScrollUpArrow.visible = vis;
        this.inventoryScrollDownArrow.visible = vis;
        this.inventoryScrollBar.visible = vis;
        this.inventoryScrollBackgroundBar.visible = vis;
    }
    
    isMouseOver(icon) {
        if(icon.visible) {
            if(this.game.input.mousePointer.x >= icon.x &&
                this.game.input.mousePointer.x < icon.x + icon.width &&
                this.game.input.mousePointer.y >= icon.y &&
                this.game.input.mousePointer.y < icon.y + icon.height) return true;
        }
        return false;
    }
    
    getMouseOver() {
        for(var i=0;i<this.size;i++) {
            if(this.listItems[i].isMouseOver()) return i;
        }
        return -1;
    }
    
    isMouseOverAny() {
        return this.getMouseOver() >= 0 || this.isMouseOver(this.inventoryScrollUpArrow) || this.isMouseOver(this.inventoryScrollDownArrow) || this.isMouseOver(this.inventoryScrollBar);
    }
    
    handleMouseDown() {
        if(this.isMouseOver(this.inventoryScrollUpArrow)) {
            this.cScrollPosition = Math.max(0, this.cScrollPosition-1);
            this.reloadItems();
        }
        if(this.isMouseOver(this.inventoryScrollDownArrow)) {
            this.cScrollPosition = Math.min(this.listData.length - this.size, this.cScrollPosition+1);
            this.reloadItems();
        }
        if(this.isMouseOver(this.inventoryScrollBar)) {
            this.scrollDrag = true;
            this.mouseStartDragY = this.game.input.mousePointer.y - this.inventoryScrollBar.y;
        }
    }
    
    handleMouseUp() {
        this.scrollDrag = false;
    }
    
    load(data) {
        this.listData = data;
        this.reload();
    }
        
    reload() {
        this.inventoryScrollUpArrow.visible = true;
        this.inventoryScrollDownArrow.visible = true;
        if(this.listData.length <= this.size) {
            if(this.listData.length == 0) {
                this.inventoryScrollUpArrow.visible = false;
                this.inventoryScrollDownArrow.visible = false;
            } else {
                this.inventoryScrollUpArrow.tint = 0xAAAAAA;
                this.inventoryScrollDownArrow.tint = 0xAAAAAA;
            }
            this.inventoryScrollBar.visible = false;
            this.inventoryScrollBackgroundBar.visible = false;
        } else {
            this.inventoryScrollUpArrow.tint = 0xFFFFFF
            this.inventoryScrollDownArrow.tint = 0xFFFFFF;
            this.inventoryScrollBar.visible = true;
            this.inventoryScrollBackgroundBar.visible = true;
            // we need to redraw the scroll bar because rescaling affects the line thickness
            this.inventoryScrollBar.destroy();
            this.inventoryScrollBar = this.game.add.graphics(this.x+225, this.y+9);
            this.inventoryScrollBar.beginFill(0xFFFFFF);
            this.inventoryScrollBar.lineStyle(1.5, 0x000000, 1);
            this.inventoryScrollBar.drawRect(1.75, 0, 15, this.scrollHeight*Math.max(0.05, this.size/this.listData.length));
        }
        this.reloadSelectedItems();
        this.reloadValidItems();
        this.reloadItems();
    }
    
    reloadSelectedItems() {
        this.isItemSelected = new Array(this.listData.length);
        for(var i=0;i<this.listData.length;i++) {
            this.isItemSelected[i] = false;
        }
    }
    
    reloadValidItems() {
        this.isItemValid = new Array(this.listData.length);
        for(var i=0;i<this.listData.length;i++) {
            this.isItemValid[i] = true;
        }
    }
    
    select(x) {
        this.isItemSelected[x] = !this.isItemSelected[x];
    }
    
    selectOnly(x) {
        for(var i=0;i<this.listData.length;i++) {
            if(i == x) this.isItemSelected[i] = true;
            else this.isItemSelected[i] = false;
        }
    }
    
    isAnySelected() {
        var result = false;
        for(var i=0;i<this.listData.length;i++) {
            result = result || this.isItemSelected[i];
        }
        return result;
    }
    
    getFirstSelectedIdx() {
        for(var i=0;i<this.listData.length;i++) {
            if(this.isItemSelected[i]) return i;
        }
        return -1;
    }
    
    reloadItems() {
        if(!this.scrollDrag) this.inventoryScrollBar.y = this.y + 9 + this.scrollHeight*this.cScrollPosition/this.listData.length;
    }
    
    update() {
        if(this.scrollDrag) {
            this.inventoryScrollBar.y = this.game.input.mousePointer.y - this.mouseStartDragY;
            this.inventoryScrollBar.y = Math.max(this.inventoryScrollBar.y, this.y + 9);
            this.inventoryScrollBar.y = Math.min(this.inventoryScrollBar.y, this.y + 9 + (1 - this.size/this.listData.length) * this.scrollHeight);
            
            var oScrollPosition = this.cScrollPosition;
            this.cScrollPosition = Math.round((this.inventoryScrollBar.y - (this.y+9)) / ((1 - this.size/this.listData.length) * this.scrollHeight) * (this.listData.length - this.size));
            if(oScrollPosition != this.cScrollPosition) {
                this.reloadItems();
            }
        }
    }
}