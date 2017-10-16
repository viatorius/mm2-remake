class MainFrameWindow extends Window {
    constructor(game, x, y, party, mainFrame, viewDisplay) {
        super(game, x, y, 140, 54);
        this.pcParty = party;
        this.mainFrame = mainFrame;
        this.viewDisplay = viewDisplay;
        this.restCount = 0;
        this.buttons.push(new TextButton(game, x+8, y+6, 54, 20, "Shoot", this.shoot, this));
        this.buttons.push(new TextButton(game, x+68, y+6, 44, 20, "Rest", this.rest, this));
        this.buttons.push(new TextButton(game, x+8, y+28, 44, 20, "Map", this.showMap, this));
        this.buttons.push(new TextButton(game, x+58, y+28, 66, 20, "Options", this.options, this));
        
        this.buttons[0].active = false;
        
        this.optionsWindow;
        this.mapWindow;
    }
    
    setOptionsWindow(optionsWindow) {
        this.optionsWindow = optionsWindow;
    }
    
    setMapWindow(mapWindow) {
        this.mapWindow = mapWindow;
    }
    
    rest() {
        this.window.restCount = Map.NUM_REST_STEPS;
    }
    
    shoot() {
        
    }
    
    showMap() {
        this.window.mapWindow.setVisible(true);
        this.window.mapWindow.loadMap(this.window.pcParty.cMap);
    }
    
    options() {
        this.window.optionsWindow.setVisible(true);
        this.window.optionsWindow.reload();
    }
    
    reload() {
        
    }
}