class EventWindow extends Window {
    constructor(game, x, y) {
        super(game, x, y, 200, 100);
        this.texts.push(game.add.text(x+8, y+8, "message", Window.TEXT_STYLE));
        this.buttons.push(new TextButton(game, x+40, y+72, 36, 20, "Yes", this.handleProcess, this));
        this.buttons.push(new TextButton(game, x+132, y+72, 28, 20, "No", this.handleClose, this));
        this.event;
        this.map;
        this.viewDisplay;
        this.miniMap;
        this.mainFrame;
    }
    
    loadEvent(event, map, viewDisplay, miniMap, mainFrame) {
        this.buttons[0].setVisible(true);
        this.buttons[1].setVisible(true);
        this.buttons[1].textField.text = "No";
        this.event = event;
        this.map = map;
        this.viewDisplay = viewDisplay;
        this.mainFrame = mainFrame;
        this.miniMap = miniMap;
        this.texts[0].text = event.messages[0];
    }
    
    loadMessage(message) {
        this.buttons[0].setVisible(false);
        this.buttons[1].setVisible(true);
        this.buttons[1].textField.text = "Ok";
        this.texts[0].text = message;
    }
    
    handleProcess() {
        this.window.event.processEvent(this.window.map, this.window);
    }
    
    handleClose() {
        this.window.setVisible(false);
    }
}