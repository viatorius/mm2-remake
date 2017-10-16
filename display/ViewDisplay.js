class ViewDisplay {
    constructor(game, party) {
        this.game = game;
        this.pcParty = party;
        this.tiles = [];
        this.viewRoofTrps = [];
        this.viewMiscFeatures = [];
        this.viewTerrainFeatures = [];
        this.viewHzWalls = [];
        this.viewVtWalls = [];
        this.monsters = [];
        this.ceilings = [];
        this.damageEffectSprite;
        this.missiles = [];
        this.missileTimer = 0;
        this.missilesActive = [];
        
        this.ceilings = [];
        for(var i=0;i<ViewDisplay.CEILING_NAMES.length; i++) {
            this.ceilings.push(this.game.add.sprite(0, 0, ViewDisplay.CEILING_NAMES[i]));
        }

    }
    
    updateView() {
        var map = this.pcParty.cMap;
        // ceiling
        for(var k=0;k<this.ceilings.length;k++) {
            var mX = map.pcParty.x;
            var mY = map.pcParty.y;
            if(mX <0 || mX >= map.terrain.length || mY <0 || mY >= map.terrain[0].length) {
                if(k == 0) this.ceilings[k].visible = true;
                else this.ceilings[k].visible = false;
            } else {
                if(TerrainData.DATA[map.terrain[map.pcParty.x][map.pcParty.y]][2] == ViewDisplay.CEILING_NAMES[k]) {
                    this.ceilings[k].visible = true;
                } else {
                    this.ceilings[k].visible = false;
                }
            }
        }
        // ground
        for(var i=-(ViewDisplay.N-1)/2;i<=(ViewDisplay.N-1)/2;i++) {
            for(var j=0;j<ViewDisplay.N2;j++) {
                this.updateViewElements(i, j);
            }
        }
    }
    
    updateViewElements(i, j) {
        var map = this.pcParty.cMap;
        var z = 1; 
        if(i<0) z = 0;
        var mX, mY;
        if(map.pcParty.dir == 0) {mX = map.pcParty.x+i; mY = map.pcParty.y-j;}
        if(map.pcParty.dir == 1) {mX = map.pcParty.x+j; mY = map.pcParty.y+i;}
        if(map.pcParty.dir == 2) {mX = map.pcParty.x-i; mY = map.pcParty.y+j;}
        if(map.pcParty.dir == 3) {mX = map.pcParty.x-j; mY = map.pcParty.y-i;}
        
        if(mX <0 || mX >= map.terrain.length || mY <0 || mY >= map.terrain[0].length) {
             // walking outside the map can be possible for debug purposes
            this.tiles[ViewDisplay.N2-1-j][i+(ViewDisplay.N-1)/2].frame = 0;
            this.viewMiscFeatures[ViewDisplay.N2-1-j][i+(ViewDisplay.N-1)/2].visible = false;
            this.viewTerrainFeatures[ViewDisplay.N2-1-j][i+(ViewDisplay.N-1)/2].visible = false;    
            for(var k=0;k<Map.MAX_MONSTERS_PER_SQUARE;k++) {
                this.monsters[ViewDisplay.N2-1-j][i+(ViewDisplay.N-1)/2][k].visible = false;
            }
        } else {
            // terrain
            this.tiles[ViewDisplay.N2-1-j][i+(ViewDisplay.N-1)/2].frame = map.terrain[mX][mY];
            // features
            this.viewMiscFeatures[ViewDisplay.N2-1-j][i+(ViewDisplay.N-1)/2].visible = false;
            if(map.eventGrid[mX][mY] > 0) {
                if(mX != map.pcParty.x || mY != map.pcParty.y || map.pcParty.resetEventDirection == map.pcParty.dir) {
                    this.viewMiscFeatures[ViewDisplay.N2-1-j][i+(ViewDisplay.N-1)/2].frame = map.eventGrid[mX][mY];
                    this.viewMiscFeatures[ViewDisplay.N2-1-j][i+(ViewDisplay.N-1)/2].visible = true;
                }
            }
            if(TerrainData.DATA[map.terrain[mX][mY]][3] > 0) {
                this.viewTerrainFeatures[ViewDisplay.N2-1-j][i+(ViewDisplay.N-1)/2].visible = true;
                this.viewTerrainFeatures[ViewDisplay.N2-1-j][i+(ViewDisplay.N-1)/2].frame = TerrainData.DATA[map.terrain[mX][mY]][3]-1;
            } else this.viewTerrainFeatures[ViewDisplay.N2-1-j][i+(ViewDisplay.N-1)/2].visible = false;
            // monsters
            for(var k=0;k<Map.MAX_MONSTERS_PER_SQUARE;k++) {
                if(map.monsterGrid[mX][mY] > k) {
                    this.monsters[ViewDisplay.N2-1-j][i+(ViewDisplay.N-1)/2][k].visible = true;
                    this.updateMonster(this.monsters[ViewDisplay.N2-1-j][i+(ViewDisplay.N-1)/2][k], mX, mY, j, k);
                } else {
                    this.monsters[ViewDisplay.N2-1-j][i+(ViewDisplay.N-1)/2][k].visible = false;
                }
            }
        }
        
        // walls
        if(map.pcParty.dir == 2) {mX++;}
        if(map.pcParty.dir == 3) {mY++;}

        //for(var k=1;k<WallData.DATA.length;k++) { // k starts at 1 because if '0' then not displayed
            this.viewVtWalls[ViewDisplay.N2-1-j][i+(ViewDisplay.N-1)/2].visible = false;
            if((map.pcParty.dir == 0 || map.pcParty.dir == 2) && mX >= 0 && mY >= 0 && mX < map.vtWalls.length && mY < map.vtWalls[0].length) {
                if(map.vtWalls[mX][mY] > 0) {
                    this.viewVtWalls[ViewDisplay.N2-1-j][i+(ViewDisplay.N-1)/2].visible = true;
                    this.viewVtWalls[ViewDisplay.N2-1-j][i+(ViewDisplay.N-1)/2].tint = WallData.DATA[map.vtWalls[mX][mY]][1];
                }
            }
            if((map.pcParty.dir == 1 || map.pcParty.dir == 3) && mX >= 0 && mY >= 0 && mX < map.hzWalls.length && mY < map.hzWalls[0].length) {
                if(map.hzWalls[mX][mY] > 0) {
                    this.viewVtWalls[ViewDisplay.N2-1-j][i+(ViewDisplay.N-1)/2].visible = true;
                    this.viewVtWalls[ViewDisplay.N2-1-j][i+(ViewDisplay.N-1)/2].tint = WallData.DATA[map.hzWalls[mX][mY]][1];
                }
            }
        //}
        
        if(map.pcParty.dir == 1) {mX++;}
        if(map.pcParty.dir == 2) {mX--; mY++;}
        if(map.pcParty.dir == 3) {mY--;}
        
        //for(var k=1;k<WallData.DATA.length;k++) { // k starts at 1 because if '0' then not displayed
            this.viewHzWalls[ViewDisplay.N2-1-j][i+(ViewDisplay.N-1)/2].visible = false;
            if((map.pcParty.dir == 0 || map.pcParty.dir == 2) && mX >= 0 && mY >= 0 && mX < map.hzWalls.length && mY < map.hzWalls[0].length) {
                if(map.hzWalls[mX][mY] > 0) {
                    this.viewHzWalls[ViewDisplay.N2-1-j][i+(ViewDisplay.N-1)/2].visible = true;
                    this.viewHzWalls[ViewDisplay.N2-1-j][i+(ViewDisplay.N-1)/2].tint = WallData.DATA[map.hzWalls[mX][mY]][1]; 
                }
            }
            if((map.pcParty.dir == 1 || map.pcParty.dir == 3) && mX >= 0 && mY >= 0 && mX < map.vtWalls.length && mY < map.vtWalls[0].length) {
                if(map.vtWalls[mX][mY] > 0) {
                    this.viewHzWalls[ViewDisplay.N2-1-j][i+(ViewDisplay.N-1)/2].visible = true;
                    this.viewHzWalls[ViewDisplay.N2-1-j][i+(ViewDisplay.N-1)/2].tint = WallData.DATA[map.vtWalls[mX][mY]][1];
                }
            }
        //}
    }
    
    createHorizontalWall(i, j, k) {
        var scl = (ViewDisplay.trapX(i+1,j)-ViewDisplay.trapX(i,j))/(ViewDisplay.trapX(i+1,ViewDisplay.N2-1)-ViewDisplay.trapX(i,ViewDisplay.N2-1));
        //var scl = Math.pow(ViewDisplay.SHRINK_FACTOR,ViewDisplay.N2-j-2);
        //console.log(i+", "+j+", "+ViewDisplay.trapY(j)+", "+ViewDisplay.H+", "+scl+", "+(ViewDisplay.trapY(j) - 2*(ViewDisplay.H - ViewDisplay.trapY(j))));
        var wall = this.game.add.graphics(ViewDisplay.VIEW_BX, ViewDisplay.VIEW_BY);
        var col = 0xFFFFFF;
        
        wall.beginFill(col);
        wall.lineStyle(1, 0x000000, 1); // for debugging
        wall.moveTo(ViewDisplay.trapX(i,j),-ViewDisplay.trapY(j));
        //wall.lineTo(ViewDisplay.trapX(i,j),-(ViewDisplay.trapY(j) + 2*(ViewDisplay.H - ViewDisplay.trapY(j))));
        //wall.lineTo(ViewDisplay.trapX(i+1,j),-(ViewDisplay.trapY(j) + 2*(ViewDisplay.H - ViewDisplay.trapY(j)))); 
        wall.lineTo(ViewDisplay.trapX(i,j),-ViewDisplay.trapY(j)-ViewDisplay.WALL_HEIGHT*scl);
        wall.lineTo(ViewDisplay.trapX(i+1,j),-ViewDisplay.trapY(j)-ViewDisplay.WALL_HEIGHT*scl); 
        wall.lineTo(ViewDisplay.trapX(i+1,j),-ViewDisplay.trapY(j));
        wall.lineTo(ViewDisplay.trapX(i,j),-ViewDisplay.trapY(j));
        wall.endFill();
        
        //var scl = Math.pow(0.5,j-1);
        //wall.scale.setTo(scl, scl);
        
        //console.log(i);
        this.viewHzWalls[j][i] = wall;
        //console.log(i+", "+j+", "+scl+", "+wall.width+", "+wall.height+", "+(wall.width/wall.height));
        //console.log("aaa "+this.viewHzWalls[0][0][0].visible);
    }
    
    createVerticalWall(i, j, k) {
        var scl1 = (ViewDisplay.trapX(i+1,j)-ViewDisplay.trapX(i,j))/(ViewDisplay.trapX(i+1,ViewDisplay.N2-1)-ViewDisplay.trapX(i,ViewDisplay.N2-1));
        var scl2 = (ViewDisplay.trapX(i+1,j+1)-ViewDisplay.trapX(i,j+1))/(ViewDisplay.trapX(i+1,ViewDisplay.N2-1)-ViewDisplay.trapX(i,ViewDisplay.N2-1));
        //var scl1 = Math.pow(ViewDisplay.SHRINK_FACTOR,ViewDisplay.N2-j-3);
        //var scl2 = Math.pow(ViewDisplay.SHRINK_FACTOR,ViewDisplay.N2-j-2);
        var wall = this.game.add.graphics(ViewDisplay.VIEW_BX, ViewDisplay.VIEW_BY);
        var col = 0xFFFFFF;
        
        wall.beginFill(col);
        wall.lineStyle(1, 0x000000, 1); // for debugging
        wall.moveTo(ViewDisplay.trapX(i,j),-ViewDisplay.trapY(j));
        wall.lineTo(ViewDisplay.trapX(i,j+1),-ViewDisplay.trapY(j+1));
        wall.lineTo(ViewDisplay.trapX(i,j+1),-ViewDisplay.trapY(j+1)-ViewDisplay.WALL_HEIGHT*scl2); 
        wall.lineTo(ViewDisplay.trapX(i,j),-ViewDisplay.trapY(j)-ViewDisplay.WALL_HEIGHT*scl1);
        //wall.lineTo(ViewDisplay.trapX(i,j+1),-(ViewDisplay.trapY(j+1) + 2*(ViewDisplay.H - ViewDisplay.trapY(j+1)))); 
        //wall.lineTo(ViewDisplay.trapX(i,j),-(ViewDisplay.trapY(j) + 2*(ViewDisplay.H - ViewDisplay.trapY(j))));
        wall.lineTo(ViewDisplay.trapX(i,j),-ViewDisplay.trapY(j));
        wall.endFill();
        
        //var scl = Math.pow(0.5,j-1);
        //wall.scale.setTo(scl, scl);
        
        //console.log(i);
        this.viewVtWalls[j][i] = wall;
        if(k == 0) wall.visible = false;
        //console.log("aaa "+this.viewHzWalls[0][0][0].visible);
    }
    
    createFeature(i, j, ftArray, type) {
        //var scl = Math.pow(ViewDisplay.SHRINK_FACTOR,ViewDisplay.N2-j-2);
        //var scl = 1.35*(ViewDisplay.trapX(i+1,j)-ViewDisplay.trapX(i,j))/(ViewDisplay.trapX(i+1,ViewDisplay.N2-1)-ViewDisplay.trapX(i,ViewDisplay.N2-1));
        var scl = 1.65*(ViewDisplay.trapX(i+1,j)-ViewDisplay.trapX(i,j)+ViewDisplay.trapX(i+1,j+1)-ViewDisplay.trapX(i,j+1))/(ViewDisplay.trapX(i+1,ViewDisplay.N2-1)-ViewDisplay.trapX(i,ViewDisplay.N2-1)+ViewDisplay.trapX(i+1,ViewDisplay.N2)-ViewDisplay.trapX(i,ViewDisplay.N2));
        //console.log(i+", "+j+", "+scl);
        var xx = ViewDisplay.VIEW_BX+(ViewDisplay.trapX(i,j) + ViewDisplay.trapX(i+1,j) + ViewDisplay.trapX(i,j+1) + ViewDisplay.trapX(i+1,j+1))/4; 
        var yy = ViewDisplay.VIEW_BY - (ViewDisplay.trapY(j+1));// - (ViewDisplay.trapY(j) - ViewDisplay.trapY(j+1))/2;
        if(j == ViewDisplay.N2-1) {
            yy -= 65;
            //scl *= 0.9;
        }
        
        //terrDoodad.duplicateMovieClip("terrDoodad"+k+Math.abs(i)+(j),terrDoodad._parent.getNextHighestDepth());
        //ft = eval("terrDoodad"+k+Math.abs(i)+(j));
        
        var ft = this.game.add.sprite(xx, yy, type);
        ft.x -= scl*ft.width/2;
        ft.y -= scl*ft.height;
        
        ft.scale.setTo(scl, scl);
        //console.log(i+", "+j+", "+xx+", "+yy);
        ftArray[j][i] = ft;
    }
    
    updateMonster(monsterIcon, xx, yy, j, k) {
        var map = this.pcParty.cMap;
        var monster = map.getMonster(xx, yy, k);
        if(j == 0) monsterIcon.animations.play("base"+monster.monsterType);
        else monsterIcon.animations.play("still"+monster.monsterType);
        
    }
    
    addAnimations(monsterSprite) {
        for(var i=0;i<MonsterData.DATA.length;i++) {
            var animSeq = new Array(MonsterData.DATA[i][4].length);
            for(var j=0;j<MonsterData.DATA[i][4].length;j++) {
                animSeq[j] = MonsterData.DATA[i][4][j] + 2*i;
            }
            //console.log(i+" "+animSeq);
            monsterSprite.animations.add("base"+i, animSeq, 5, true);
            monsterSprite.animations.add("still"+i, [2*i]);
        }
    }
    
    createMonster(i, j, k) {
        var dx=0, dy=0;
        dx = -(2*(k%2)-1)*Math.floor((k+1)/2)*12; 
        dy = -4*k;
        var scl = 3*Math.pow(ViewDisplay.SHRINK_FACTOR,ViewDisplay.N2-j-2);
        var xx = ViewDisplay.VIEW_BX+(ViewDisplay.trapX(i,j) + ViewDisplay.trapX(i+1,j))/2 + dx*scl; 
        var yy = ViewDisplay.VIEW_BY-ViewDisplay.trapY(j) + dy*scl;
        if(j == ViewDisplay.N2-1) {
            yy -= 16;
        }
        
        var monster = this.game.add.sprite(xx, yy, 'monsters');
        monster.x -= scl*monster.width/2;
        monster.y -= scl*monster.height/2;
        this.addAnimations(monster);
        monster.scale.setTo(scl, scl);
        this.monsters[j][i][k] = monster;
    }
    
    createViewObjects() {
        this.viewMiscFeatures = new Array(ViewDisplay.N2);
        this.viewTerrainFeatures = new Array(ViewDisplay.N2);
        this.monsters = new Array(ViewDisplay.N2);
        this.viewVtWalls = new Array(ViewDisplay.N2);
        this.viewHzWalls = new Array(ViewDisplay.N2);
        for(var j=0;j<ViewDisplay.N2;j++) {
            this.viewMiscFeatures[j] = new Array(ViewDisplay.N);
            this.viewTerrainFeatures[j] = new Array(ViewDisplay.N);
            this.monsters[j] = new Array(ViewDisplay.N);
            this.viewVtWalls[j] = new Array(ViewDisplay.N);
            this.viewHzWalls[j] = new Array(ViewDisplay.N);
            for(var i=-(ViewDisplay.N-1)/2;i<=(ViewDisplay.N-1)/2;i++) {
                this.createHorizontalWall(i+(ViewDisplay.N-1)/2, j);
                this.createFeature(i+(ViewDisplay.N-1)/2, j, this.viewMiscFeatures, 'events');
                this.createFeature(i+(ViewDisplay.N-1)/2, j, this.viewTerrainFeatures, 'terrain');
                this.monsters[j][i+(ViewDisplay.N-1)/2] = new Array(Map.MAX_MONSTERS_PER_SQUARE);
                for(var k=Map.MAX_MONSTERS_PER_SQUARE-1;k>=0;k--) {
                    this.createMonster(i+(ViewDisplay.N-1)/2, j, k);
                }
                this.createVerticalWall(i+(ViewDisplay.N-1)/2, j);
            }
        }
        
        this.damageEffectSprite = this.game.add.sprite(0, 0, "damageEffect");
        this.damageEffectSprite.scale.setTo(2, 2);
        this.damageEffectSprite.animations.add("physical", [1, 2, 3, 0], 15, false);
        
        this.missiles = new Array(Party.PC_PARTY_SIZE);
        for(var i=0;i<Party.PC_PARTY_SIZE;i++) {
            this.missiles[i] = this.game.add.sprite(0, 0, "missiles");
        }
        this.missileActive = new Array(Party.PC_PARTY_SIZE);
        
        this.updateView();
        this.updateMissile();
    }
    
    playDamageEffect(damageType, idx) {
        if(damageType == "physical") {
            this.damageEffectSprite.x = this.monsters[ViewDisplay.N2-1][(ViewDisplay.N-1)/2][idx].x;
              + this.monsters[ViewDisplay.N2-1][(ViewDisplay.N-1)/2][idx].width/3;
            this.damageEffectSprite.y = this.monsters[ViewDisplay.N2-1][(ViewDisplay.N-1)/2][idx].y;
              + this.monsters[ViewDisplay.N2-1][(ViewDisplay.N-1)/2][idx].height/3;
            this.damageEffectSprite.play(damageType);
        } else if(damageType == "missile arrow") {
            this.missileTimer = ViewDisplay.MAX_MISSILE_TIMER;
            this.missileActive[idx] = true;
            this.missiles[idx].visible = true;
            this.missiles[idx].frame = 0;
        }
    }
    
    updateMissile() {
        if(this.missileTimer>0) {
            var scl = 2.5*(1+this.missileTimer/ViewDisplay.MAX_MISSILE_TIMER);
            for(var i=0;i<Math.floor(Party.PC_PARTY_SIZE/2);i++) {
                if(this.missileActive[i]) {
                    this.missiles[i].x = 50 + 100*(ViewDisplay.MAX_MISSILE_TIMER-this.missileTimer)/ViewDisplay.MAX_MISSILE_TIMER;
                    this.missiles[i].y = 100;
                    this.missiles[i].scale.setTo(scl, scl);
                }
            }
            for(var i=Math.floor(Party.PC_PARTY_SIZE/2);i<Party.PC_PARTY_SIZE;i++) {
                if(this.missileActive[i]) {
                    this.missiles[i].x = 250 - 100*(ViewDisplay.MAX_MISSILE_TIMER-this.missileTimer)/ViewDisplay.MAX_MISSILE_TIMER;
                    this.missiles[i].y = 100;
                    this.missiles[i].scale.setTo(-scl, scl);
                }
            }
            this.missileTimer--;
        } else {
            this.missileActive = new Array(Party.PC_PARTY_SIZE);
            for(var i=0;i<Party.PC_PARTY_SIZE;i++) {
                this.missiles[i].visible = false;
            }
        }
    }
}

