class Map{
    constructor(party) {
        this.name = "";
        this.terrain = [];
        this.explored = [];
        this.hzWalls = [];
        this.vtWalls = [];
        this.pcParty = party;
        this.monsters = [];
        this.monsterGrid = [];
        this.events = [];
        this.eventGrid = [];
        this.minutesPerStep = 0;
    }
    
    isMoveValid(x, y, dx, dy) {
        if(x >= 0 && x < this.terrain.length && y >= 0 && y < this.terrain[0].length) {
            //if(this.terrain[x+dx][y+dy] == 2) return false;
            if(x+1 < this.vtWalls.length) if(dx == 1 && this.vtWalls[x+1][y] == 1) return false;
            if(dx == -1 && this.vtWalls[x][y] == 1) return false;
            if(y+1 < this.hzWalls[0].length) if(dy == 1 && this.hzWalls[x][y+1] == 1) return false;
            if(dy == -1 && this.hzWalls[x][y] == 1) return false;
        }
        return true;
    }
    
    updateMonsterGrid() {
        this.monsterGrid = new Array(this.terrain.length);
        for(var i=0;i<this.terrain.length; i++) {
            this.monsterGrid[i] = new Array(this.terrain[0].length);
            for(var j=0;j<this.terrain[0].length; j++) {
                this.monsterGrid[i][j] = 0;
            }
        }
        
        for(var i=0;i<this.monsters.length; i++) {
            this.monsters[i].stackPos = this.monsterGrid[this.monsters[i].x][this.monsters[i].y];
            this.monsterGrid[this.monsters[i].x][this.monsters[i].y]++;
        }
    }
    
    updateEventGrid() {
        this.eventGrid = new Array(this.terrain.length);
        for(var i=0;i<this.terrain.length; i++) {
            this.eventGrid[i] = new Array(this.terrain[0].length);
            for(var j=0;j<this.terrain[0].length; j++) {
                this.eventGrid[i][j] = 0;
            }
        }
        
        for(var i=0;i<this.events.length; i++) {
            this.eventGrid[this.events[i].x][this.events[i].y] = this.events[i].farAppearance;
        }
    }
    
    moveMonsters() {
        this.updateMonsterGrid();
        var monsters = this.monsters;
        for(var i=0;i<this.monsters.length; i++) {
            this.monsters[i].pcPartyDist = Math.sqrt((this.monsters[i].x - this.pcParty.x)*(this.monsters[i].x - this.pcParty.x) + (this.monsters[i].y - this.pcParty.y)*(this.monsters[i].y - this.pcParty.y));
            //console.log(i+": "+this.monsters[i].pcPartyDist);
        }
        // from https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
        var distMap = this.monsters.map(function(el, i) {
            return { index: i, value: el.pcPartyDist };
        });
        distMap.sort(function(a, b) {
            return +(a.value > b.value) || +(a.value === b.value) - 1;
        });
        var sortedMonsters = distMap.map(function(el){
            return monsters[el.index];
        });
        for(var i=0;i<sortedMonsters.length; i++) {
            if(sortedMonsters[i].pcPartyDist < Map.MAX_MONSTER_MOVE_DIST) this.moveMonster(sortedMonsters[i]);
        }
    }
    
    moveMonster(monster) {
        var px = this.pcParty.x;
        var py = this.pcParty.y;
        var pd = this.pcParty.dir;
        if(monster.y - py == 0) {
            if(monster.x - px > 0) {
                this.attemptMove(monster, -1, 0);
            } else if(monster.x - px < 0) {
                this.attemptMove(monster, 1, 0);
            }
        } else if(monster.x - px == 0) {
            if(monster.y - py > 0) {
                this.attemptMove(monster, 0, -1);
            } else if(monster.y - py < 0) {
                this.attemptMove(monster, 0, 1);
            }
        } else {
            if(pd == 0 || pd == 2) {
                if(monster.x - px > 0) {
                    var success = this.attemptMove(monster, -1, 0);
                    if(!success) if(monster.y - py > 0) {
                        this.attemptMove(monster, 0, -1);
                    } else {
                        this.attemptMove(monster, 0, 1);
                    }
                } else {
                    var success = this.attemptMove(monster, 1, 0);
                    if(!success) if(monster.y - py > 0) {
                        this.attemptMove(monster, 0, -1);
                    } else {
                        this.attemptMove(monster, 0, 1);
                    }
                }
            } else if(pd == 1 || pd == 3) {
                if(monster.y - py > 0) {
                    var success = this.attemptMove(monster, 0, -1);
                    if(!success) if(monster.x - px > 0) {
                        this.attemptMove(monster, -1, 0);
                    } else {
                        this.attemptMove(monster, 1, 0);
                    }
                } else {
                    var success = this.attemptMove(monster, 0, 1);
                    if(!success) if(monster.x - px > 0) {
                        this.attemptMove(monster, -1, 0);
                    } else {
                        this.attemptMove(monster, 1, 0);
                    }
                }
            }
        }
    }
    
