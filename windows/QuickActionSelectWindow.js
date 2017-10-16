class QuickActionSelectWindow extends Window {
    constructor(game, x, y) {
        super(game, x, y, 300, 180);
        this.pc;
        this.actions;
        
        this.mouseMoved;
        this.mousePressX;
        this.mousePressY;
        
        this.create();
    }
    
    create() {
        this.buttons.push(new TextButton(this.game, this.x+274, this.y+6, 20, 20, "X", this.closeWindow, this));
        this.actionList = new ActionList(this.x+10, this.y+10, this, this.game, 5);
        this.texts.push(this.game.add.text(this.x+10, this.y+152, "current", Window.TEXT_STYLE));
        
        this.selectBox = new TextBox(this.game, this.x+222, this.y+152, 62, 20, "Select", 4);
    }
        
    closeWindow() {
        this.window.setVisible(false);
    }
    
    loadPc(pc) {
        this.pc = pc;
        this.actions = [];
        
        this.actions.push("strike");
        this.actions.push("thrust");
        if(this.pc.equipItems[2] != null) this.actions.push("shoot");
        this.actions.push("block");
        for(var i=0;i<this.pc.spells.length;i++) {
            var spell = this.pc.spells[i];
            //if(spell.targetType == Spell.COMBAT) {
                this.actions.push(spell);
            //}
        }
        
        this.actionList.loadPcAndActions(this.pc, this.actions);
        this.actionList.reloadItems();
        
        var action = this.pc.quickAction;
        if(this.pc.quickAction == "") {
            this.texts[0].text = "no q. action set";
        } else {
            if(action == "strike" || action == "thrust" || action == "shoot" || action == "block") {
                this.texts[0].text = ""+action;
            } else {
                this.texts[0].text = action.typeString;
            }
        }
    }
        
    setVisible(vis) {
        super.setVisible(vis);
        this.actionList.setVisible(vis);
        this.selectBox.setVisible(vis);
    }
        
    handleMouseDown() {
        super.handleMouseDown();
        this.actionList.handleMouseDown();
        this.mouseMoved = false;
        this.mousePressX = this.game.input.mousePointer.x;
        this.mousePressY = this.game.input.mousePointer.y;
        
        if(this.selectBox.isMouseOver() && this.actionList.isAnySelected()) {
            var selectActionIdx = this.actionList.getFirstSelectedIdx();
            //console.log(selectActionIdx);
            this.pc.quickAction = this.actions[selectActionIdx];
            this.setVisible(false);
        }
                
        if(this.actionList.visible && !this.actionList.isMouseOverAny()) {
            this.actionList.reloadSelectedItems();
            this.actionList.reloadItems();
        }
    }
    
    handleMouseUp() {
        super.handleMouseUp();
        this.actionList.handleMouseUp();
        
        var mouseOver = this.actionList.getMouseOver();
        if(!this.mouseMoved && mouseOver >= 0) {
            this.actionList.selectOnly(mouseOver + this.actionList.cScrollPosition);
            this.actionList.reloadItems();
        }
        
        if(this.actionList.isAnySelected()) {
            this.selectBox.setTint(0xFFFFFF);
            
        } else this.selectBox.setTint(0xBBBBBB);
    }
    
    update() {
        super.update();
        this.actionList.update();
    }
}