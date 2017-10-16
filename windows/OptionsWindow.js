class OptionsWindow extends Window {
    constructor(game, x, y, party, viewDisplay, mainFrame, miniMap) {
        super(game, x, y, 300, 170);
        this.pcParty = party;
        this.viewDisplay = viewDisplay;
        this.mainFrame = mainFrame;
        this.miniMap = miniMap;
        this.buttons.push(new TextButton(game, x+10, y+30, 112, 20, "save to slot 1", this.saveGame0, this));
        this.buttons.push(new TextButton(game, x+10, y+50, 112, 20, "load slot 1", this.loadGame0, this));
        this.buttons.push(new TextButton(game, x+10, y+75, 112, 20, "save to slot 2", this.saveGame1, this));
        this.buttons.push(new TextButton(game, x+10, y+95, 112, 20, "load slot 2", this.loadGame1, this));
        this.buttons.push(new TextButton(game, x+10, y+120, 112, 20, "save to slot 3", this.saveGame2, this));
        this.buttons.push(new TextButton(game, x+10, y+140, 112, 20, "load slot 3", this.loadGame2, this));
        this.buttons.push(new TextButton(this.game, this.x+this.width-26, this.y+6, 20, 20, "X", this.closeWindow, this));
        
        this.texts.push(game.add.text(x+136, y+40, "empty", Window.TEXT_STYLE));
        this.texts.push(game.add.text(x+136, y+85, "empty", Window.TEXT_STYLE));
        this.texts.push(game.add.text(x+136, y+130, "empty", Window.TEXT_STYLE));
        
        this.reloadScheduled = false;
    }
    
    loadGame0() {this.window.loadGame(0);}
    loadGame1() {this.window.loadGame(1);}
    loadGame2() {this.window.loadGame(2);}
    saveGame0() {this.window.saveGame(0);}
    saveGame1() {this.window.saveGame(1);}
    saveGame2() {this.window.saveGame(2);}
    
    reload() {
        var timeText;
        timeText = localStorage.getItem("time0");
        if(timeText == null) {
            this.buttons[1].active = false;
            this.texts[0].text = "empty";
        }
        else {
            this.buttons[1].active = true;
            this.texts[0].text = timeText;
        }
        
        timeText = localStorage.getItem("time1");
        if(timeText == null) {
            this.buttons[3].active = false;
            this.texts[1].text = "empty";
        }
        else {
            this.buttons[3].active = true;
            this.texts[1].text = timeText;
        }
        
        timeText = localStorage.getItem("time2");
        if(timeText == null) {
            this.buttons[5].active = false;
            this.texts[2].text = "empty";
        }
        else {
            this.buttons[5].active = true;
            this.texts[2].text = timeText;
        }
    }
    
    loadGame(idx) {
        var jsonData = localStorage.getItem("party"+idx);
        var data = JSON.parse(jsonData);
        
        this.pcParty.loadSaveData(data);
        this.reloadScheduled = true;
    }
    
    saveGame(idx) {
        var d = new Date();
        // Americans could swap day and month here
        var min = "";
        if(d.getMinutes() < 10) min = "0";
        localStorage.setItem("time"+idx, d.getDate()+"/"+d.getMonth()+"/"+(d.getFullYear())+", "+d.getHours()+":"+min+d.getMinutes());
        this.reload();
        
        localStorage.setItem("party"+idx, JSON.stringify(this.pcParty.getSaveData()));
    }
    
    closeWindow() {
        this.window.setVisible(false);
    }
}