class TempleWindow extends Window {
    constructor(game, x, y) {
        super(game, x, y, 300, 150);
        this.event;
        this.pcParty;
        this.currentPc;
        this.create();
    }
    
    create() {
        this.texts.push(this.game.add.text(this.x+8, this.y+8, "char name", Window.TEXT_STYLE));
        this.texts.push(this.game.add.text(this.x+172, this.y+8, "money text", Window.TEXT_STYLE));
        this.buttons.push(new TextButton(this.game, this.x+this.width-62, this.y+this.height-28, 52, 20, "Leave", this.handleClose, this));
    }
    
    load(event, pcParty) {
        this.event = event;
        this.pcParty = pcParty;
        this.currentPc = 0;
        this.loadPc(pcParty.members[this.currentPc]);
    }
    
    loadPc(pc) {
        this.texts[0].text = pc.name;
        this.texts[1].text = "your gold: "+this.pcParty.gold;
        /*if(pc.getClassLevel(this.event.trainerType) == 0 && pc.canLevelUp() && this.event.satisfiesReqs(pc)) {
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
        }*/
    }
    
    handleClose() {
        this.window.setVisible(false);
    }
}