    monsterEncounter() {
        if(this.pcParty.x >= 0 && this.pcParty.x < this.monsterGrid.length && this.pcParty.y >= 0 && this.pcParty.y < this.monsterGrid[0].length) {
            return this.monsterGrid[this.pcParty.x][this.pcParty.y] > 0;
        }
        return false;
    }
    
    getTriggeredEvent() {
        if(this.pcParty.x >= 0 && this.pcParty.x < this.eventGrid.length && this.pcParty.y >= 0 && this.pcParty.y < this.eventGrid[0].length) {
            if(this.eventGrid[this.pcParty.x][this.pcParty.y] > 0) {
                for(var i=0;i<this.events.length; i++) {
                    if(this.events[i].x == this.pcParty.x && this.events[i].y == this.pcParty.y) {
                        return this.events[i];
                    }
                }
            }
        }
        return null;
    }
    
    attemptMove(monster, dx, dy) {
        if(monster.x+dx >= 0 && monster.x+dx < this.monsterGrid.length && monster.y+dy >= 0 && monster.y+dy < this.monsterGrid[0].length)
        if(this.monsterGrid[monster.x+dx][monster.y+dy] < Map.MAX_MONSTERS_PER_SQUARE) {
            if(this.isMoveValid(monster.x, monster.y, dx, dy)) {
                this.monsterGrid[monster.x][monster.y]--;
                this.monsterGrid[monster.x+dx][monster.y+dy]++;
                monster.x = monster.x+dx;
                monster.y = monster.y+dy;
                return true;
            }
        }
        return false;
    }
    
    loadMap(mapName) {
        var mapIdx = -1;
        for(var i=0; i<MapData.DATA.length; i++) {
            if(MapData.DATA[i][0] == mapName) mapIdx = i;
        }
        if(mapIdx == -1) console.log("Error, invalid map name: "+mapName);
        this.name = MapData.DATA[mapIdx][0];
        this.minutesPerStep = MapData.DATA[mapIdx][1];
        // copy arrays from map data
        this.terrain = new Array(MapData.DATA[mapIdx][2][0].length);
        this.explored = new Array(MapData.DATA[mapIdx][2][0].length);
        for(var i=0;i<MapData.DATA[mapIdx][2][0].length;i++) {
            this.terrain[i] = new Array(MapData.DATA[mapIdx][2].length);
            this.explored[i] = new Array(MapData.DATA[mapIdx][2].length);
            for(var j=0; j<MapData.DATA[mapIdx][2].length; j++) {
                this.terrain[i][j] = MapData.DATA[mapIdx][2][j][i];
                this.explored[i][j] = false;
            }
        } 
        
        this.hzWalls = new Array(MapData.DATA[mapIdx][3][0].length);
        for(var i=0;i<MapData.DATA[mapIdx][3][0].length;i++) {
            this.hzWalls[i] = new Array(MapData.DATA[mapIdx][3].length);
            for(var j=0; j<MapData.DATA[mapIdx][3].length; j++) {
                this.hzWalls[i][j] = MapData.DATA[mapIdx][3][j][i];
            }
        } 
        
        this.vtWalls = new Array(MapData.DATA[mapIdx][4][0].length);
        for(var i=0;i<MapData.DATA[mapIdx][4][0].length;i++) {
            this.vtWalls[i] = new Array(MapData.DATA[mapIdx][4].length);
            for(var j=0; j<MapData.DATA[mapIdx][4].length; j++) {
                this.vtWalls[i][j] = MapData.DATA[mapIdx][4][j][i];
            }
        } 
    }
    
