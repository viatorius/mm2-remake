class TrainerWindow extends Window {
    constructor(game, x, y, mainFrame) {
        super(game, x, y, ClassListItem.WIDTH+80, 245);
        this.event;
        this.pcParty;
        this.currentPc;
        this.classListItems;
        this.create();
        this.mainFrame = mainFrame;
    }
    
    create() {
        this.texts.push(this.game.add.text(this.x+8, this.y+8, "char name", Window.TEXT_STYLE));
        this.texts.push(this.game.add.text(this.x+172, this.y+8, "money text", Window.TEXT_STYLE));
        this.texts.push(this.game.add.text(this.x+8, this.y+30, "class text", Window.TEXT_STYLE));
        this.texts.push(this.game.add.text(this.x+280, this.y+30, "req:", Window.TEXT_STYLE));
        this.buttons.push(new TextButton(this.game, this.x+ClassListItem.WIDTH+20, this.y+82+0*ClassListItem.HEIGHT, 52, 20, "Train", this.levelUp, this));
        this.buttons.push(new TextButton(this.game, this.x+ClassListItem.WIDTH+20, this.y+82+1*ClassListItem.HEIGHT, 52, 20, "Train", this.levelUp, this));
        this.buttons.push(new TextButton(this.game, this.x+ClassListItem.WIDTH+20, this.y+82+2*ClassListItem.HEIGHT, 52, 20, "Train", this.levelUp, this));
        this.buttons.push(new TextButton(this.game, this.x+ClassListItem.WIDTH+20, this.y+217, 52, 20, "Leave", this.handleClose, this));
        this.classListItems = new Array(Pc.MAX_CLASS_LEVELS_PER_CLASS );
        for(var i=0;i<Pc.MAX_CLASS_LEVELS_PER_CLASS ;i++) {
            this.classListItems[i] = new ClassListItem(this.x+8, this.y+55+i*ClassListItem.HEIGHT, null, this.game);
        }
    }
    
    levelUp() {
        var pc = this.window.pcParty.members[this.window.currentPc];
        for(var i=0; i<pc.classLevels.length; i++) {
            if(pc.classLevels[i] == 0) {
                pc.classLevels[i] = this.window.event.trainerType;
                this.window.loadPc(pc);
                return;
            }
        }
    }
    
    loadTrainer(event, pcParty) {
        this.event = event;
        this.pcParty = pcParty;
        this.currentPc = 0;
        this.loadPc(pcParty.members[this.currentPc]);
        for(var i=0;i<Pc.MAX_CLASS_LEVELS_PER_CLASS ;i++) {
            this.classListItems[i].loadClass(this.event.trainerType, i);
        }
    }
    
    loadPc(pc) {
        this.texts[0].text = pc.name;
        this.texts[1].text = "your gold: "+this.pcParty.gold;
        this.texts[2].text = "class type: "+this.event.trainerTypeString;
        if(pc.getClassLevel(this.event.trainerType) == 0 && pc.canLevelUp() && this.event.satisfiesReqs(pc)) {
            this.buttons[0].active = true;
        } else{
            this.buttons[0].active = false;
        }
        if(pc.getClassLevel(this.event.trainerType) == 1 && pc.canLevelUp() && this.event.satisfiesReqs(pc)) {
            this.buttons[1].active = true;
        } else {
            this.buttons[1].active = false;
        }
        if(pc.getClassLevel(this.event.trainerType) == 2 && pc.canLevelUp() && this.event.satisfiesReqs(pc)) {
            this.buttons[2].active = true;
        } else {
            this.buttons[2].active = false;
        }
    }
    
    handleMouseDown() {
        super.handleMouseDown();
        if(!super.isMouseOver()) {
            var portraitMouseOver = this.mainFrame.getPortraitMouseOver();
            if(portraitMouseOver >= 0) {
                this.currentPc = portraitMouseOver;
                this.loadPc(this.pcParty.members[this.currentPc]);
            }
        }
    }
    
    setVisible(vis) {
        super.setVisible(vis);
        for(var i=0;i<this.classListItems.length;i++) {
            this.classListItems[i].setVisible(vis);
        }
    }
    
    handleClose() {
        this.window.setVisible(false);
    }
    
    isMouseOver() {
        return super.isMouseOver() || (this.visible && this.mainFrame.getPortraitMouseOver() >= 0);
    }
}