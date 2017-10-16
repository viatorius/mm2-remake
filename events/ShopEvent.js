class ShopEvent extends MapEvent {
    constructor(map, x, y, recurring, farAppearance, nearAppearance, message, shopType, buyCostMultiplier) {
        super(map, x, y, recurring, farAppearance, nearAppearance, [message], "shop");
        this.shopWindow = null;
        this.shopType = shopType;
        this.inventory = [];
        this.lastVisitTime = -100000;
        this.buyCostMultiplier = buyCostMultiplier;
    }
    
    processEvent(map, eventWindow) {
        eventWindow.setVisible(false);
        this.shopWindow.setVisible(true);
        //reload inventory every week
        if(Math.floor(this.lastVisitTime / 60) < Math.floor(map.pcParty.minutesSpent/60)) {
            this.loadInventory();
        }
        this.shopWindow.loadShop(this, map.pcParty);
        super.processEvent(map, eventWindow);
        this.lastVisitTime = map.pcParty.minutesSpent;
    }
    
    loadInventory() {
        this.inventory = [];
        if(this.shopType == "basic") {
            this.inventory.push(new EquipItem("dagger"));
            this.inventory.push(new EquipItem("light mace"));
            this.inventory.push(new EquipItem("padded jack"));
            this.inventory.push(new EquipItem("buckler"));
            this.inventory.push(new EquipItem("potion", 0, "of health"));
            this.inventory.push(new EquipItem("potion", 1, "of health"));
            this.inventory.push(new EquipItem("flask", 0, "of vitality"));
            this.inventory.push(new EquipItem("torch"));
        }
    }
}