    loadMonsters(mapName) {
        this.monsters = [];
        
        var mapIdx = -1;
        for(var i=0; i<MapData.DATA.length; i++) {
            if(MapData.DATA[i][0] == mapName) mapIdx = i;
        }
        if(mapIdx == -1) console.log("Error, invalid map name: "+mapName);
        
        for(var i=0; i<MapData.DATA[mapIdx][5].length; i++) {
            var monsterEntry = MapData.DATA[mapIdx][5][i];
            this.monsters.push(new Monster(monsterEntry[0], monsterEntry[1], monsterEntry[2]));
        }
    }
    
    loadEvents(mapName) {
        this.events = [];
        
        var mapIdx = -1;
        for(var i=0; i<MapData.DATA.length; i++) {
            if(MapData.DATA[i][0] == mapName) mapIdx = i;
        }
        if(mapIdx == -1) console.log("Error, invalid map name: "+mapName);
        
        for(var i=0; i<MapData.DATA[mapIdx][6].length; i++) {
            var ee = MapData.DATA[mapIdx][6][i];
            if(ee[5] == "portal") {
                this.events.push(new PortalEvent(this, ee[0], ee[1], ee[2], ee[3], ee[4], ee[6], ee[7], ee[8], ee[9], ee[10]));
            }
            if(ee[5] == "treasure") {
                this.events.push(new TreasureEvent(this, ee[0], ee[1], ee[2], ee[3], ee[4], ee[6], ee[7], ee[8]));
            }
            if(ee[5] == "shop") {
                this.events.push(new ShopEvent(this, ee[0], ee[1], ee[2], ee[3], ee[4], ee[6], ee[7], ee[8], ee[9], ee[10]));
            }
            if(ee[5] == "trainer") {
                this.events.push(new TrainerEvent(this, ee[0], ee[1], ee[2], ee[3], ee[4], ee[6], ee[7], ee[8], ee[9]));
            }
            if(ee[5] == "temple") {
                this.events.push(new TempleEvent(this, ee[0], ee[1], ee[2], ee[3], ee[4], ee[6], ee[7], ee[8], ee[9]));
            }
            if(ee[5] == "inn") {
                this.events.push(new InnEvent(this, ee[0], ee[1], ee[2], ee[3], ee[4], ee[6], ee[7], ee[8], ee[9]));
            }
        }
    }
    
    getMonster(i, j, k) {
        for(var z=0;z<this.monsters.length;z++) {
            if(this.monsters[z].x == i && this.monsters[z].y == j && this.monsters[z].stackPos == k) {
                return this.monsters[z];
            }
        }
        return null;
    }
    
    explore(x, y) {
        if(x >= 0 && x < this.explored.length && y >=0 && y < this.explored[0].length) {
            this.explored[x][y] = true;
        }
    }
    
    //load/save
    
    // monsters
    getMonsterData() {
        var result = new Object();
        for(var i=0;i<this.monsters.length;i++) {
            result["monster"+i] = JSON.stringify(this.monsters[i].getSaveData());
        }
        result["length"] = this.monsters.length;
        return result;
    }
    
    loadMonstersFromSaveFile(data) {
        this.monsters = [];
        for(var i=0;i<data["length"];i++) {
            var indvData = JSON.parse(data["monster"+i]);
            this.monsters.push(new Monster(indvData["name"], indvData["x"], indvData["y"], indvData["curHp"], indvData["curSta"]));
        }
    }
    
    //exploration
        
    getExplorationData() {
        var result = "";
        for(var i=0;i<this.explored.length;i++) {
            for(var j=0;j<this.explored[0].length;j++) {
                if(this.explored[i][j]) result += "1";
                else result += "0";
            }
        }
        return result
    }
    
    loadExplorationData(data) {
        for(var i=0;i<this.explored.length;i++) {
            for(var j=0;j<this.explored[0].length;j++) {
                var d = data.charAt(j+i*this.explored[0].length);
                if(d == "1") this.explored[i][j] = true;
                else this.explored[i][j] = false;
            }
        }
    }
}

Map.MAX_MONSTERS_PER_SQUARE = 3;
Map.MAX_MONSTER_MOVE_DIST = 4;

Map.NUM_REST_STEPS = 8;
Map.MINUTES_PER_REST_STEP = 60;