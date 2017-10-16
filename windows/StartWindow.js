class StartWindow extends Window {
    constructor(game, x, y, party) {
        var blackScreen = game.add.graphics(0, 0);
        blackScreen.lineStyle(0, 0x000000, 1);
        blackScreen.beginFill(0x000000);
        blackScreen.drawRect(0, 0, MainFrame.GAME_WIDTH, MainFrame.GAME_HEIGHT);
        blackScreen.endFill();
        super(game, x, y, 254, 115);
        
        this.pcParty = party;
        
        this.blackScreen = blackScreen;
        
        this.buttons.push(new TextButton(game, x+84, y+15, 86, 20, "New game", this.newGame, this));
        this.buttons.push(new TextButton(game, x+80, y+55, 94, 20, "Load game", this.loadGameMenu, this));
        
        this.buttons.push(new TextButton(game, x+10, y+10, 92, 20, "load slot 1", this.loadGame0, this));
        this.buttons.push(new TextButton(game, x+10, y+35, 92, 20, "load slot 2", this.loadGame1, this));
        this.buttons.push(new TextButton(game, x+10, y+60, 92, 20, "load slot 3", this.loadGame2, this));
        
        this.buttons.push(new TextButton(game, x+this.width-55, y+85, 46, 20, "Back", this.goBack, this));
        
        this.texts.push(game.add.text(x+110, y+10, "empty", Window.TEXT_STYLE));
        this.texts.push(game.add.text(x+110, y+35, "empty", Window.TEXT_STYLE));
        this.texts.push(game.add.text(x+110, y+60, "empty", Window.TEXT_STYLE));
        
        this.mainMenu();
    }
    
    newGame() {
        this.window.setVisible(false);
    }
    
    goBack() {
        this.window.mainMenu();
    }
    
    mainMenu() {
        this.buttons[0].setVisible(true);
        this.buttons[1].setVisible(true);
        this.buttons[2].setVisible(false);
        this.buttons[3].setVisible(false);
        this.buttons[4].setVisible(false);
        this.buttons[5].setVisible(false);
        
        this.texts[0].visible = false;
        this.texts[1].visible = false;
        this.texts[2].visible = false;
    }
    
    loadGameMenu() {
        this.window.buttons[0].setVisible(false);
        this.window.buttons[1].setVisible(false);
        this.window.buttons[2].setVisible(true);
        this.window.buttons[3].setVisible(true);
        this.window.buttons[4].setVisible(true);
        this.window.buttons[5].setVisible(true);
        
        this.window.texts[0].visible = true;
        this.window.texts[1].visible = true;
        this.window.texts[2].visible = true;
        
        var timeText;
        timeText = localStorage.getItem("time0");
        if(timeText == null) {
            this.window.texts[0].text = "empty";
            this.window.buttons[2].active = false;
        }
        else this.window.texts[0].text = timeText;
        
        timeText = localStorage.getItem("time1");
        if(timeText == null) {
            this.window.texts[1].text = "empty";
            this.window.buttons[3].active = false;
        }
        else this.window.texts[1].text = timeText;
        
        timeText = localStorage.getItem("time2");
        if(timeText == null) {
            this.window.texts[2].text = "empty";
            this.window.buttons[4].active = false;
        }
        else this.window.texts[2].text = timeText;
    }
    
    loadGame0() {this.window.loadGame(0);}
    loadGame1() {this.window.loadGame(1);}
    loadGame2() {this.window.loadGame(2);}
    
    loadGame(idx) {
        var jsonData = localStorage.getItem("party"+idx);
        var data = JSON.parse(jsonData);
        
        this.pcParty.loadSaveData(data);
        this.reloadScheduled = true;
        this.setVisible(false);
    }
    
    isMouseOver() {
        return this.visible;
    }
    
    setVisible(vis) {
        super.setVisible(vis);
        this.blackScreen.visible = vis;
    }
}