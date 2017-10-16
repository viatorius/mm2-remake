class EncounterWindow extends Window {
    constructor(game, x, y, mainFrame, viewDisplay) {
        super(game, x, y, 205, 285);
        this.encounter = null;
        this.map;
        this.mainFrame = mainFrame;
        this.viewDisplay = viewDisplay;
        
        this.monsters = new Array(Map.MAX_MONSTERS_PER_SQUARE);
        this.initiativeQueue = [];
        
        //this.buttons.push(new TextButton(game, x+369, y+10, 20, 20, "X", this.closeWindow, this));
        
        for(var i=0;i<Map.MAX_MONSTERS_PER_SQUARE; i++) {
            this.texts.push(game.add.text(x+8, y+6+20*i, "---", Window.TEXT_STYLE));
            this.texts.push(game.add.text(x+98, y+6+20*i, "---", Window.TEXT_STYLE));
        }
        
        this.buttons.push(new TextButton(game, x+10, y+26+24*0+20*Map.MAX_MONSTERS_PER_SQUARE, 60, 20, "q. act.", this.qAction, this));
        this.buttons.push(new TextButton(game, x+10, y+26+24+1*20*Map.MAX_MONSTERS_PER_SQUARE, 60, 20, "strike", this.strike, this));
        this.buttons.push(new TextButton(game, x+10, y+26+24*2+20*Map.MAX_MONSTERS_PER_SQUARE, 60, 20, "thrust", this.thrust, this));
        this.buttons.push(new TextButton(game, x+10, y+26+24*3+20*Map.MAX_MONSTERS_PER_SQUARE, 60, 20, "shoot", this.shoot, this));
        this.buttons.push(new TextButton(game, x+10, y+26+24*4+20*Map.MAX_MONSTERS_PER_SQUARE, 60, 20, "cast", this.closeWindow, this));
        this.buttons.push(new TextButton(game, x+10, y+26+24*5+20*Map.MAX_MONSTERS_PER_SQUARE, 60, 20, "block", this.block, this));
        this.buttons.push(new TextButton(game, x+10, y+26+24*6+20*Map.MAX_MONSTERS_PER_SQUARE, 60, 20, "switch", this.switch, this));
        
        this.texts.push(game.add.text(x+80, y+26+20*Map.MAX_MONSTERS_PER_SQUARE, "", Window.TEXT_STYLE));
        this.texts.push(game.add.text(x+80, y+26+24*1+20*Map.MAX_MONSTERS_PER_SQUARE, "", Window.TEXT_STYLE));
        this.texts.push(game.add.text(x+80, y+26+24*2+20*Map.MAX_MONSTERS_PER_SQUARE, "", Window.TEXT_STYLE));
        this.texts.push(game.add.text(x+80, y+26+24*3+20*Map.MAX_MONSTERS_PER_SQUARE, "", Window.TEXT_STYLE));
    }
    
    qAction() {
        var action = this.window.encounter.initiativeQueue[0].quickAction;
        if(action == "strike") this.window.encounter.processTurn("strike");
        if(action == "thrust") this.window.encounter.processTurn("thrust");
        if(action == "shoot") this.window.encounter.processTurn("shoot");
        if(action == "block") this.window.encounter.processTurn("block");
        else {
            if(action.targetType == Spell.COMBAT) {
                this.window.encounter.processTurn(action);
            }
        }
    }
    
    strike() {
        this.window.encounter.processTurn("strike");
    }
    
    thrust() {
        this.window.encounter.processTurn("thrust");
    }
    
    shoot() {
        this.window.encounter.processTurn("shoot");
    }
    
    block() {
        this.window.encounter.processTurn("block");
    }
    
    switch() {
        this.window.encounter.processTurn("switch");
    }
    
    loadEncounter(map) {
        this.encounter = new Encounter(map, this, this.mainFrame, this.viewDisplay);
        this.reload();
        this.encounter.processTurn();
    }
    
    reload() {
        for(var i=0;i<Map.MAX_MONSTERS_PER_SQUARE; i++) {
            if(i >= this.encounter.monsters.length) {
                this.texts[2*i].text = "";
                this.texts[2*i+1].text = "";
            } else {
                if(i == this.encounter.cTarget) this.texts[2*i].text = "> "+this.encounter.monsters[i].name;
                else this.texts[2*i].text = "  "+this.encounter.monsters[i].name;
                this.texts[2*i+1].text = this.encounter.monsters[i].curHp+"/"+this.encounter.monsters[i].maxHp + ", " + this.encounter.monsters[i].curSta+"/"+this.encounter.monsters[i].maxSta;
            }
        }
        
        var cChar = this.encounter.initiativeQueue[0];
        
        if((cChar.type == "monster")) { //this can happen for a single frame
            for(var i=0;i<this.buttons[1].length;i++) {
                this.buttons[i].acive = false;
            }
        } else {
            // quick action
            var action = cChar.quickAction;
            if(cChar.quickAction == "" || cChar.quickAction == null) {
                this.buttons[0].active = false;
                this.texts[Map.MAX_MONSTERS_PER_SQUARE*2].text = "no q. action set";
            } else {
                this.buttons[0].active = true;
                if(action == "strike" || action == "thrust" || action == "shoot" || action == "block") {
                    this.texts[Map.MAX_MONSTERS_PER_SQUARE*2].text = cChar.quickAction;
                } else {
                    this.texts[Map.MAX_MONSTERS_PER_SQUARE*2].text = cChar.quickAction.typeString;
                }
                if(action == "strike" && !cChar.canStrike()) this.buttons[0].active = false;
                if(action == "thrust" && !cChar.canThrust()) this.buttons[0].active = false;
                if(action == "shoot" && !cChar.canShoot()) this.buttons[0].active = false;
                else if(!(action == "strike" || action == "thrust" || action == "shoot" || action == "block")) {
                    if(action.getCastCost(cChar) >= cChar.curSta) this.buttons[0].active = false;
                }
            }

            // strike
            var plus = "";
            if(cChar.strikeAttackBonus >= 0) plus = "+";
            this.texts[Map.MAX_MONSTERS_PER_SQUARE*2+1].text = "("+plus+cChar.strikeAttackBonus+")  "+cChar.strikeDieNumber+"d"+cChar.strikeDieType+"+"+cChar.strikeDamageBonus;
            if(cChar.canStrike()) this.buttons[1].active = true;
            else this.buttons[1].active = false;

            // thrust
            plus = "";
            if(cChar.thrustAttackBonus >= 0) plus = "+";
            this.texts[Map.MAX_MONSTERS_PER_SQUARE*2+2].text = "("+plus+cChar.thrustAttackBonus+")  "+cChar.thrustDieNumber+"d"+cChar.thrustDieType+"+"+cChar.thrustDamageBonus;
            if(cChar.canThrust()) this.buttons[2].active = true;
            else this.buttons[2].active = false;

            // shoot
            plus = "";
            if(cChar.shootAttackBonus >= 0) plus = "+";
            this.texts[Map.MAX_MONSTERS_PER_SQUARE*2+3].text = "("+plus+cChar.shootAttackBonus+")  "+cChar.shootDieNumber+"d"+cChar.shootDieType+"+"+cChar.shootDamageBonus;
            if(cChar.canShoot()) this.buttons[3].active = true;
            else this.buttons[3].active = false;

            if(cChar.spells.length > 0) this.buttons[4].active = true;
            else this.buttons[4].active = false;
        }
    }
    
    handleMouseDown() {
        super.handleMouseDown();
        var monsterSelect = -1;
        for(var i=0;i<Map.MAX_MONSTERS_PER_SQUARE;i++) {
            if(this.game.input.mousePointer.x >= this.texts[2*i].x &&
                this.game.input.mousePointer.x < this.texts[2*i+1].x + this.texts[2*i+1].width &&
                this.game.input.mousePointer.y >= this.texts[2*i].y &&
                this.game.input.mousePointer.y < this.texts[2*i].y + this.texts[2*i].height) monsterSelect = i;
        }
        if(monsterSelect >= 0) {
            this.encounter.cTarget = monsterSelect;
            this.reload();
        }
        //console.log(monsterSelect);
    }
}