class EquipItem {
    constructor(typeString, plus=0, specialType="") {
        this.typeString = typeString;
        var t = -1;
        for(var i=0;i<ItemData.DATA.length;i++) {
            if(ItemData.DATA[i][0] == typeString) {
                t = i;
            }
        }
        if(t == -1) console.log("Error, incorrect item name: "+typeString);
        this.type = t;
        this.equipType = ItemData.DATA[t][1];
        this.proficiency = ItemData.DATA[t][2];
        this.value = ItemData.DATA[t][3];
        this.weight = ItemData.DATA[t][4];
        
        this.plus = plus;
        this.specialType = specialType;
        var valueBoost = 1000*this.plus*this.plus;
        if(!(specialType == "")) {
            var u = -1;
            for(var i=0;i<ItemData.BONUS_COSTS.length;i++) {
                if(ItemData.BONUS_COSTS[i][0] == specialType) {
                    u = i;
                }
            }
            if(u == -1) console.log("Error, incorrect special bonus name: "+specialType);
            valueBoost += ItemData.BONUS_COSTS[u][1];
        }
        
        this.value += valueBoost;
        
        this.dodgeBonus;
        this.armourBonus;
        this.shieldBonus;
        
        if(this.equipType == "armour" || this.equipType == "shield") {
            this.dodgeBonus = ItemData.DATA[t][5][0];
        }
        if(this.equipType == "armour") {
            this.armourBonus = ItemData.DATA[t][5][1];
        }
        if(this.equipType == "shield") {
            this.shieldBonus = ItemData.DATA[t][5][1];
        }
        
        this.strikeDieNumber;
        this.strikeDieType;
        this.strikeCritChance;
        this.strikeCritMultiplier;
        
        this.thrustDieNumber;
        this.thrustDieType;
        this.thrustCritChance;
        this.thrustCritMultiplier;
        
        this.shootDieNumber;
        this.shootDieType;
        this.shootCritChance;
        this.shootCritMultiplier;
        
        if(this.equipType == "ranged") {
            this.shootDieNumber = ItemData.DATA[t][5][0];
            this.shootDieType = ItemData.DATA[t][5][1];
            this.shootCritChance = ItemData.DATA[t][5][2];
            this.shootCritMultiplier = ItemData.DATA[t][5][3];
        }
        
        if(this.equipType == "light" || this.equipType == "one-handed" || this.equipType == "two-handed") {
            this.strikeDieNumber = ItemData.DATA[t][5][0];
            this.strikeDieType = ItemData.DATA[t][5][1];
            this.strikeCritChance = ItemData.DATA[t][5][2];
            this.strikeCritMultiplier = ItemData.DATA[t][5][3];
            
            this.thrustDieNumber = ItemData.DATA[t][6][0];
            this.thrustDieType = ItemData.DATA[t][6][1];
            this.thrustCritChance = ItemData.DATA[t][6][2];
            this.thrustCritMultiplier = ItemData.DATA[t][6][3];
        }
    }
    
    beConsumedBy(pc) {
        if(this.specialType == "of health") {
            var healBonus = 10*(1+this.plus);
            pc.curHp = Math.min(pc.curHp+healBonus, pc.maxHp);
        }
        if(this.specialType == "of vitality") {
            var staBonus = 10*(1+this.plus);
            pc.curSta = Math.min(pc.curSta+staBonus, pc.maxSta);
        }
    }
}