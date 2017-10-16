class TempleEvent extends MapEvent {
    constructor(map, x, y, recurring, farAppearance, nearAppearance, message, templeCost) {
        super(map, x, y, recurring, farAppearance, nearAppearance, [message], "temple");
        this.templeWindow = null;
        this.templeCost = templeCost;
    }
    
    processEvent(map, eventWindow) {
        eventWindow.setVisible(false);
        this.templeWindow.setVisible(true);
        this.templeWindow.load(this, map.pcParty);
        super.processEvent(map, eventWindow);
    }
}