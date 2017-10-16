class Encounter {
    constructor(map, encounterWindow, mainFrame, viewDisplay) {
        this.cTarget = 0;
        
        this.map = map;
        this.map.updateMonsterGrid();
        this.monsters = [];
        
        this.encounterWindow = encounterWindow;
        this.mainFrame = mainFrame;
        this.viewDisplay = viewDisplay;
        
        for(var i=0;i<map.monsters.length;i++) {
            if(map.monsters[i].x == map.pcParty.x && map.monsters[i].y == map.pcParty.y) {
                this.monsters[map.monsters[i].stackPos] = map.monsters[i];
            }
        }
        
        for(var i=0;i<this.monsters.length; i++) {
            this.monsters[i].drawInitiative();
        }
        for(var i=0;i<this.map.pcParty.members.length; i++) {
            this.map.pcParty.members[i].drawInitiative();
        }
        this.buildInitiativeQueue();
    }
    
    buildInitiativeQueue() {
        console.log("build initiative queue!");
        this.initiativeQueue = [];
        for(var i=0;i<this.monsters.length+this.map.pcParty.members.length;i++) {
            var maxInit = 0;
            var argMaxInit = null;
            for(var j=0;j<this.monsters.length;j++) {
                if(this.monsters[j].initiative > maxInit && this.initiativeQueue.indexOf(this.monsters[j]) == -1) {
                    maxInit = this.monsters[j].initiative;
                    argMaxInit = this.monsters[j];
                }
            }
            for(var j=0;j<this.map.pcParty.members.length;j++) {
                if(this.map.pcParty.members[j].initiative > maxInit && this.initiativeQueue.indexOf(this.map.pcParty.members[j]) == -1) {
                    maxInit = this.map.pcParty.members[j].initiative;
                    argMaxInit = this.map.pcParty.members[j];
                }
            }
            this.initiativeQueue.push(argMaxInit);
        }
        for(var i=this.initiativeQueue.length-1;i>=0;i--) {
            if(!this.initiativeQueue[i].isActive()) this.initiativeQueue.splice(i, 1);
        }
        console.log("new initiative queue:");
        for(var i=0;i<this.initiativeQueue.length;i++) {
            console.log(this.initiativeQueue[i].name);
        }
    }
    
    concludeEncounter() {
        for(var i=0; i<this.map.pcParty.members.length; i++) {
            this.map.pcParty.members[i].calcStats();
        }
    }
    
    checkAgents() {
        console.log("check! ");
        for(var i=0; i<this.map.pcParty.members.length; i++) {
            if(this.map.pcParty.members[i].curHp <= 0 || this.map.pcParty.members[i].curSta <= 0) {
                var idx = this.initiativeQueue.indexOf(this.map.pcParty.members[i]);
                if(idx >= 0) {
                    this.initiativeQueue.splice(idx, 1);
                }
            }
        }
        
        for(var i=0; i<this.monsters.length; i++) {
            if(this.monsters[i].curHp <= 0 || this.monsters[i].curSta <= 0) {
                var mapIdx = this.map.monsters.indexOf(this.monsters[i]);
                this.map.monsters.splice(mapIdx, 1);
                var initIdx = this.initiativeQueue.indexOf(this.monsters[i]);
                if(initIdx>=0) this.initiativeQueue.splice(initIdx, 1);
                this.monsters.splice(i, 1);
                this.map.updateMonsterGrid();
                this.viewDisplay.updateView();
            }
        }
        
        if(this.cTarget >= this.monsters.length) this.cTarget = this.monsters.length-1;
        
        //all monster killed
        if(this.monsters.length == 0) {
            this.encounterWindow.setVisible(false);
            this.mainFrame.setActivePortrait(null);
            this.concludeEncounter();
        } else if(this.initiativeQueue.length == 0) {
            console.log("check for new monsters!");
            this.map.moveMonsters();
            this.map.updateMonsterGrid();
            for(var i=0;i<this.map.monsters.length;i++) {
                if(this.map.monsters[i].x == this.map.pcParty.x && this.map.monsters[i].y == this.map.pcParty.y) {
                    if(this.monsters.indexOf(this.map.monsters[i]) == -1) {
                        console.log("new monster added!");
                        this.monsters.push(this.map.monsters[i]);
                        this.map.monsters[i].drawInitiative();
                    }
                }
            }
            this.buildInitiativeQueue();
            this.viewDisplay.updateView();
        }
    }
    
    processTurn(action=null) {
        var agent = this.initiativeQueue[0];
        console.log("turn: "+agent.name+", "+agent.curHp+"/"+agent.maxHp+", "+agent.type+" - action: "+action);
        if(agent.type == "pc") {
            if(action == "strike") {
                if(agent.attack(this.monsters[this.cTarget], agent.strikeAttackBonus, agent.strikeDieNumber, agent.strikeDieType, agent.strikeDamageBonus, agent.strikeCritChance, agent.strikeCritMultiplier, "melee")) viewDisplay.playDamageEffect("physical", this.cTarget);
            } else if(action == "thrust") {
                if(agent.attack(this.monsters[this.cTarget], agent.thrustAttackBonus, agent.thrustDieNumber, agent.thrustDieType, agent.thrustDamageBonus, agent.thrustCritChance, agent.thrustCritMultiplier, "melee")) viewDisplay.playDamageEffect("physical", this.cTarget);
            } else if(action == "shoot") {
                agent.attack(this.monsters[this.cTarget], agent.shootAttackBonus, agent.shootDieNumber, agent.shootDieType, agent.shootDamageBonus, agent.shootCritChance, agent.shootCritMultiplier, "ranged");
                viewDisplay.playDamageEffect("missile arrow", agent.partyOrder);
            } else if(action == "switch") {
                agent.frontRow = !agent.frontRow;
            } else if(action == "block") {
                // todo
            } else if(action != null) {
                if(action.targetType == Spell.COMBAT) {
                    action.castSpell(agent, this.monsters[this.cTarget]); 
                }
            } else {
                this.mainFrame.setActivePortrait(agent);
                return;
            }
        } else if(agent.type == "monster") {
            for(var i=0;i<agent.nAttacks;i++) {
                if(!agent.attackGroup) {
                    var pick = agent.pickTarget(this.map.pcParty);
                    agent.attack(this.map.pcParty.members[pick], agent.attackBonus, agent.dieNumber, agent.dieType, agent.damageBonus, agent.critChance, agent.critMultiplier, agent.dmgType, agent.statusType, agent.statusProb);
                } else {
                    for(var i=0;i<this.map.pcParty.members.length;i++) {
                        if(this.map.pcParty.members[i].isActive()) {
                            agent.attack(this.map.pcParty.members[i], agent.attackBonus, agent.dieNumber, agent.dieType, agent.damageBonus, agent.critChance, agent.critMultiplier, agent.dmgType, agent.statusType, agent.statusProb);
                        }
                    }
                }
                if(this.map.pcParty.getActiveFrontRowSize() + this.map.pcParty.getActiveBackRowSize() == 0) {
                    console.log("party wiped out!");
                }
            }
        }
        console.log("proc");
        //if(agent.isActive()) {
            this.initiativeQueue.splice(0, 1);
            //this.initiativeQueue.push(agent);
        //}
        this.checkAgents();
        if(this.encounterWindow.visible) {
            this.encounterWindow.reload();
            this.mainFrame.reload();
            this.processTurn();
        }
    }
}