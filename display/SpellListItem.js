class SpellListItem extends GenericListItem {
    constructor(x, y, list, game) {
        super(x, y, list, game, SpellListItem.WIDTH_SMALL, SpellListItem.HEIGHT);
        this.spell;
    }
    
    create() {
        super.create();
        this.texts[0] = this.game.add.text(this.x, this.y + (InventoryListItem.HEIGHT - Window.TEXT_SIZE)/2, "name", Window.TEXT_STYLE);
        this.texts[1] = this.game.add.text(this.x+120, this.y + (InventoryListItem.HEIGHT - Window.TEXT_SIZE)/2, "profiency", Window.TEXT_STYLE);
        this.texts[2] = this.game.add.text(this.x+150, this.y + (InventoryListItem.HEIGHT - Window.TEXT_SIZE)/2, "cost", Window.TEXT_STYLE);
    }
    
    loadSpell(spell, pc, extended=true) {
        this.spell = spell;
        super.load(spell);
        
        this.width = SpellListItem.WIDTH_SMALL;
        
        if(spell != null) {
            this.texts[0].text = spell.typeString;
            if(spell.doesScale) this.texts[1].text = (pc.intelligence+1) * spell.castCost;
            else this.texts[1].text = spell.castCost;
            if(extended) {
                this.texts[2].text = spell.proficiency+"%";
            } else {
                for(var i=2;i<this.texts.length;i++) {
                    this.texts[2].visible = false;
                }
            }
        }
    }
    
}

SpellListItem.HEIGHT = 25;
SpellListItem.WIDTH_SMALL = 220;
SpellListItem.WIDTH_LARGE = 300;