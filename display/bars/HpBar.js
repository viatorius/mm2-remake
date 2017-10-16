class HpBar{
    constructor(game, x, y, pc) {
        this.pc = pc;
        this.game = game;
        this.x = x;
        this.y = y;
        
        this.redBit = this.game.add.graphics(x, y);
        this.redBit.beginFill(0xFF0000);
        this.redBit.moveTo(0,0);
        this.redBit.lineTo(HpBar.WIDTH,0);
        this.redBit.lineTo(HpBar.WIDTH,HpBar.HEIGHT);
        this.redBit.lineTo(0,HpBar.HEIGHT);
        this.redBit.lineTo(0,0);
        this.redBit.endFill();
        
        this.blackBit = this.game.add.graphics(x, y);
        this.blackBit.beginFill(0x000000);
        this.blackBit.moveTo(0,0);
        this.blackBit.lineTo(HpBar.WIDTH,0);
        this.blackBit.lineTo(HpBar.WIDTH,HpBar.HEIGHT);
        this.blackBit.lineTo(0,HpBar.HEIGHT);
        this.blackBit.lineTo(0,0);
        this.blackBit.endFill();
        
        this.edge = this.game.add.graphics(x-1, y-1);
        this.edge.lineStyle(3, 0x000000, 1);
        this.edge.drawRect(0, 0, HpBar.WIDTH+2, HpBar.HEIGHT+2);
        
        this.reload();
    }
    
    reload() {
        this.blackBit.y = this.y;
        this.blackBit.scale.setTo(1, Math.max(0, (this.pc.maxHp-this.pc.curHp)/this.pc.maxHp));
        
        this.redBit.y = this.y + (this.pc.maxHp-this.pc.curHp)/this.pc.maxHp * HpBar.HEIGHT;
        this.redBit.scale.setTo(1, this.pc.curHp/this.pc.maxHp);
    }
}

HpBar.WIDTH = 6;
HpBar.HEIGHT = 32;