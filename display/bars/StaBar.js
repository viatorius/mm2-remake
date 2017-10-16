class StaBar{
    constructor(game, x, y, pc) {
        this.pc = pc;
        this.game = game;
        this.x = x;
        this.y = y;
        
        this.greenBit = this.game.add.graphics(x, y);
        this.greenBit.beginFill(0x00FF00);
        this.greenBit.moveTo(0,0);
        this.greenBit.lineTo(StaBar.WIDTH,0);
        this.greenBit.lineTo(StaBar.WIDTH,StaBar.HEIGHT);
        this.greenBit.lineTo(0,StaBar.HEIGHT);
        this.greenBit.lineTo(0,0);
        this.greenBit.endFill();
        
        this.blackBit = this.game.add.graphics(x, y);
        this.blackBit.beginFill(0x000000);
        this.blackBit.moveTo(0,0);
        this.blackBit.lineTo(StaBar.WIDTH,0);
        this.blackBit.lineTo(StaBar.WIDTH,StaBar.HEIGHT);
        this.blackBit.lineTo(0,StaBar.HEIGHT);
        this.blackBit.lineTo(0,0);
        this.blackBit.endFill();
        
        this.edge = this.game.add.graphics(x-1, y-1);
        this.edge.lineStyle(3, 0x000000, 1);
        this.edge.drawRect(0, 0, HpBar.WIDTH+2, HpBar.HEIGHT+2);
        
        this.reload();
    }
    
    reload() {
        this.blackBit.y = this.y;
        this.blackBit.scale.setTo(1, Math.max(0, (this.pc.maxSta-this.pc.curSta)/this.pc.maxSta));
        
        this.greenBit.y = this.y + (this.pc.maxSta-this.pc.curSta)/this.pc.maxSta * StaBar.HEIGHT;
        this.greenBit.scale.setTo(1, this.pc.curSta/this.pc.maxSta);
    }
}

StaBar.WIDTH = 6;
StaBar.HEIGHT = 32;