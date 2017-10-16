class ActionList extends GenericList {
    constructor(x, y, window, game, size) {
        super(x, y, window, game, size);
        this.pc;
    }
    
    create() {
        super.create();
        for(var i=0;i<this.size;i++) {
            this.listItems[i] = new ActionListItem(this.x, this.y+4+i*ActionListItem.HEIGHT, this, this.game);
        }
    }
    
    loadPcAndActions(pc, actions) {
        this.pc = pc; 
        this.load(actions);
    }
    
    reloadItems() {
        super.reloadItems();
        for(var i=0;i<this.size;i++) {
            this.listItems[i].setVisible(true);
            if(i+this.cScrollPosition < this.listData.length) {
                this.listItems[i].loadAction(this.listData[i+this.cScrollPosition], this.pc);
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
            else this.listItems[i].loadAction(null);
        }
    }
}