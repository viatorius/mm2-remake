class MapEvent{
    constructor(map, x, y, recurring, farAppearance, nearAppearance, messages, type) {
        this.map = map;
        this.x = x;
        this.y = y;
        this.recurring = recurring;
        this.farAppearance = farAppearance;
        this.nearAppearance = nearAppearance;
        this.messages = messages;
        this.type = type;
    }
    
    processEvent(map, eventWindow) {
        if(!this.recurring) {
            var idx = map.events.indexOf(this);
            map.events.splice(idx, 1);
        }
        map.updateEventGrid();
        eventWindow.viewDisplay.updateView();
        eventWindow.miniMap.updateMinimap();
        eventWindow.mainFrame.reload();
    }
}

