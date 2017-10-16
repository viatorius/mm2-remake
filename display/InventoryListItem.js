class InventoryListItem extends GenericListItem {
    constructor(x, y, list, game) {
        super(x, y, list, game, InventoryListItem.WIDTH, InventoryListItem.HEIGHT);
        this.item;
    }
    
    create() {
        super.create();
        this.icon = this.game.add.sprite(this.x, this.y, 'item');
        this.icon.y = this.y + (InventoryListItem.HEIGHT - this.icon.height)/2;
        this.texts[0] = this.game.add.text(this.x+24, this.y + (InventoryListItem.HEIGHT - Window.TEXT_SIZE)/2, "name", Window.TEXT_STYLE);
        this.texts[1] = this.game.add.text(this.x+140, this.y + (InventoryListItem.HEIGHT - Window.TEXT_SIZE)/2, "value", Window.TEXT_STYLE);
        this.texts[2] = this.game.add.text(this.x+190, this.y + (InventoryListItem.HEIGHT - Window.TEXT_SIZE)/2, "weight", Window.TEXT_STYLE);
    }
    
    setVisible(vis) {
        super.setVisible(vis);
        this.icon.visible = vis;
    }
    
    loadItem(item, costMultiplier=1) {
        this.item = item;
        super.load(item);
        if(item == null) {
            this.icon.frame = 0;
            this.icon.visible = false;
        } else {
            this.icon.visible = true;
            this.icon.frame = item.type;
            this.texts[0].text = item.typeString;
            if(item.specialType != "") this.texts[0].text += "*";
            if(item.plus == 1) this.texts[0].text += "+";
            if(item.plus > 1) this.texts[0].text += "+"+item.plus;
            var value = item.value * costMultiplier;
            if(value >= 100) value = Math.round(value);
            else if(value >= 1) value = Math.round(value*100)/100;
            this.texts[1].text = value;
            var weight = item.weight;
            if(weight >= 100) value = Math.ceil(value);
            else if(weight >= 1) value = Math.ceil(value*100)/100;
            this.texts[2].text = weight;
        }
    }
    
}

InventoryListItem.HEIGHT = 25;
InventoryListItem.WIDTH = 220;