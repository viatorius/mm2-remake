class InnEvent extends MapEvent {
    constructor(map, x, y, recurring, farAppearance, nearAppearance, message, pcList) {
        super(map, x, y, recurring, farAppearance, nearAppearance, [message], "inn");
        this.innWindow = null;
        this.pcList = pcList;
    }
    
    processEvent(map, eventWindow) {
        eventWindow.setVisible(false);
        this.innWindow.setVisible(true);
        this.innWindow.load(this, map.pcParty);
        super.processEvent(map, eventWindow);
    }
}