class MainFrame {
    constructor(game, pcParty) {
        this.game = game;
        this.pcParty = pcParty;
        this.portraits = new Array(MainFrame.pcParty_SIZE);
        this.portraitEdges = new Array(MainFrame.pcParty_SIZE);
        this.hpBars;
        this.staBars;
        this.statusIcons;
        
        this.mainFrameWindow;
        this.encounterWindow;
        this.pcInfoWindow;
        
        this.combatRowArrows;
        this.activePortrait;
        
        this.goldText;
        this.foodText;
        this.timeText;
        
        this.create();
        this.reload();
        
        this.topRect;
        this.leftRect;
        this.bottomRect;
        this.rightRect;
        this.displayEdge;
    }
    
    create() {
        
        //rectangles:        
        this.topRect = this.game.add.graphics(0, 0);
        this.topRect.lineStyle(0, 0x000000, 1);
        this.topRect.beginFill(WindowFrame.LIGHT_COLOUR);
        this.topRect.drawRect(-1, -1, MainFrame.GAME_WIDTH+2, MainFrame.DISPLAY_BY+2);
        this.topRect.endFill();
        
        this.leftRect = this.game.add.graphics(0, 0);
        this.leftRect.lineStyle(0, 0x000000, 1);
        this.leftRect.beginFill(WindowFrame.LIGHT_COLOUR);
        this.leftRect.drawRect(-1, -1, MainFrame.DISPLAY_BX+2, MainFrame.GAME_HEIGHT+2);
        this.leftRect.endFill();
        
        this.bottomRect = this.game.add.graphics(0, MainFrame.DISPLAY_HEIGHT+MainFrame.DISPLAY_BY);
        this.bottomRect.lineStyle(0, 0x000000, 1);
        this.bottomRect.beginFill(WindowFrame.LIGHT_COLOUR);
        this.bottomRect.drawRect(-1, -1, MainFrame.GAME_WIDTH+2, MainFrame.GAME_HEIGHT-MainFrame.DISPLAY_HEIGHT+2);
        this.bottomRect.endFill();
        
        this.rightRect = this.game.add.graphics(MainFrame.DISPLAY_BX+MainFrame.DISPLAY_WIDTH, 0);
        this.rightRect.lineStyle(0, 0x000000, 1);
        this.rightRect.beginFill(WindowFrame.LIGHT_COLOUR);
        this.rightRect.drawRect(-1, -1, MainFrame.GAME_WIDTH - MainFrame.DISPLAY_BX + 2, MainFrame.GAME_HEIGHT+2);
        this.rightRect.endFill();
        
        this.displayEdge = this.game.add.graphics(MainFrame.DISPLAY_BX, MainFrame.DISPLAY_BY);
        this.displayEdge.lineStyle(4, 0x000000, 1);
        this.displayEdge.drawRect(0, 0, MainFrame.DISPLAY_WIDTH, MainFrame.DISPLAY_HEIGHT);
        
        // portraits:
        for(var i=0;i<Party.PC_PARTY_SIZE;i++) {
            this.portraits[i] = this.game.add.sprite(MainFrame.PORTRAITS_BX + i * MainFrame.PORTRAITS_DX, MainFrame.PORTRAITS_BY, 'portrait');
            this.portraits[i].frame = i;
            this.portraits[i].scale.setTo(1.6,1.6);
            this.portraitEdges[i] = this.game.add.graphics(this.portraits[i].x-1, this.portraits[i].y-1);
            this.portraitEdges[i].lineStyle(4, 0x000000, 1);
            this.portraitEdges[i].drawRect(0, 0, this.portraits[i].width, this.portraits[i].height);
        }
        this.hpBars = new Array(MainFrame.pcParty_SIZE);
        for(var i=0;i<Party.PC_PARTY_SIZE;i++) {
            this.hpBars[i] = new HpBar(this.game, MainFrame.PORTRAITS_BX + i * MainFrame.PORTRAITS_DX + 67, MainFrame.PORTRAITS_BY, this.pcParty.members[i]);  
        }
        this.staBars = new Array(MainFrame.pcParty_SIZE);
        for(var i=0;i<Party.PC_PARTY_SIZE;i++) {
            this.staBars[i] = new StaBar(this.game, MainFrame.PORTRAITS_BX + i * MainFrame.PORTRAITS_DX + 67, MainFrame.PORTRAITS_BY+44, this.pcParty.members[i]);  
        }
        this.statusIcons = new Array(MainFrame.pcParty_SIZE);
        for(var i=0;i<Party.PC_PARTY_SIZE;i++) {
            this.statusIcons[i] = [];
        }
        
        this.combatRowArrows = new Array(MainFrame.pcParty_SIZE);
        for(var i=0;i<Party.PC_PARTY_SIZE;i++) {
            this.combatRowArrows[i] = this.game.add.sprite(MainFrame.PORTRAITS_BX + i * MainFrame.PORTRAITS_DX + 40, MainFrame.PORTRAITS_BY-3, 'minimapArrow'); 
        }
        
        this.goldText = this.game.add.text(440, 175, "AAAAA", Window.TEXT_STYLE);
        this.foodText = this.game.add.text(440, 195, "AAAAA", Window.TEXT_STYLE);
        this.timeText = this.game.add.text(440, 215, "AAAAA", Window.TEXT_STYLE);
    }
    
