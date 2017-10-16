class Pc extends Agent {
    constructor(name, partyOrder, str, agi, end, int, cha) {
        super(name, "pc"); 
        this.partyOrder = partyOrder;
        this.strengthPrg = str;
        this.agilityPrg = agi;
        this.endurancePrg = end;
        this.intelligencePrg = int;
        this.charismaPrg = cha;
        
        this.strength;
        this.agility;
        this.endurance;
        this.intelligence;
        this.charisma;
        
        this.level = 0;
        this.levelPrg = 0;
        this.classLevels = new Array(Pc.MAX_CLASS_LEVELS);
        for(var i=0;i<this.classLevels.length;i++) {this.classLevels[i] = 0;}
        
        this.strikeAttackBonus = 0; // attack bonus
        this.strikeDieNumber = 0; // number of hit die
        this.strikeDieType = 0; // type of hit die (d4, d6, d10, etc)
        this.strikeDamageBonus = 0; // damage bonus
        
        this.thrustAttackBonus = 0;
        this.thrustDieNumber = 0;
        this.thrustDieType = 0;
        this.thrustDamageBonus = 0;
        
        this.shootAttackBonus = 0;
        this.shootDieNumber = 0;
        this.shootDieType = 0;
        this.shootDamageBonus = 0;
        
        this.status = []; //array of 3-dim arrays ([type, intensity, duration])
        this.inventory = [];
        this.equipItems = new Array(8); 
        /*
            0: head
            1: left weapon/shield
            2: ranged weapon
            3: right weapon
            4: left hand special
            5: torso
            6: right hand special
            7: feet
        */
        
        this.frontRow = true;
        
        this.caryWeight = 0;
        this.carryCapacity = 0;
        
        this.spells = [];
        this.quickAction = "";
        
        this.calcStats(true);
    }
    
    calcStats(resetHp=false) { // 20 80 180 320
        // compute the ability levels based on the progressions
        this.strength = Math.floor(Math.sqrt(this.strengthPrg/Pc.LEVEL_UP_THRESHOLD));
        this.agility = Math.floor(Math.sqrt(this.agilityPrg/Pc.LEVEL_UP_THRESHOLD));
        this.endurance = Math.floor(Math.sqrt(this.endurancePrg/Pc.LEVEL_UP_THRESHOLD));
        this.intelligence = Math.floor(Math.sqrt(this.intelligencePrg/Pc.LEVEL_UP_THRESHOLD));
        this.charisma = Math.floor(Math.sqrt(this.charismaPrg/Pc.LEVEL_UP_THRESHOLD));
        this.level = Math.floor(Math.sqrt(this.levelPrg/Pc.CLASS_LEVEL_UP_THRESHOLD));
        
        this.maxHp = 5*(this.strength + this.endurance + 1);
        this.maxSta = 5*(this.intelligence + this.endurance + 1);
        
        if(resetHp) {
            this.curHp = this.maxHp;
            this.curSta = this.maxSta;
        } else {
            this.curHp = Math.min(this.maxHp, this.curHp);
            this.curSta = Math.min(this.maxSta, this.curSta);
        }
        
        this.strikeAttackBonus = this.agility;
        this.strikeDieNumber = 1;
        this.strikeDieType = 4;
        this.strikeDamageBonus = this.strength;
        this.strikeCritChance = 0.05;
        this.strikeCritMultiplier = 2;
        if(this.equipItems[3] != null) {
            this.strikeDieNumber = this.equipItems[3].strikeDieNumber;
            this.strikeDieType = this.equipItems[3].strikeDieType;
            this.strikeCritChance = this.equipItems[3].strikeCritChance;
            this.strikeCritMultiplier = this.equipItems[3].strikeCritMultiplier;
            var bonus = this.equipItems[3].plus;
            if(this.equipItems[1] != null) {
                if(this.equipItems[3].type == this.equipItems[1].type) {
                    this.nAttacks++;
                    // smallest bonus applies (to avoid making it unnecessarily complicated)
                    bonus = Math.min(this.equipItems[1].plus, bonus);
                }
            }
            this.strikeAttackBonus += bonus;
            this.strikeDamageBonus += bonus;
        }
        
        this.thrustAttackBonus = this.agility;
        this.thrustDieNumber = 1;
        this.thrustDieType = 3;
        this.thrustDamageBonus = Math.floor((2*this.strength/3 + this.agility/3));
        this.thrustCritChance = 0.05;
        this.thrustCritMultiplier = 2;
        if(this.equipItems[3] != null) {
            this.thrustDieNumber = this.equipItems[3].thrustDieNumber;
            this.thrustDieType = this.equipItems[3].thrustDieType;
            this.thrustCritChance = this.equipItems[3].thrustCritChance;
            this.thrustCritMultiplier = this.equipItems[3].thrustCritMultiplier;
            var bonus = this.equipItems[3].plus;
            if(this.equipItems[1] != null) {
                if(this.equipItems[3].type == this.equipItems[1].type) {
                    this.nAttacks++;
                    // smallest bonus applies (to avoid making it unnecessarily complicated)
                    bonus = Math.min(this.equipItems[1].plus, bonus);
                }
            }
            this.thrustAttackBonus += bonus;
            this.thrustDamageBonus += bonus;
        }
        
        this.shootAttackBonus = 0;
        this.shootDieNumber = 0;
        this.shootDieType = 0;
        this.shootDamageBonus = 0;
        this.shootCritChance = 0;
        this.shootCritMultiplier = 1;
        if(this.equipItems[2] != null) {
            this.shootDieNumber = this.equipItems[2].shootDieNumber;
            this.shootDieType = this.equipItems[2].shootDieType;
            this.shootCritChance = this.equipItems[2].shootCritChance;
            this.shootCritMultiplier = this.equipItems[2].shootCritMultiplier;
            this.shootAttackBonus += this.equipItems[2].plus;
            this.shootDamageBonus += this.equipItems[2].plus;
        }
        
        this.carryCapacity = 10 + 5 * this.strength;
        this.carryWeight = 0;
        for(var i=0;i<this.inventory.length;i++) {this.carryWeight += this.inventory[i].weight;}
        for(var i=0;i<this.equipItems.length;i++) {
            if(this.equipItems[i] != null) {
                this.carryWeight += this.equipItems[i].weight;
            }
        }
        if(this.carryWeight > 100) {this.carryWeight = Math.ceil(this.carryWeight);}
        else {this.carryWeight = Math.ceil(10*this.carryWeight)/10;}
        //else {this.carryWeight = Math.ceil(100*this.carryWeight)/100;}
        
        this.dodgeAC = 10 + this.agility;
        if(this.equipItems[1] != null) {this.dodgeAC += this.equipItems[1].dodgeBonus;} // shield
        if(this.equipItems[5] != null) {this.dodgeAC += this.equipItems[5].dodgeBonus;} // armour
        this.shieldAC = this.dodgeAC;
        if(this.equipItems[1] != null) {this.shieldAC += this.equipItems[1].shieldBonus + this.equipItems[1].plus;} // shield
        this.armourAC = this.shieldAC;
        if(this.equipItems[5] != null) {this.armourAC += this.equipItems[5].armourBonus + this.equipItems[5].plus;} // shield
        
    }
    
    updateSpellList() {
        // remove all zero-proficiency spells
        for(var i=this.spells.length-1; i>=0; i--) {
            if(this.spells[i].proficiency == 0) {
                this.spells.splice(i, 1);
            }
        }
        
        // add spells from scroll
        if(this.equipItems[3] != null) {
            if(this.equipItems[3].typeString == "scroll") {
                this.spells.push(new Spell(this.equipItems[3].specialType));
            }
        }
    }
    
    equipToSlot(item, slot) {
        if(this.equipItems[slot] != null) this.addToInventory(this.equipItems[slot]);
        this.equipItems[slot] = item;
        // an item can be unequipped by equipping a 'null' item to a slot, hence the following condition:
        if(item != null) {
            // unequip left-hand item if weapon is two-handed
            if(item.equipType == "two-handed" && this.equipItems[1] != null) {
                this.addToInventory(this.equipItems[1]);
                this.equipItems[1] = null;
            }
            // unequip left-handed weapon if different weapon equipped
            if(this.equipItems[1] != null) {
                if(this.equipItems[1].type != item.type && this.equipItems[1].equipType == "light") {
                    this.addToInventory(this.equipItems[1]);
                    this.equipItems[1] = null;
                }
            }
        }
        this.updateSpellList();
        this.calcStats();
    }
    
    clearEquipSlot(slot) {
        this.equipItems[slot] = null;
        this.updateSpellList();
        this.calcStats();
    }
    
    addToInventory(item) {
        this.inventory.push(item);
        this.calcStats();
    }
    
    removeFromInventory(itemIndex) {
        this.inventory.splice(itemIndex, 1);
        this.calcStats();
    }
    
    canStrike() {
        return this.frontRow;
    }
    
    canThrust() {
        return this.frontRow;
    }
    
    canShoot() {
        return !this.frontRow && this.equipItems[2] != null;
    }
    
    getClassLevel(type) {
        var lvl = 0;
        for(var i=0; i<this.classLevels.length; i++) {
            if(this.classLevels[i] == type) lvl++;
        }
        return lvl;
    }
    
    canLevelUp() {
        var lvl = 0;
        for(var i=0; i<this.classLevels.length; i++) {
            if(this.classLevels[i] != 0) lvl++;
        }
        return lvl < this.level && lvl < Pc.MAX_CLASS_LEVELS;
    }
    
    hasStatus(stat) {
        for(var i=this.status.length-1; i>=0; i--) {
            if(this.status[i][0] == stat) return true;
        }
        return false;
    }
    
    addStatus(stat, intensity, duration=Number.MAX_VALUE) {
        if(!this.hasStatus(stat)) {
            this.status.push([stat, intensity, duration]);
        }
    }
    
    removeStatus(stat) {
        for(var i=this.status.length-1; i>=0; i--) {
            if(this.status[i][0] == stat) {
                this.status.splice(i, 1);
            }
        }
    }
    
    // save/load
    
    getSaveData() {
        var result = new Object();
        result["curHp"] = this.curHp;
        result["maxHp"] = this.maxHp;
        result["curSta"] = this.curSta;
        result["maxSta"] = this.maxSta;
        result["frontRow"] = this.frontRow;
        return result;
    }
    
    loadData(data) {
        this.curHp = data["curHp"];
        this.maxHp = data["maxHp"];
        this.curSta = data["curSta"];
        this.maxSta = data["maxSta"];
        this.frontRow = data["frontRow"];
    }
}

Pc.LEVEL_UP_THRESHOLD = 5;
Pc.CLASS_LEVEL_UP_THRESHOLD = 100;
Pc.MAX_CLASS_LEVELS = 8; 
Pc.MAX_CLASS_LEVELS_PER_CLASS = 3;