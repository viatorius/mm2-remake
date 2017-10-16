class PortalEvent extends MapEvent {
    constructor(map, x, y, recurring, farAppearance, nearAppearance, message, newMapString, newX, newY, newDir) {
        super(map, x, y, recurring, farAppearance, nearAppearance, [message], "portal");
        this.newMapString = newMapString;
        this.newMap = null;
        this.newX = newX;
        this.newY = newY;
        this.newDir = newDir;
    }
    
    processEvent(map, eventWindow) {
        this.map.pcParty.setMap(this.newMap);
        this.map.pcParty.x = this.newX;
        this.map.pcParty.y = this.newY;
        this.map.pcParty.dir = this.newDir;
        eventWindow.viewDisplay.map = this.newMap;
        eventWindow.miniMap.map = this.newMap;
        eventWindow.setVisible(false);
        super.processEvent(map, eventWindow);
    }
}
