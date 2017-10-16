class Agent{
    constructor(name, type) {
        this.name = name;
        this.type = type;
                
        this.curHp = 0;
        this.maxHp = 0;
        this.curSta = 0;
        this.maxSta = 0;
        
        this.dodgeAC = 0;
        this.shieldAC = 0;
        this.armourAC = 0;
        
        this.initiative = 0;
        
        this.nAttacks = 1;
    }
    
    doDamage(agent, hpDmg, staDmg, dtype) {
        agent.curHp -= hpDmg;
        agent.curSta -= staDmg;
    }
    
    attack(agent, ab, nd, td, pd, cc, cm, dtype, statustype="", statusprob=0) {
        var dieroll = Math.ceil(20*Math.random())+ab;
        var dmg = nd*Math.ceil(td*Math.random())+pd;
        var critU = Math.random();
        if(critU < cc) {
            dmg *= cm;
        }
        var statusDmg = false;
        if(Math.random() < statusprob) {
            statusDmg = true;
        }
        console.log("attack! "+dieroll+" vs "+agent.dodgeAC+", dmg:"+dmg);
        if(dieroll > agent.dodgeAC) {
            if(dieroll > agent.shieldAC) {
                if(dieroll > agent.armourAC) {
                    this.doDamage(agent, dmg, 0, dtype);
                    if(statusDmg && statustype == "poison") {
                        agent.addStatus("poisoned", 1);
                    }
                } else {
                    this.doDamage(agent, 0, 0.5*dmg, dtype);
                }
            } else {
                this.doDamage(agent, 0, 0.25*dmg, dtype);
            }
            // hit! 
            if(this.type == "pc" && dtype == "melee") {this.strengthPrg += 1;}
            if(agent.type == "pc") {
                if(dtype == "melee") agent.endurancePrg += 0.75;
                else  agent.endurancePrg += 1.5;
            }
            if(this.type == "pc" && critU < cc) {this.agilityPrg += 1;}
            return true;
        } else {
            // dodged! agi up x1
            if(agent.type == "pc") {agent.agilityPrg += 1;}
        }
        return false;
    }
        
    isActive() {
        return this.curHp > 0 && this.curSta > 0;
    }
    
    drawInitiative() {
        this.initiative = this.agility + 5*Math.random();
    }
}