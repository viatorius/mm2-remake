class InventoryList extends GenericList {
    constructor(x, y, window, game, size) {
        super(x, y, window, game, size);
        this.costMultiplier = 1;
    }
    
    create() {
        super.create();
        for(var i=0;i<this.size;i++) {
            this.listItems[i] = new InventoryListItem(this.x, this.y+4+i*InventoryListItem.HEIGHT, this, this.game);
        }
    }
    
    setCostMultiplier(x) {
       this.costMultiplier = x; 
    }
    
    reloadItems() {
        super.reloadItems();
        for(var i=0;i<this.size;i++) {
            this.listItems[i].setVisible(true);
            if(i+this.cScrollPosition < this.listData.length) {
                this.listItems[i].loadItem(this.listData[i+this.cScrollPosition], this.costMultiplier);
                if(this.isItemValid[i+this.cScrollPosition]) {
                    if(this.isItemSelected[i+this.cScrollPosition]) {
                        this.listItems[i].setSelected();
                    } else {
                        this.listItems[i].setNormal();
                    }
                } else {
                    this.listItems[i].setInvalid();
                }
            }
            else this.listItems[i].loadItem(null);
        }
    }
}