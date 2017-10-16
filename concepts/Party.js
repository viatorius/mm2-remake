class Party{
    constructor() {
        this.members = new Array(Party.PC_PARTY_SIZE);
        this.x = 0;
        this.y = 0;
        this.dir = 0;
        this.maps = [];
        this.cMap = null;
        this.resetEventDirection = 0;
        
        this.gold = 200;
        this.food = 1;
        this.minutesSpent = 12*60; // start at noon
    }
    
    createSampleParty() {
        var c1 = Pc.LEVEL_UP_THRESHOLD;
        var c2 = Pc.LEVEL_UP_THRESHOLD*4;
        this.members[0] = new Pc("Sir Caneghem",0,c1,c1,c1,c1,c1);
        this.members[1] = new Pc("Crag Hack",1,c1,0,c2,0,0);
        this.members[2] = new Pc("Maximus",2,c2,0,c1,0,0);
        this.members[3] = new Pc("Resurrectra",3,0,0,0,c2,c1);
        this.members[4] = new Pc("Kastore",4,0,c1,0,c2,0);
        this.members[5] = new Pc("Dark Shade",5,c1,c2,0,0,0);
        
        this.members[4].equipToSlot(new EquipItem("club"), 3);
        this.members[5].equipToSlot(new EquipItem("dagger", 1), 3);
        
        this.members[1].equipToSlot(new EquipItem("crossbow"), 2);
        this.members[1].frontRow = false;
        this.members[5].equipToSlot(new EquipItem("crossbow"), 2);
        this.members[5].frontRow = false;
        
        for(var i=0;i<ItemData.DATA.length-1;i++) {
            this.members[5].addToInventory(new EquipItem(ItemData.DATA[i+1][0]));
        }
        
        this.members[1].addToInventory(new EquipItem("padded jack"));
        this.members[1].addToInventory(new EquipItem("padded jack", 1));
        this.members[1].addToInventory(new EquipItem("padded jack", 2));
        this.members[1].addToInventory(new EquipItem("spear"));
        this.members[1].addToInventory(new EquipItem("spear", 1));
        this.members[1].addToInventory(new EquipItem("spear", 2));
        this.members[1].addToInventory(new EquipItem("potion", 0, "of health"));
        
        this.members[3].spells.push(new Spell("light", 100));
        this.members[3].spells.push(new Spell("electric arrow", 100));
        this.members[3].spells.push(new Spell("first aid", 100));
        this.members[3].spells.push(new Spell("fire bolt", 100));
        this.members[3].spells.push(new Spell("miracle cure", 100));
        this.members[3].spells.push(new Spell("power cure", 100));
        this.members[3].spells.push(new Spell("sleep", 100));
        this.members[3].spells.push(new Spell("bless", 100));
        
        this.members[3].addToInventory(new EquipItem("scroll", 0, "first aid"));
        
        this.members[2].levelPrg = 10000;
        this.members[2].calcStats();
    }
    
    completeRest() {
        for(var i=0;i<this.members.length; i++) {
            var pc = this.members[i];
            if(this.food > 0) {
                pc.curHp = pc.maxHp;
                pc.curSta = pc.maxSta;
                pc.removeStatus("weak");
            } else {
                pc.curHp = pc.maxHp/2;
                pc.curSta = pc.maxSta/2;
                pc.addStatus("weak", 1, Number.MAX_VALUE);
            }
        }
        if(this.food > 0) this.food -= 1;
    }
    
    processMove(timeSpent) {
        for(var i=0;i<this.members.length; i++) {
            for(var j=this.members[i].status.length-1;j>=0;j--) {
                this.members[i].status[j][2] -= timeSpent;
                if(this.members[i].status[j][2] <= 0) {
                    this.members[i].removeStatus(this.members[i].status[j][0]);
                }
            }
        }
    }
    
    getActiveFrontRowSize() {
        var res = 0;
        for(var i=0;i<this.members.length; i++) {
            if(this.members[i].frontRow && this.members[i].isActive()) res++;
        }
        return res;
    }
    
    getActiveBackRowSize() {
        var res = 0;
        for(var i=0;i<this.members.length; i++) {
            if(!this.members[i].frontRow && this.members[i].isActive()) res++;
        }
        return res;
    }
    
    setMap(map) {
        this.cMap = map;
        this.cMap.explore(this.x, this.y);
        this.resetEventDirection = this.newDir + 2;
        if(this.resetEventDirection >= 4) this.resetEventDirection -= 4;
        this.cMap.updateMonsterGrid();
        this.cMap.updateEventGrid();
    }
    
    // save/load purposes:
    
    getSaveData() {
        var result = new Object();
        result["gold"] = this.gold;
        result["food"] = this.food;
        result["minutesSpent"] = this.minutesSpent;
        result["mapName"] = this.cMap.name;
        result["x"] = this.x;
        result["y"] = this.y;
        result["dir"] = this.dir;
        result["resetEventDirection"] = this.resetEventDirection;
        
        for(var i=0;i<Party.PC_PARTY_SIZE;i++) {
            result["member"+i] = JSON.stringify(this.members[i].getSaveData());
        }
        
        for(var i=0;i<this.maps.length;i++) {
            result["monsters"+i] = JSON.stringify(this.maps[i].getMonsterData());
        }
        
        for(var i=0;i<this.maps.length;i++) {
            //result["member"+i] = JSON.stringify(this.maps[i].getSaveData());
        }
        
        for(var i=0;i<this.maps.length;i++) {
            result["explored"+i] = this.maps[i].getExplorationData();
        }
        
        return result;
        
    }
    
    loadSaveData(data) {
        this.gold = data["gold"];
        this.food = data["food"];
        this.minutesSpent = data["minutesSpent"]; 
        
        for(var i=0;i<Party.PC_PARTY_SIZE;i++) {
            this.members[i].loadData(JSON.parse(data["member"+i]));
        }
        
        for(var i=0;i<this.maps.length;i++) {
            this.maps[i].loadMonstersFromSaveFile(JSON.parse(data["monsters"+i]));
        }
        
        for(var i=0;i<this.maps.length;i++) {
            this.maps[i].loadExplorationData(data["explored"+i]);
        }
                
        for(var i=0;i<MapData.DATA.length;i++) {
            if(MapData.DATA[i][0] == data["mapName"]) {
                this.setMap(this.maps[i]);
            }
        }
        
        this.x = data["x"];
        this.y = data["y"];
        this.dir = data["dir"];
        this.resetEventDirection = data["resetEventDirection"];
    }
}

Party.PC_PARTY_SIZE = 6;