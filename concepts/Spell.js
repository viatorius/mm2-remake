class Spell {
    constructor(typeString, prof = 0) {
        this.typeString = typeString;
        var t = -1;
        for(var i=0;i<SpellData.DATA.length;i++) {
            if(SpellData.DATA[i][0] == typeString) {
                t = i;
            }
        }
        if(t == -1) console.log("Error, incorrect spell name: "+typeString);
        
        this.type = t;
        this.proficiency = prof;
        
        this.casterType = SpellData.DATA[t][1];
        this.casterLevel = SpellData.DATA[t][2];
        this.castCost = SpellData.DATA[t][3];
        this.doesScale = SpellData.DATA[t][4];
        this.targetType = SpellData.DATA[t][5];
    }
    
    castSpell(caster, target) {
        var cost = this.getCastCost(caster);
        caster.curSta = Math.max(0, caster.curSta - cost);
        
        if(this.typeString == "electric arrow") {
            caster.attack(target, caster.shootAttackBonus, 1, 6, 0, 0, 1, "electricity");
        } else if(this.typeString == "first aid") {
            target.curHp = Math.min(target.curHp + 6, target.maxHp);
        } else if(this.typeString == "bless") {
            target.addStatus("blessed", caster.intelligence+1, 10*(caster.intelligence+1));      
        }
    }
    
    getCastCost(caster) {
        if(this.doesScale) return this.castCost * (caster.intelligence+1);
        return this.castCost;
    }
    
    canCastSpell(caster) {
        return this.getCastCost(caster) < caster.curSta && caster.isActive() && !caster.hasStatus("silenced");
    }
}

Spell.COMBAT = "foes";
Spell.PC = "one pc";
Spell.PARTY = "all pc";
Spell.ITEM = "one item";