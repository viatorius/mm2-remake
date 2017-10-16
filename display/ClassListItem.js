class ClassListItem extends GenericListItem {
    constructor(x, y, list, game) {
        super(x, y, list, game, InventoryListItem.WIDTH, InventoryListItem.HEIGHT);
        this.pcClass;
        this.behindBox.destroy();
    }
    
    create() {
        super.create();
        this.icon = this.game.add.sprite(this.x, this.y, 'class');
        this.icon.y = this.y + (ClassListItem.HEIGHT - this.icon.height)/2;
        
        this.texts[0] = this.game.add.text(this.x+36, this.y, "name", Window.TEXT_STYLE);
        this.texts[1] = this.game.add.text(this.x+36, this.y + 1*ClassListItem.HEIGHT/3, "value", Window.TEXT_STYLE);
        this.texts[2] = this.game.add.text(this.x+36, this.y + 2*ClassListItem.HEIGHT/3, "weight", Window.TEXT_STYLE);
        this.texts[3] = this.game.add.text(this.x+12+ClassListItem.WIDTH, this.y+2, "weight", Window.TEXT_STYLE);
        
        this.lines = [];
        this.lines[0] = this.game.add.graphics(this.x, this.y );
        this.lines[0].lineStyle(1.5, 0x000000, 1);
        this.lines[0].moveTo(0,0);
        this.lines[0].lineTo(ClassListItem.WIDTH, 0);
        
        this.lines[1] = this.game.add.graphics(this.x, this.y+ClassListItem.HEIGHT);
        this.lines[1].lineStyle(1.5, 0x000000, 1);
        this.lines[1].moveTo(0,0);
        this.lines[1].lineTo(ClassListItem.WIDTH, 0);
    }
    
    setVisible(vis) {
        super.setVisible(vis);
        this.icon.visible = vis;
        for(var i=0;i<this.lines.length;i++) {
            this.lines[i].visible = vis;
        }
    }
    
    loadClass(pcClass, lvl) {
        this.pcClass = pcClass;
        super.load(pcClass);
        if(pcClass == 0) {
            this.icon.frame = 0;
            this.icon.visible = false;
        } else {
            this.icon.visible = true;
            this.icon.frame = pcClass;
            
            var typeString = ClassData.DATA[pcClass][0];
            //console.log(typeString);
            if(typeString == "warrior") {
                //console.log(lvl);
                if(lvl == 0) {
                    this.texts[0].text = "attack bonus +1";
                    this.texts[1].text = "light shield proficiency";
                    this.texts[2].text = "";
                    this.texts[3].text = "str>1";
                } else if(lvl == 1) {
                    this.texts[0].text = "attack bonus +1";
                    this.texts[1].text = "martial weapons proficiency";
                    this.texts[2].text = "";
                    this.texts[3].text = "str>2";
                } else if(lvl == 2) {
                    this.texts[0].text = "attack bonus +1";
                    this.texts[1].text = "medium armour proficiency";
                    this.texts[2].text = "";
                    this.texts[3].text = "str>3";
                }
            } else if(typeString == "spellcaster") {
                //console.log(lvl);
                if(lvl == 0) {
                    this.texts[0].text = "lvl 1 arcane spells";
                    this.texts[1].text = "lvl 1 divine spells";
                    this.texts[2].text = "";
                } else if(lvl == 1) {
                    this.texts[0].text = "lvl 2 arcane spells";
                    this.texts[1].text = "lvl 2 divine spells";
                    this.texts[2].text = "";
                } else if(lvl == 2) {
                    this.texts[0].text = "lvl 3 arcane spells";
                    this.texts[1].text = "lvl 3 divine spells";
                    this.texts[2].text = "";
                }
            } else if(typeString == "swashbuckler") {
                //console.log(lvl);
                if(lvl == 0) {
                    this.texts[0].text = "dodge AC +1";
                    this.texts[1].text = "lockpicking +20%";
                    this.texts[2].text = "";
                } else if(lvl == 1) {
                    this.texts[0].text = "attack bonus +1";
                    this.texts[1].text = "martial weapons proficiency";
                    this.texts[2].text = "";
                } else if(lvl == 2) {
                    this.texts[0].text = "dodge AC +1";
                    this.texts[1].text = "sneak attack +1d6";
                    this.texts[2].text = "";
                }
            } else if(typeString == "tracker") {
                //console.log(lvl);
                if(lvl == 0) {
                    this.texts[0].text = "";
                    this.texts[1].text = "pathfinding";
                    this.texts[2].text = "";
                } else if(lvl == 1) {
                    this.icon.visible = false;
                    this.texts[0].text = "";
                    this.texts[1].text = "";
                    this.texts[2].text = "";
                } else if(lvl == 2) {
                    this.icon.visible = false;
                    this.texts[0].text = "";
                    this.texts[1].text = "";
                    this.texts[2].text = "";
                }
            }
        }
    }
    
}

ClassListItem.HEIGHT = 56;
ClassListItem.WIDTH = 260;

/*
Warrior:
1: +1 BAB, light shield                 --- req str>=2
2: +1 BAB, martial weapons              --- req str>=3
3: +1 BAB, medium armour                --- req str>=4

Spellcaster:
1: level 1 arcane, level 1 divine       --- req int>=2
2: level 2 arcane, level 2 divine       --- req int>=3
3: level 3 arcane, level 3 divine       --- req int>=4

Swashbuckler:
1: +1 dodge AC, lockpicking +25%        --- req agi>=2
2: +1 BAB, martial weapons              --- req agi>=3
3: +1 dodge AC, +5% crit chance         --- req agi>=4

Barbarian:
1: +1 BAB, +1 dodge AC, rage once/rest
2: +1 BAB, +1 dodge AC
3: +1 BAB, +1 dodge AC, rage unlimited

Paladin:
1: +1 BAB, medium armour, level 1 divine
2: heavy shield, level 2 divine
3: +1 BAB, heavy armour, level 3 divine

Archer:
1: +1 BAB, double shot, level 1 arcane
2: +1 dodge AC, level 2 arcane
3: +1 BAB, triple shot, level 3 arcane

Rogue:
1: +1 BAB, sneak attack +1d6, lockpicking +25%
2: +1 dodge AC, sneak attack +1d6
3: +1 BAB, sneak attack +1d6, lockpicking +25%

Cleric:
1: level 1-3 divine
2: level 4 divine
3: level 5 divine

Sorcerer:
1: level 1-3 arcane
2: level 4 arcane
3: level 5 arcane

Ranger:
1: +1 BAB, pathfinding
2: +1 dodge AC, mountaineering

Ninja:
1: +1 BAB, +1d6 sneak attack
2: +1 dodge AC, mountaineering

Priest:
1: level 1-4 divine
2: level 5-6 divine

Necromancer:
1: level 1-4 arcane
2: level 5-6 arcane

Templar:
1: +1 BAB, level 1-3 divine, all shield/armour
2: +1 BAB, level 4 divine

Cuisinart:
1: +1 BAB, level 1-3 divine, all shield/armour
2: +1 BAB, level 4 divine

Mountaineer:
1: mountaineer

Tracker:
1: pathfinding                          --- req agi>=3
*/