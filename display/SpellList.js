class SpellList extends GenericList {
    constructor(x, y, window, game, size) {
        super(x, y, window, game, size);
        this.extended;
        this.pc;
    }
    
    create() {
        super.create();
        for(var i=0;i<this.size;i++) {
            this.listItems[i] = new SpellListItem(this.x, this.y+4+i*InventoryListItem.HEIGHT, this, this.game);
        }
    }
    
    setPc(pc) {
        this.pc = pc; 
        this.load(pc.spells);
    }
    
    setExtended(b) {
       this.extended = b; 
    }
    
    reloadItems() {
        super.reloadItems();
        for(var i=0;i<this.size;i++) {
            this.listItems[i].setVisible(true);
            if(i+this.cScrollPosition < this.listData.length) {
                this.listItems[i].loadSpell(this.listData[i+this.cScrollPosition], this.pc, this.extended);
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
            else this.listItems[i].loadSpell(null);
        }
    }
}