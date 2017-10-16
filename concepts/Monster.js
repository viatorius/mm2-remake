class Monster extends Agent {
    constructor(name, x, y, curHp, curSta) {
        var t = -1;
        for(var i=0;i<MonsterData.DATA.length;i++) {
            if(MonsterData.DATA[i][0] == name) {
                t = i;
            }
        }
        if(t == -1) console.log("Error, incorrect monster name: "+str);
        super(name, "monster");
        this.monsterType = t;
        
        this.agility = MonsterData.DATA[t][1];
        this.maxHp =   MonsterData.DATA[t][2];
        this.curHp =   MonsterData.DATA[t][2];
        this.maxSta =  MonsterData.DATA[t][3];
        this.curSta =  MonsterData.DATA[t][3];
        
        if(curHp > 0) this.curHp = curHp;
        if(curSta > 0) this.curSta = curSta;
        
        this.x = x;
        this.y = y;
        
        this.stackPos = 0; 
        this.pcPartyDist = 0;
        
        this.nAttacks = MonsterData.DATA[t][5];
        this.attackBonus = MonsterData.DATA[t][6];
        this.dieNumber = MonsterData.DATA[t][7];
        this.dieType = MonsterData.DATA[t][8];
        this.damageBonus = MonsterData.DATA[t][9];
        this.critChance = MonsterData.DATA[t][10];
        this.critMultiplier = MonsterData.DATA[t][11];
        this.dmgType = MonsterData.DATA[t][12];
        this.attackGroup = MonsterData.DATA[t][13];
        this.statusType = MonsterData.DATA[t][14];
        this.statusProb = MonsterData.DATA[t][15];
        
        this.dodgeAC = 10;
    }
    
    pickTarget(party) {
        // pick target uniformly from front-row party members, unless only back row
        var nBackRow = party.getActiveBackRowSize();
        var nFrontRow = party.getActiveFrontRowSize();
        var pick = -1;
        var u = Math.random();
        var count = 1;
        if(nFrontRow == 0) {
            for(var i=0;i<party.members.length; i++) {
                if(party.members[i].isActive() && pick == -1) {
                    if(u < count/nBackRow) {
                        pick = i; 
                    }
                    count++;
                }
            }
        } else {
            for(var i=0;i<party.members.length; i++) {
                if(party.members[i].isActive() && party.members[i].frontRow && pick == -1) {
                    if(u < count/nFrontRow) {
                        pick = i; 
                    }
                    count++;
                }
            }
        }
        console.log("pick: "+pick+"("+nFrontRow+", "+nBackRow+")");
        return pick;
    }
    
    // save/load
    getSaveData() {
        var result = new Object();
        result["name"] = this.name;
        result["x"] = this.x;
        result["y"] = this.y;
        result["curHp"] = this.curHp;
        result["staHp"] = this.curSta;
        return result;
    }
}