    getPortraitMouseOver() {
        for(var i=0;i<Party.PC_PARTY_SIZE;i++) {
            if(this.game.input.mousePointer.x >= this.portraits[i].x &&
                this.game.input.mousePointer.x < this.portraits[i].x + this.portraits[i].width &&
                this.game.input.mousePointer.y >= this.portraits[i].y &&
                this.game.input.mousePointer.y < this.portraits[i].y + this.portraits[i].height) return i;
        }
        return -1;
    }
    
    getCombatRowArrowMouseOver() {
        for(var i=0;i<Party.PC_PARTY_SIZE;i++) {
            if(this.game.input.mousePointer.x >= this.combatRowArrows[i].x &&
                this.game.input.mousePointer.x < this.combatRowArrows[i].x + this.combatRowArrows[i].width &&
                this.game.input.mousePointer.y >= this.combatRowArrows[i].y &&
                this.game.input.mousePointer.y < this.combatRowArrows[i].y + this.combatRowArrows[i].height) return i;
        }
        return -1;
    }
    
    getTime(time) {
        var mins = time%60;
        var hours = ((time - mins)/60)%24;
        var days = (time - mins - 60*hours)/(60*24) + 1;
        var hourString = ""+hours;
        var ampm = "AM";
        var minString = "0"+mins;
        if(mins >= 10) minString = ""+mins;
        if(hours == 0) {
            hourString = "12";
        }
        if(hours >= 12) {
            ampm = "PM"; 
            hourString = ""+(hours-12);
            if(hours == 12) hourString = 12;
        }
        return "day "+days+", "+hourString+":"+minString+""+ampm;
    }
    
    reload() {
        for(var i=0;i<Party.PC_PARTY_SIZE;i++) {
            this.hpBars[i].reload();
            this.staBars[i].reload();
            if(this.pcParty.members[i].frontRow) {
                this.combatRowArrows[i].frame = 0;
                this.combatRowArrows[i].tint = 0x88FF88;
            } else {
                this.combatRowArrows[i].frame = 1;
                this.combatRowArrows[i].tint = 0xEE8800;
            }
            for(var j=this.statusIcons[i].length-1;j>=0;j--) {
                this.statusIcons[i][j].destroy();
                this.statusIcons[i].splice(j, 1);
            }
            for(var j=0;j<this.pcParty.members[i].status.length;j++) {
                this.statusIcons[i].push(this.game.add.sprite(MainFrame.PORTRAITS_BX + 8*j + i * MainFrame.PORTRAITS_DX, MainFrame.PORTRAITS_BY+this.portraits[0].height, 'statusIcon'));
                this.statusIcons[i][j].y -= this.statusIcons[i][j].height;
                this.statusIcons[i][j].frame = StatusData.getStatusIndex(this.pcParty.members[i].status[j][0]);
            }
        }
        this.goldText.text = "gold: "+this.pcParty.gold;
        this.foodText.text = "food: "+this.pcParty.food;
        this.timeText.text = ""+this.getTime(this.pcParty.minutesSpent);
        
        if(this.mainFrameWindow != null) this.mainFrameWindow.reload();
        this.setActivePortrait(this.activePortrait);
    }
    
    setMainFrameWindow(mainFrameWindow) {
        this.mainFrameWindow = mainFrameWindow;
    }
    
    setEncounterWindow(encounterWindow) {
        this.encounterWindow = encounterWindow;
    }
    
    setPcInfoWindow(pcInfoWindow) {
        this.pcInfoWindow = pcInfoWindow;
    }
    
    setActivePortrait(pc) {
        this.activePortrait = null;
        for(var i=0;i<Party.PC_PARTY_SIZE;i++) {
            if(pc != this.pcParty.members[i]) {
                if(this.pcParty.members[i].isActive()) this.portraits[i].tint = 0xFFFFFF;
                else this.portraits[i].tint = 0xFF6666;
            }
            else {
                this.activePortrait = pc;
                this.portraits[i].tint = 0xFFFF66;
            }
        }
    }
    
    handleMouseDown() {
        var inEcounter = this.encounterWindow.visible;
        var combatRowArrowMouseOver = this.getCombatRowArrowMouseOver();
        if(combatRowArrowMouseOver > -1 && !inEcounter) {
            this.pcParty.members[combatRowArrowMouseOver].frontRow = !this.pcParty.members[combatRowArrowMouseOver].frontRow;
            this.reload();
        } else {
            var portraitMouseOver = this.getPortraitMouseOver();
            if(portraitMouseOver > -1) {
                this.pcInfoWindow.setVisible(true);
                if(this.pcInfoWindow.cSubWindow == 0) this.pcInfoWindow.loadPcOverview(this.pcParty.members[portraitMouseOver]);
                else if(this.pcInfoWindow.cSubWindow == 1) this.pcInfoWindow.loadPcInventory(this.pcParty.members[portraitMouseOver]);
                else this.pcInfoWindow.loadPcSpells(this.pcParty.members[portraitMouseOver]);
            }
        }
    }
    
    handleMouseUp() {}
    
    isMouseOver() {return this.getPortraitMouseOver() > -1}
    
    update() {}
}
            
MainFrame.PORTRAITS_BX = 20;
MainFrame.PORTRAITS_DX = 98;
MainFrame.PORTRAITS_BY = 309;

MainFrame.GAME_WIDTH  = 600;
MainFrame.GAME_HEIGHT = 400;
MainFrame.DISPLAY_BX = 20;
MainFrame.DISPLAY_BY = 20;
MainFrame.DISPLAY_WIDTH  = 400;
MainFrame.DISPLAY_HEIGHT = 250;