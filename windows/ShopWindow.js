class ShopWindow extends Window {
    constructor(game, x, y, mainFrame) {
        super(game, x, y, 520, 220);
        this.event;
        this.pcParty;
        this.currentPc;
        this.mainFrame = mainFrame;
        
        this.inventoryDragPc = false;
        this.inventoryDragShop = false;
        this.inventoryInvalidDragShop = false;
        this.equipmentStartDragX = -1;
        this.equipmentStartDragY = -1;
        
        this.mouseMoved = false;
        this.mousePressX;
        this.mousePressY;
        
        this.create();
        this.updateBoxes();
    }
    
    create() {
        this.texts.push(this.game.add.text(this.x+8, this.y+8, "char name", Window.TEXT_STYLE))
        this.texts.push(this.game.add.text(this.x+ShopWindow.LIST_BASE_X2, this.y+8, "money text", Window.TEXT_STYLE))
        
        this.buttons.push(new TextButton(this.game, this.x+448, this.y+192, 52, 20, "Leave", this.handleClose, this));
        
        this.inventoryListPc = new InventoryList(this.x+ShopWindow.LIST_BASE_X, this.y+ShopWindow.LIST_BASE_Y, this, this.game, PcInfoWindow.INVENTORY_LIST_SIZE);
        this.inventoryListShop = new InventoryList(this.x+ShopWindow.LIST_BASE_X2, this.y+ShopWindow.LIST_BASE_Y, this, this.game, PcInfoWindow.INVENTORY_LIST_SIZE);
        
        // drag icon
        this.dragIcon = this.game.add.sprite(0, 0, 'item');
        this.dragIcon.alpha = 0.5;
        this.dragIcon.visible = false;
        this.dragItem = null;
        this.dragItemSlot = -1;
        
        // buy square
        this.buyBox = new TextBox(this.game, this.x+348, this.y+192, 42, 20, "Buy", 4);
        
        // sell square
        this.sellBox = new TextBox(this.game, this.x+398, this.y+192, 42, 20, "Sell", 4);
    }
    
    determineValidBuyItemsAndReload() {
        for(var i=0;i<this.event.inventory.length;i++) {
            var cost = this.event.buyCostMultiplier * this.event.inventory[i].value;
            this.inventoryListShop.isItemValid[i] = cost <= pcParty.gold;
        }
        this.inventoryListShop.reloadItems();
    }
    
    loadShop(event, pcParty) {
        this.event = event;
        this.pcParty = pcParty;
        this.currentPc = 0;
        this.inventoryListPc.cScrollPosition = 0;
        this.inventoryListShop.cScrollPosition = 0;
        this.loadPc(pcParty.members[this.currentPc]);
        this.inventoryListShop.setCostMultiplier(this.event.buyCostMultiplier);
        this.inventoryListShop.load(this.event.inventory);
        this.determineValidBuyItemsAndReload()
    }
    
    loadPc(pc, csp=0) {
        this.texts[0].text = pc.name;
        this.texts[1].text = "your gold: "+this.pcParty.gold;
        this.inventoryListPc.cScrollPosition = csp;
        this.inventoryListPc.load(pc.inventory);
    }
    
    setVisible(vis) {
        super.setVisible(vis);
        this.inventoryListPc.setVisible(vis);
        this.inventoryListShop.setVisible(vis);
        this.buyBox.setVisible(vis);
        this.sellBox.setVisible(vis);
    }
    
    getTotalGoldCost() {
        var cost = 0;
        for(var i=0;i<this.inventoryListShop.isItemSelected.length; i++) {
            if(this.inventoryListShop.isItemSelected[i]) {
                cost += this.inventoryListShop.listData[i].value * this.inventoryListShop.costMultiplier;
            }
        }
        return cost;
    }
    
    handleMouseDown() {
        super.handleMouseDown();
        var portraitMouseOver = mainFrame.getPortraitMouseOver();
        if(portraitMouseOver >= 0) {
            this.currentPc = portraitMouseOver;
            this.loadPc(this.pcParty.members[this.currentPc]);
        }
        var inventoryMouseOverPc = this.inventoryListPc.getMouseOver();
        if(inventoryMouseOverPc >= 0 && this.pcParty.members[this.currentPc].inventory[inventoryMouseOverPc + this.inventoryListPc.cScrollPosition] != null) {
            this.inventoryDragPc = true;
            this.dragIcon.x =  this.inventoryListPc.listItems[inventoryMouseOverPc].icon.x;
            this.dragIcon.y =  this.inventoryListPc.listItems[inventoryMouseOverPc].icon.y;
            this.dragItem = this.pcParty.members[this.currentPc].inventory[inventoryMouseOverPc + this.inventoryListPc.cScrollPosition];
            this.dragItemSlot = inventoryMouseOverPc;
            this.dragIcon.frame = this.dragItem.type;
            this.equipmentStartDragX = this.inventoryListPc.listItems[inventoryMouseOverPc].icon.width/2;
            this.equipmentStartDragY = this.inventoryListPc.listItems[inventoryMouseOverPc].icon.height/2;
        }
        var inventoryMouseOverShop = this.inventoryListShop.getMouseOver();
        if(inventoryMouseOverShop >= 0 && this.event.inventory[inventoryMouseOverShop + this.inventoryListShop.cScrollPosition] != null) {
            this.dragItem = this.event.inventory[inventoryMouseOverShop + this.inventoryListShop.cScrollPosition];
            if(this.dragItem.value * this.inventoryListShop.costMultiplier <= this.pcParty.gold) {
                this.inventoryDragShop = true;
                this.dragIcon.x =  this.inventoryListShop.listItems[inventoryMouseOverShop].icon.x;
                this.dragIcon.y =  this.inventoryListShop.listItems[inventoryMouseOverShop].icon.y;
                this.dragItemSlot = inventoryMouseOverShop;
                this.dragIcon.frame = this.dragItem.type;
                this.equipmentStartDragX = this.inventoryListShop.listItems[inventoryMouseOverShop].icon.width/2;
                this.equipmentStartDragY = this.inventoryListShop.listItems[inventoryMouseOverShop].icon.height/2;
            }
        }
        this.inventoryListPc.handleMouseDown();
        this.inventoryListShop.handleMouseDown();
        
        this.mouseMoved = false;
        this.mousePressX = this.game.input.mousePointer.x;
        this.mousePressY = this.game.input.mousePointer.y;
        
        if(this.sellBox.isMouseOver() && !this.mouseMoved && this.inventoryListPc.isAnySelected()) {
            // we need to make a deep copy because the selected items will be reset after each item is removed
            var toRemove = [];
            for(var i=0;i<this.inventoryListPc.isItemSelected.length;i++) {
                toRemove.push(this.inventoryListPc.isItemSelected[i]);
            }
            for(var i=this.inventoryListPc.isItemSelected.length-1;i>=0;i--) {
                if(toRemove[i]) {
                    this.sellItem(this.pcParty.members[this.currentPc], i);
                }
            }
        }
        
        if(this.buyBox.isMouseOver() && !this.mouseMoved && this.inventoryListShop.isAnySelected() && this.getTotalGoldCost() < this.pcParty.gold) {
            // we need to make a deep copy because the selected items will be reset after each item is removed
            var toRemove = [];
            for(var i=0;i<this.inventoryListShop.isItemSelected.length;i++) {
                toRemove.push(this.inventoryListShop.isItemSelected[i]);
            }
            for(var i=this.inventoryListShop.isItemSelected.length-1;i>=0;i--) {
                if(toRemove[i]) {
                    this.buyItem(this.pcParty.members[this.currentPc], i);
                }
            }
        }
        
        if(this.inventoryListPc.visible && !this.inventoryListPc.isMouseOverAny()) {
            this.inventoryListPc.reloadSelectedItems();
            this.inventoryListPc.reloadItems();
        }
        if(this.inventoryListShop.visible && !this.inventoryListShop.isMouseOverAny()) {
            this.inventoryListShop.reloadSelectedItems();
            this.inventoryListShop.reloadItems();
        }
        //this.discardSquare.tint = 0xBBBBBB;
    }
    
    buyItem(pc, slot) {
        var item = this.event.inventory[slot];
        this.event.inventory.splice(slot, 1);
        if(this.inventoryListShop.cScrollPosition == this.event.inventory.length - this.inventoryListShop.size + 1 && this.event.inventory.length >= this.inventoryListShop.size) {
            this.inventoryListShop.cScrollPosition--;
        }
        pc.addToInventory(item);
        this.inventoryListShop.load(this.event.inventory, this.inventoryListShop.costMultiplier);
        this.pcParty.gold -= item.value * this.inventoryListShop.costMultiplier;
        this.loadPc(pc, this.inventoryListPc.cScrollPosition);
        this.mainFrame.reload();
        this.determineValidBuyItemsAndReload();
    }
    
    sellItem(pc, slot) {
        var item = pc.inventory[slot];
        pc.removeFromInventory(slot);
        if(this.inventoryListPc.cScrollPosition == pc.inventory.length - this.inventoryListPc.size + 1 && pc.inventory.length >= this.inventoryListPc.size) {
            this.inventoryListPc.cScrollPosition--;
        }
        this.event.inventory.push(item);
        this.inventoryListShop.load(this.event.inventory, this.inventoryListShop.costMultiplier);
        this.pcParty.gold += item.value * this.inventoryListPc.costMultiplier;
        this.loadPc(pc, this.inventoryListPc.cScrollPosition);
        this.mainFrame.reload();
        this.determineValidBuyItemsAndReload();
    }
    
    handleMouseUp() {
        super.handleMouseUp();
        this.inventoryListPc.handleMouseUp();
        this.inventoryListShop.handleMouseUp();
        
        if(this.inventoryDragPc) {
            if(!this.mouseMoved) {
                this.inventoryListPc.select(this.dragItemSlot + this.inventoryListPc.cScrollPosition);
                this.inventoryListPc.reloadItems();
            }
            this.dragIcon.visible = false;
            var pc = this.pcParty.members[this.currentPc];
            var inventoryMouseOverShop = this.inventoryListShop.getMouseOver();
            if(inventoryMouseOverShop >= 0) {
                this.sellItem(this.pcParty.members[this.currentPc], this.dragItemSlot + this.inventoryListPc.cScrollPosition);
            }
        }
        this.inventoryDragPc = false;
        
        if(this.inventoryDragShop) {
            if(!this.mouseMoved) {
                this.inventoryListShop.select(this.dragItemSlot + this.inventoryListShop.cScrollPosition);
                this.inventoryListShop.reloadItems();
            }
            this.dragIcon.visible = false;
            //this.discardSquare.tint = 0xBBBBBB;
            var pc;
            // drag to item list -> purchase
            var inventoryMouseOverPc = this.inventoryListPc.getMouseOver();
            if(inventoryMouseOverPc >= 0) {
                this.buyItem(this.pcParty.members[this.currentPc], this.dragItemSlot + this.inventoryListShop.cScrollPosition);
            }
            // drag to portrait -> purchase
            var portraitMouseOver = mainFrame.getPortraitMouseOver();
            if(portraitMouseOver >= 0) {
                this.buyItem(this.pcParty.members[this.currentPc], this.dragItemSlot + this.inventoryListShop.cScrollPosition);
            }
        }
        this.inventoryDragShop = false;
        
        if(this.inventoryInvalidDragShop) {
            this.dragIcon.visible = false;
        }
        this.inventoryInvalidDragShop = false;
        
        this.updateBoxes();
    }
    
    updateBoxes() {
        if(this.inventoryListPc.isAnySelected()) this.sellBox.setTint(0xFFFFFF);
        else this.sellBox.setTint(0xBBBBBB);
        if(this.inventoryListShop.isAnySelected() && this.getTotalGoldCost() < this.pcParty.gold) this.buyBox.setTint(0xFFFFFF);
        else this.buyBox.setTint(0xBBBBBB);
    }
    
    handleClose() {
        this.inventoryDragPc = false;
        this.inventoryDragShop = false;
        this.window.setVisible(false);
    }
    
    update() {
        super.update();
        this.inventoryListPc.update();
        this.inventoryListShop.update();
        if(this.inventoryDragPc || this.inventoryDragShop) {
            if(!this.dragIcon.visible && this.mouseMoved) {
                this.dragIcon.visible = true;
            }
            this.dragIcon.x = this.game.input.mousePointer.x - this.equipmentStartDragX;
            this.dragIcon.y = this.game.input.mousePointer.y - this.equipmentStartDragY;
            if(this.mousePressX != this.game.input.mousePointer.x || this.mousePressY != this.game.input.mousePointer.y) {this.mouseMoved = true;}
        }
    }
    
    isMouseOver() {
        return super.isMouseOver() || (this.visible && this.mainFrame.getPortraitMouseOver() >= 0);
    }
}

ShopWindow.INVENTORY_LIST_SIZE = 5;
ShopWindow.LIST_BASE_X = 10;
ShopWindow.LIST_BASE_X2 = 270;
ShopWindow.LIST_BASE_Y = 40;