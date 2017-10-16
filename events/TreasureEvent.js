class TreasureEvent extends MapEvent {
    constructor(map, x, y, recurring, farAppearance, nearAppearance, message1, message2, gold) {
        super(map, x, y, recurring, farAppearance, nearAppearance, [message1, message2], "treasure");
        this.gold = gold;
    }
    
    processEvent(map, eventWindow) {
        map.pcParty.gold += this.gold;
        eventWindow.loadMessage(this.messages[1]);
        super.processEvent(map, eventWindow);
    }
}