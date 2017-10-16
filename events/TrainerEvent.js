class TrainerEvent extends MapEvent {
    constructor(map, x, y, recurring, farAppearance, nearAppearance, message, trainerTypeString) {
        super(map, x, y, recurring, farAppearance, nearAppearance, [message], "trainer");
        this.trainerWindow = null;
        this.trainerTypeString = trainerTypeString;
        this.trainerType = -1;
        for(var i=0; i< ClassData.DATA.length; i++) {
            if(this.trainerTypeString == ClassData.DATA[i][0]) {
                this.trainerType = i;
            }
        }
        if(this.trainerType == -1) console.log("Error, incorrect PC class name given: "+trainerTypeString);
    }
    
    processEvent(map, eventWindow) {
        eventWindow.setVisible(false);
        this.trainerWindow.setVisible(true);
        this.trainerWindow.loadTrainer(this, map.pcParty);
        super.processEvent(map, eventWindow);
    }
    
    satisfiesReqs(pc) {
        return pc.getClassLevel(this.trainerType) < ClassData.DATA[this.trainerType][1];
    }
}