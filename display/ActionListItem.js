class ActionListItem extends GenericListItem {
    constructor(x, y, list, game) {
        super(x, y, list, game, SpellListItem.WIDTH_SMALL, SpellListItem.HEIGHT);
        this.action;
    }
    
    create() {
        super.create();
        this.texts[0] = this.game.add.text(this.x, this.y + (InventoryListItem.HEIGHT - Window.TEXT_SIZE)/2, "name", Window.TEXT_STYLE);
        this.texts[1] = this.game.add.text(this.x+120, this.y + (InventoryListItem.HEIGHT - Window.TEXT_SIZE)/2, "sta cost", Window.TEXT_STYLE);
    }
    
    loadAction(action, pc) {
        this.action = action;
        super.load(action);
        
        if(action != null) {
            if(action == "strike" || action == "thrust" || action == "shoot" || action == "block") {
                this.texts[0].text = action;
                this.texts[1].text = "0";
            } else {
                this.texts[0].text = action.typeString;
                this.texts[1].text = action.getCastCost(pc);
            }
        }
    }
    
}

ActionListItem.HEIGHT = 25;
ActionListItem.WIDTH = 220;