ViewDisplay.SQ_WIDTH = 20;
ViewDisplay.FT_WIDTH = 32;
ViewDisplay.FT_HEIGHT = 28;

ViewDisplay.VIEW_WIDTH = 28;
ViewDisplay.VIEW_HEIGHT = 7;

ViewDisplay.C = 5900*4;
ViewDisplay.H = 1000*4;
ViewDisplay.O = 1010*4;
ViewDisplay.N = 7;
ViewDisplay.N2 = 6;

ViewDisplay.VIEW_BX = -ViewDisplay.C+218; //400
ViewDisplay.VIEW_BY = ViewDisplay.H+124; //200
ViewDisplay.SHRINK_FACTOR = 0.65;
ViewDisplay.WALL_HEIGHT = 175;

ViewDisplay.CEILING_NAMES = ['sky', 'caveCeiling'];

ViewDisplay.MAX_MISSILE_TIMER = 40;

    
ViewDisplay.trapX = function(j, i) {
    return ViewDisplay.C*(2*ViewDisplay.O*j - i*ViewDisplay.H +ViewDisplay.H*ViewDisplay.N -2*ViewDisplay.H*j)/(ViewDisplay.N*ViewDisplay.O-ViewDisplay.H*i);
}

ViewDisplay.trapY = function(j) {
    return (j-ViewDisplay.N)*ViewDisplay.O*ViewDisplay.H/(ViewDisplay.H*j - ViewDisplay.O*ViewDisplay.N);
}

/*
f_0 = [0,0 -> C,O] = O/C * x
f_1 = [2*C/N -> C,O] -> a = O/(C-2*C/N), b = -O*2*C/N/(C-2*C/N)
..
f_j = [j*2*C/N -> C,0] -> a = O/(C-j*2*C/N), b = -O*j*2*C/N/(C-j*2*C/N)
...
f_N = [2*C,0 -> C,O] = solve(a*2*C + b = 0, a*C + b = O)  a = O/(C-2*C), b = -O*2*C/(C-2*C)

f_0(x, y) = H -> O/C * x = H -> x = H*C/O

f_Z = [H*C/O,H -> 2*C,0] solve(a*H*C/O + b = H, a*2*C + b = 0) -> b = -2*a*C
            -> a*H*C/O -2*a*C = H -> a * (H*C/O - 2*C) = H -> a = 1/(C/O - 2*C/H)
            -> b = -2*H/(H/O - 2)
            
f_y = (j-N)*O*H/(H*j - O*N)

x(i,j) = C*(2*O*j - i*H +H*N -2*H*j)/(N*O-H*i)
*/
