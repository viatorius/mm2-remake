class PcInfoWindow extends Window {
    constructor(game, x, y, mainFrame) {
        super(game, x, y, 400, 205);
        this.pc = null;
        this.cSubWindow = 0;
        
        this.equipmentDrag = false;
        this.inventoryDrag = false;
        this.consumeDrag = false;
        this.spellDrag = false;
        this.startDragX = -1;
        this.startDragY = -1;
        
        this.timeSinceLastClick = 0;
        this.mouseMoved = false;
        this.mousePressX;
        this.mousePressY;
        this.create();
        
        this.quickActionSelectWindow;
        this.mainFrame = mainFrame;
    }
    
    create() {
        this.buttons.push(new TextButton(this.game, this.x+374, this.y+6, 20, 20, "X", this.closeWindow, this));
        
        this.buttons.push(new TextButton(this.game, this.x+49, this.y+176, 100, 20, "set q. action", this.setQAction, this));
        this.buttons.push(new TextButton(this.game, this.x+159, this.y+176, 78, 20, "overview", this.reloadOverview, this));
        this.buttons.push(new TextButton(this.game, this.x+246, this.y+176, 53, 20, "spells", this.reloadSpells, this));
        this.buttons.push(new TextButton(this.game, this.x+308, this.y+176, 80, 20, "inventory", this.reloadInventory, this));
        
        this.texts.push(this.game.add.text(this.x+8, this.y+6, "name", Window.TEXT_STYLE));
        
        // basic info
        this.texts.push(this.game.add.text(this.x+8, this.y+26, "str:", Window.TEXT_STYLE));
        this.texts.push(this.game.add.text(this.x+8, this.y+46, "agi:", Window.TEXT_STYLE));
        this.texts.push(this.game.add.text(this.x+8, this.y+66, "end:", Window.TEXT_STYLE));
        this.texts.push(this.game.add.text(this.x+8, this.y+86, "int:", Window.TEXT_STYLE));
        this.texts.push(this.game.add.text(this.x+8, this.y+106, "cha:", Window.TEXT_STYLE));
        this.texts.push(this.game.add.text(this.x+8, this.y+133, "HP:", Window.TEXT_STYLE));
        this.texts.push(this.game.add.text(this.x+8, this.y+153, "Sta:", Window.TEXT_STYLE));
        
        this.texts.push(this.game.add.text(this.x+48, this.y+26, "---", Window.TEXT_STYLE));
        this.texts.push(this.game.add.text(this.x+48, this.y+46, "---", Window.TEXT_STYLE));
        this.texts.push(this.game.add.text(this.x+48, this.y+66, "---", Window.TEXT_STYLE));
        this.texts.push(this.game.add.text(this.x+48, this.y+86, "---", Window.TEXT_STYLE));
        this.texts.push(this.game.add.text(this.x+48, this.y+106, "---", Window.TEXT_STYLE));
        this.texts.push(this.game.add.text(this.x+48, this.y+133, "---", Window.TEXT_STYLE));
        this.texts.push(this.game.add.text(this.x+48, this.y+153, "---", Window.TEXT_STYLE));
        
        // item-dependent info
        
        this.texts.push(this.game.add.text(this.x+120, this.y+26, "ddg:", Window.TEXT_STYLE));
        this.texts.push(this.game.add.text(this.x+120, this.y+46, "shld:", Window.TEXT_STYLE));
        this.texts.push(this.game.add.text(this.x+120, this.y+66, "armr:", Window.TEXT_STYLE));
        this.texts.push(this.game.add.text(this.x+120, this.y+93, "#att:", Window.TEXT_STYLE));
        this.texts.push(this.game.add.text(this.x+120, this.y+113, "strk:", Window.TEXT_STYLE));
        this.texts.push(this.game.add.text(this.x+120, this.y+133, "thrst:", Window.TEXT_STYLE));
        this.texts.push(this.game.add.text(this.x+120, this.y+153, "shot:", Window.TEXT_STYLE));
        
        this.texts.push(this.game.add.text(this.x+168, this.y+26, "---", Window.TEXT_STYLE));
        this.texts.push(this.game.add.text(this.x+168, this.y+46, "---", Window.TEXT_STYLE));
        this.texts.push(this.game.add.text(this.x+168, this.y+66, "---", Window.TEXT_STYLE));
        this.texts.push(this.game.add.text(this.x+168, this.y+93, "---", Window.TEXT_STYLE));
        this.texts.push(this.game.add.text(this.x+168, this.y+113, "---", Window.TEXT_STYLE));
        this.texts.push(this.game.add.text(this.x+168, this.y+133, "---", Window.TEXT_STYLE));
        this.texts.push(this.game.add.text(this.x+168, this.y+153, "---", Window.TEXT_STYLE));
        
        this.texts.push(this.game.add.text(this.x+232, this.y+6, "exp:", Window.TEXT_STYLE));
        this.texts.push(this.game.add.text(this.x+290, this.y+6, "---", Window.TEXT_STYLE));
        
        this.classIcons = [];
        for(var i=0;i<Pc.MAX_CLASS_LEVELS;i++) {
            this.classIcons.push(this.game.add.sprite(this.x+295 + (i%2)*34, this.y+32+Math.floor(i/2)*34, 'class'));
        }
        
        this.icons.push(this.game.add.sprite(this.x+PcInfoWindow.ICON_BASE_X+1*PcInfoWindow.ICON_DIST, this.y+PcInfoWindow.ICON_BASE_Y+0*PcInfoWindow.ICON_DIST, 'item')); // head
        this.icons.push(this.game.add.sprite(this.x+PcInfoWindow.ICON_BASE_X+0*PcInfoWindow.ICON_DIST, this.y+PcInfoWindow.ICON_BASE_Y+1*PcInfoWindow.ICON_DIST, 'item')); // left hand weapon
        this.icons.push(this.game.add.sprite(this.x+PcInfoWindow.ICON_BASE_X+1*PcInfoWindow.ICON_DIST, this.y+PcInfoWindow.ICON_BASE_Y+1*PcInfoWindow.ICON_DIST, 'item')); // ranged
        this.icons.push(this.game.add.sprite(this.x+PcInfoWindow.ICON_BASE_X+2*PcInfoWindow.ICON_DIST, this.y+PcInfoWindow.ICON_BASE_Y+1*PcInfoWindow.ICON_DIST, 'item')); // right hand weapon
        this.icons.push(this.game.add.sprite(this.x+PcInfoWindow.ICON_BASE_X+0*PcInfoWindow.ICON_DIST, this.y+PcInfoWindow.ICON_BASE_Y+2*PcInfoWindow.ICON_DIST, 'item')); // left hand ring
        this.icons.push(this.game.add.sprite(this.x+PcInfoWindow.ICON_BASE_X+1*PcInfoWindow.ICON_DIST, this.y+PcInfoWindow.ICON_BASE_Y+2*PcInfoWindow.ICON_DIST, 'item')); // torso
        this.icons.push(this.game.add.sprite(this.x+PcInfoWindow.ICON_BASE_X+2*PcInfoWindow.ICON_DIST, this.y+PcInfoWindow.ICON_BASE_Y+2*PcInfoWindow.ICON_DIST, 'item')); // right hand ring
        this.icons.push(this.game.add.sprite(this.x+PcInfoWindow.ICON_BASE_X+1*PcInfoWindow.ICON_DIST, this.y+PcInfoWindow.ICON_BASE_Y+3*PcInfoWindow.ICON_DIST, 'item')); // feet
        
        this.inventoryList = new InventoryList(this.x+PcInfoWindow.ICON_BASE_X2, this.y+3+PcInfoWindow.ICON_BASE_Y2, this, this.game, PcInfoWindow.INVENTORY_LIST_SIZE);
        
        this.spellList = new SpellList(this.x+PcInfoWindow.ICON_BASE_X, this.y+3+PcInfoWindow.ICON_BASE_Y2, this, this.game, PcInfoWindow.INVENTORY_LIST_SIZE);
               
        // carry weight texts:
        this.texts.push(this.game.add.text(this.x+220, this.y+10, "carrying: ", Window.TEXT_STYLE));
        this.texts.push(this.game.add.text(this.x+300, this.y+10, "0/0", Window.TEXT_STYLE));
        
        // discard square
        this.discardBox = new TextBox(this.game, this.x+25, this.y+168, 66, 24, "discard");
        
        // cast square
        this.castBox = new TextBox(this.game, this.x+275, this.y+82, 66, 40, "cast", 4);
        
        // drag icon
        this.dragIcon = this.game.add.sprite(0, 0, 'item');
        this.dragIcon.alpha = 0.5;
        this.dragIcon.visible = false;
        this.dragItem = null;
        this.dragItemSlot = -1;
        this.validDragSlots = new Array(8);
        
        // spell icon
        this.dragSpellIcon = this.game.add.sprite(0, 0, 'spellIcon');
        this.dragSpellIcon.alpha = 0.75;
        this.dragSpellIcon.visible = false;
        this.dragSpellIcon.scale.setTo(2, 2);
        this.dragSpell = null;
    }
    
    closeWindow() {
        this.window.setVisible(false);
        this.window.quickActionSelectWindow.setVisible(false);
    }
    
    setQAction() {
        this.window.quickActionSelectWindow.setVisible(true);
        this.window.quickActionSelectWindow.loadPc(this.window.pc);
    }
    
    reloadOverview() {
        this.window.loadPcOverview(this.window.pc);
    }
    
    reloadInventory() {
        this.window.loadPcInventory(this.window.pc);
    }
    
    reloadSpells() {
        this.window.loadPcSpells(this.window.pc);
    }
    
    setVisible(vis) {
        super.setVisible(vis);
        this.inventoryList.setVisible(vis);
        this.spellList.setVisible(vis);
        this.discardBox.setVisible(vis);
        this.castBox.setVisible(vis);
        for(var i=0;i<this.classIcons.length;i++) {this.classIcons[i].visible = vis;}
    }
    
    setQuickActionSelectWindow(quickActionSelectWindow) {
        this.quickActionSelectWindow = quickActionSelectWindow;
    }
    
    roundNumber(x) {
        return Math.floor(x*100)/100;
    }
    
    levelExp(x) {
        return (x*x*Pc.LEVEL_UP_THRESHOLD);
    }
    
    classLevelExp(x) {
        return (x*x*Pc.CLASS_LEVEL_UP_THRESHOLD);
    }
    
    loadPcOverview(pc) {
        this.pc = pc;
        //console.log(pc.name);
        this.cSubWindow = 0;
        this.texts[0].text = pc.name;
        
        this.texts[1].text = "str:";
        this.texts[2].text = "agi:";
        this.texts[3].text = "end:";
        this.texts[4].text = "int:";
        this.texts[5].text = "cha:";
        this.texts[6].text = "HP:";
        this.texts[7].text = "Sta:";
        
        this.texts[8].text = pc.strength+" ("+this.roundNumber((pc.strengthPrg - this.levelExp(pc.strength))/this.levelExp(pc.strength+1))+")";
        this.texts[9].text = pc.agility+" ("+this.roundNumber((pc.agilityPrg - this.levelExp(pc.agility))/this.levelExp(pc.agility+1))+")";
        this.texts[10].text = pc.endurance+" ("+this.roundNumber((pc.endurancePrg - this.levelExp(pc.endurance))/this.levelExp(pc.endurance+1))+")";
        this.texts[11].text = pc.intelligence+" ("+this.roundNumber((pc.intelligencePrg - this.levelExp(pc.intelligence))/this.levelExp(pc.intelligence+1))+")";
        this.texts[12].text = pc.charisma+" ("+this.roundNumber((pc.charismaPrg - this.levelExp(pc.charisma))/this.levelExp(pc.charisma+1))+")";
        this.texts[13].text = pc.curHp+"/"+pc.maxHp;
        this.texts[14].text = pc.curSta+"/"+pc.maxSta;
        
        this.texts[15].text = "ddg:";
        this.texts[16].text = "shld:";
        this.texts[17].text = "armr:";
        this.texts[18].text = "#att:";
        this.texts[19].text = "strk:";
        this.texts[20].text = "thrst:";
        this.texts[21].text = "shot:";
        
        var plus = "";
        
        this.texts[22].text = pc.dodgeAC;
        this.texts[23].text = pc.shieldAC;
        this.texts[24].text = pc.armourAC;
        this.texts[25].text = pc.nAttacks;
        var plus = "";
        if(pc.strikeAttackBonus >= 0) plus = "+";
        this.texts[26].text = "("+plus+pc.strikeAttackBonus+")  "+pc.strikeDieNumber+"d"+pc.strikeDieType+"+"+pc.strikeDamageBonus;
        plus = "";
        if(pc.thrustAttackBonus >= 0) plus = "+";
        this.texts[27].text = "("+plus+pc.thrustAttackBonus+")  "+pc.thrustDieNumber+"d"+pc.thrustDieType+"+"+pc.thrustDamageBonus;
        plus = "";
        if(pc.shootAttackBonus >= 0) plus = "+";
        this.texts[28].text = "("+plus+pc.shootAttackBonus+")  "+pc.shootDieNumber+"d"+pc.shootDieType+"+"+pc.shootDamageBonus;
        
        this.texts[29].text = "exp:";
        this.texts[30].text = pc.level+" ("+this.roundNumber((pc.levelPrg - this.classLevelExp(pc.level))/this.classLevelExp(pc.level+1))+")";
        
        for(var i=0;i<this.classIcons.length;i++) {
            this.classIcons[i].visible = true;
            if(i < pc.level) {
                this.classIcons[i].tint = 0xFFFFFF;
                this.classIcons[i].frame = pc.classLevels[i];
            } else {
                this.classIcons[i].tint = 0xBBBBBB;
                this.classIcons[i].frame = 0;
            }
        }
        
        this.texts[this.texts.length-2].text = "";
        this.texts[this.texts.length-1].text = "";
        
        for(var i=0;i<this.icons.length;i++) {
            this.icons[i].visible = false;
        }
        this.inventoryList.setVisible(false);
        this.spellList.setVisible(false);
        this.discardBox.setVisible(false);
        this.castBox.setVisible(false);
        this.buttons[1].setVisible(true);
    }
    
    loadPcInventory(pc, csp = 0) {
        this.pc = pc;
        this.cSubWindow = 1;
        this.inventoryList.cScrollPosition = csp;
        
        this.texts[0].text = pc.name;
        
        for(var i=1;i<this.texts.length;i++) {
            this.texts[i].text = "";
        }
        for(var i=0;i<this.icons.length;i++) {
            this.icons[i].visible = true;
            if(this.pc.equipItems[i] != null) this.icons[i].frame = this.pc.equipItems[i].type;
            else this.icons[i].frame = 0;
        }
        this.discardBox.setVisible(true);
        this.castBox.setVisible(false);
        
        this.inventoryList.setVisible(true);
        this.inventoryList.load(pc.inventory);
        this.inventoryList.reloadItems();
        
        this.spellList.setVisible(false);
        for(var i=0;i<this.classIcons.length;i++) {this.classIcons[i].visible = false;}
        
        this.texts[this.texts.length-2].text = "carrying:";
        this.texts[this.texts.length-1].text = pc.carryWeight+"/"+pc.carryCapacity;
        this.buttons[1].setVisible(false);
    }
    
    loadPcSpells(pc, csp = 0) {
        this.pc = pc;
        this.cSubWindow = 2;
        this.spellList.cScrollPosition = csp;
        
        this.texts[0].text = pc.name;
        
        for(var i=1;i<this.texts.length;i++) {
            this.texts[i].text = "";
        }
        for(var i=0;i<this.icons.length;i++) {
            this.icons[i].visible = false;
        }
        
        this.inventoryList.setVisible(false);
        this.discardBox.setVisible(false);
        this.castBox.setVisible(true);
        
        this.spellList.setVisible(true);
        this.spellList.setPc(pc);
        for(var i=0;i<this.classIcons.length;i++) {this.classIcons[i].visible = false;}
                
        for(var i=0;i<pc.spells.length; i++) {
            this.spellList.isItemValid[i] = pc.spells[i].canCastSpell(pc);
        }
        
        this.spellList.reloadItems();
        this.buttons[1].setVisible(false);
    }
    
    isMouseOverIcon(icon) {
        if(icon.visible) {
            if(this.game.input.mousePointer.x >= icon.x &&
                this.game.input.mousePointer.x < icon.x + icon.width &&
                this.game.input.mousePointer.y >= icon.y &&
                this.game.input.mousePointer.y < icon.y + icon.height) return true;
        }
        return false;
    }
    
    getEquipmentIconMouseOver() {
        for(var i=0;i<this.icons.length;i++) {
            if(this.isMouseOverIcon(this.icons[i])) return i;
        }
        return -1;
    }
    
    handleMouseDown() {
        super.handleMouseDown();
        var equipmentIconMouseOver = this.getEquipmentIconMouseOver();
        if(equipmentIconMouseOver >= 0 && this.pc.equipItems[equipmentIconMouseOver] != null) {
            this.equipmentDrag = true;
            this.dragIcon.x = this.icons[equipmentIconMouseOver].x;
            this.dragIcon.y = this.icons[equipmentIconMouseOver].y;
            this.dragItem = this.pc.equipItems[equipmentIconMouseOver];
            this.dragItemSlot = equipmentIconMouseOver;
            this.dragIcon.frame = this.dragItem.type;
            this.dragIcon.tint = 0xFFFFFF;
            this.startDragX = this.game.input.mousePointer.x - this.dragIcon.x;
            this.startDragY = this.game.input.mousePointer.y - this.dragIcon.y;
        }
        var inventoryListItemMouseOver = this.inventoryList.getMouseOver();
        if(inventoryListItemMouseOver >= 0 && this.pc.inventory[inventoryListItemMouseOver+this.inventoryList.cScrollPosition] != null) {
            if(this.timeSinceLastClick < PcInfoWindow.DOUBLE_CLICK_THRESHOLD && this.pc.inventory[inventoryListItemMouseOver+this.inventoryList.cScrollPosition].equipType == "booster") {
                this.consumeDrag = true;
                this.dragIcon.x = this.inventoryList.listItems[inventoryListItemMouseOver].icon.x;
                this.dragIcon.y = this.inventoryList.listItems[inventoryListItemMouseOver].icon.y;
                this.dragItem = this.inventoryList.listItems[inventoryListItemMouseOver].item;
                this.dragItemSlot = inventoryListItemMouseOver;
                this.dragIcon.frame = this.inventoryList.listItems[inventoryListItemMouseOver].item.type;
                this.dragIcon.tint = 0xFFBB66;
                this.startDragX = this.inventoryList.listItems[inventoryListItemMouseOver].icon.width/2;
                this.startDragY = this.inventoryList.listItems[inventoryListItemMouseOver].icon.height/2;
            } else {
                this.inventoryDrag = true;
                this.dragIcon.x = this.inventoryList.listItems[inventoryListItemMouseOver].icon.x;
                this.dragIcon.y = this.inventoryList.listItems[inventoryListItemMouseOver].icon.y;
                this.dragItem = this.inventoryList.listItems[inventoryListItemMouseOver].item;
                this.dragItemSlot = inventoryListItemMouseOver;
                this.dragIcon.frame = this.inventoryList.listItems[inventoryListItemMouseOver].item.type;
                this.dragIcon.tint = 0xFFFFFF;
                this.startDragX = this.inventoryList.listItems[inventoryListItemMouseOver].icon.width/2;
                this.startDragY = this.inventoryList.listItems[inventoryListItemMouseOver].icon.height/2;
            }
        }
        var spellListItemMouseOver = this.spellList.getMouseOver();
        var spell = this.pc.spells[spellListItemMouseOver+this.spellList.cScrollPosition];
        if(spell != null) {
            if(spell.targetType == Spell.PC) {
                this.spellDrag = true;
                this.dragSpellIcon.x = this.game.input.mousePointer.x;
                this.dragSpellIcon.y = this.game.input.mousePointer.y;
                this.dragSpell = spell;
                this.dragSpellSlot = spellListItemMouseOver;
                this.startDragX = this.dragSpellIcon.width/2;
                this.startDragY = this.dragSpellIcon.height/2;
            } else if(this.timeSinceLastClick < PcInfoWindow.DOUBLE_CLICK_THRESHOLD && (spell.targetType == Spell.PARTY || spell.targetType == Spell.ITEM))  {
                
            }
        }
        this.inventoryList.handleMouseDown();
        this.spellList.handleMouseDown();
        this.timeSinceLastClick = 0;
        this.mouseMoved = false;
        this.mousePressX = this.game.input.mousePointer.x;
        this.mousePressY = this.game.input.mousePointer.y;
        
        if(this.discardBox.isMouseOver() && !this.mouseMoved && this.inventoryList.isAnySelected()) {
            // we need to make a deep copy because the selected items will be reset after each item is removed
            var toRemove = [];
            for(var i=0;i<this.inventoryList.isItemSelected.length;i++) {
                toRemove.push(this.inventoryList.isItemSelected[i]);
            }
            for(var i=this.inventoryList.isItemSelected.length-1;i>=0;i--) {
                if(toRemove[i]) {
                    this.removeFromInventoryAndProcess(i);
                }
            }
        }
        
        if(this.castBox.isMouseOver() && this.spellList.selectedItem >= 0) {
            
        }
        
        if(this.inventoryList.visible && !this.inventoryList.isMouseOverAny()) {
            this.inventoryList.reloadSelectedItems();
            this.inventoryList.reloadItems();
        }
        if(this.spellList.visible && !this.spellList.isMouseOverAny()) {
            this.spellList.reloadSelectedItems();
            this.spellList.reloadItems();
        }
    }
    
    removeFromInventoryAndProcess(slot) {
        this.pc.removeFromInventory(slot);
        if(this.inventoryList.cScrollPosition == this.pc.inventory.length - PcInfoWindow.INVENTORY_LIST_SIZE + 1 && this.pc.inventory.length >= PcInfoWindow.INVENTORY_LIST_SIZE) {
            this.inventoryList.cScrollPosition--;
        }
        this.loadPcInventory(this.pc, this.inventoryList.cScrollPosition);
    }
    
    handleMouseUp() {
        super.handleMouseUp();
        this.inventoryList.handleMouseUp();
        this.spellList.handleMouseUp();
        if(this.equipmentDrag) {
            this.dragIcon.visible = false;
            //move between slots
            var equipmentIconMouseOver = this.getEquipmentIconMouseOver();
            if(equipmentIconMouseOver >= 0 && equipmentIconMouseOver != this.dragItemSlot) {
                if(this.validDragSlots[equipmentIconMouseOver]) {
                    // check if items can be swapped
                    if(this.pc.equipItems[this.dragItemSlot] != null) {
                        this.updateEquipmentTints(this.pc.equipItems[equipmentIconMouseOver]);
                        if(this.validDragSlots[this.dragItemSlot]) { // swap
                            this.pc.equipItems[this.dragItemSlot] = this.pc.equipItems[equipmentIconMouseOver];
                            this.pc.equipItems[equipmentIconMouseOver] = this.dragItem;
                        } else { // remove moved item and re-equip
                            this.pc.clearEquipSlot(this.dragItemSlot);
                            this.pc.equipToSlot(this.dragItem, equipmentIconMouseOver);
                        }
                    } else {
                        this.pc.equipToSlot(this.dragItem, equipmentIconMouseOver);
                    }
                }
            }
            //move item to inventory
            var inventoryListItemMouseOver = this.inventoryList.getMouseOver();
            if(inventoryListItemMouseOver >= 0) {
                this.pc.equipToSlot(null, this.dragItemSlot);
            }
            // give equipped item to other party member
            var portraitMouseOver = mainFrame.getPortraitMouseOver();
            if(portraitMouseOver >= 0) {
                this.pc.clearEquipSlot(this.dragItemSlot);
                this.mainFrame.pcParty.members[portraitMouseOver].addToInventory(this.dragItem);
            }
            // discard
            if(this.discardBox.isMouseOver()) {
                this.pc.clearEquipSlot(this.dragItemSlot);
            }
            this.loadPcInventory(this.pc, this.inventoryList.cScrollPosition);
            
            this.updateEquipmentTints(null);
        }        
        this.equipmentDrag = false;
        
        if(this.inventoryDrag) {
            this.dragIcon.visible = false;
            if(!this.mouseMoved) {
                this.inventoryList.select(this.dragItemSlot + this.inventoryList.cScrollPosition);
                this.inventoryList.reloadItems();
            }
            // equip item
            var equipmentIconMouseOver = this.getEquipmentIconMouseOver();
            if(equipmentIconMouseOver >= 0) {
                if(this.validDragSlots[equipmentIconMouseOver]) {
                    this.pc.equipToSlot(this.dragItem, equipmentIconMouseOver);
                    this.removeFromInventoryAndProcess(this.dragItemSlot + this.inventoryList.cScrollPosition);
                }
            }
            // give inventory item to other party member
            var portraitMouseOver = this.mainFrame.getPortraitMouseOver();
            if(portraitMouseOver >= 0) {
                this.mainFrame.pcParty.members[portraitMouseOver].addToInventory(this.dragItem);
                this.removeFromInventoryAndProcess(this.dragItemSlot + this.inventoryList.cScrollPosition);
            }
            // discard
            if(this.discardBox.isMouseOver()) {
                this.removeFromInventoryAndProcess(this.dragItemSlot + this.inventoryList.cScrollPosition);
            }
            this.updateEquipmentTints(null);
        }
        this.inventoryDrag = false;
        
        if(this.consumeDrag) {
            this.dragIcon.visible = false;
            // if mouse not moved consume by pc
            if(!this.mouseMoved) {
                this.dragItem.beConsumedBy(this.pc);
                this.removeFromInventoryAndProcess(this.dragItemSlot + this.inventoryList.cScrollPosition);
            }
            // selected pc consumes item
            var portraitMouseOver = mainFrame.getPortraitMouseOver();
            if(portraitMouseOver >= 0) {
                this.dragItem.beConsumedBy(mainFrame.pcParty.members[portraitMouseOver]);
                this.removeFromInventoryAndProcess(this.dragItemSlot + this.inventoryList.cScrollPosition);
            }
            this.mainFrame.reload();
        }
        this.consumeDrag = false;
        
        if(this.spellDrag) {
            this.dragSpellIcon.visible = false;
            if(this.dragSpell.targetType == Spell.PC) {
                // cast spell on individual
                var portraitMouseOver = mainFrame.getPortraitMouseOver();
                if(portraitMouseOver >= 0) {
                    this.dragSpell.castSpell(this.pc, mainFrame.pcParty.members[portraitMouseOver]);
                    mainFrame.reload();
                }
            } else if(this.dragSpell.targetType == Spell.PARTY) {
                
            } else if (this.dragSpell.targetType == Spell.ITEM) {
                
            }
        }
        this.spellDrag = false;
        
        var spellListItemMouseOver = this.spellList.getMouseOver();
        if(!this.mouseMoved && spellListItemMouseOver >= 0) {
            var spell = this.pc.spells[spellListItemMouseOver + this.spellList.cScrollPosition];
            this.spellList.selectOnly(spellListItemMouseOver + this.spellList.cScrollPosition);
            this.spellList.reloadItems();
        }
        
        if(this.inventoryList.isAnySelected()) this.discardBox.setTint(0xFFFFFF);
        else this.discardBox.setTint(0xBBBBBB);
        if(this.spellList.isAnySelected()) {
            var spell = this.pc.spells[this.spellList.getFirstSelectedIdx()];
            if(spell.targetType == Spell.PC || spell.targetType == Spell.PARTY || spell.targetType == Spell.ITEM) {
                this.castBox.setTint(0xFFFFFF);
            }
            else this.castBox.setTint(0xBBBBBB);
        }
        else this.castBox.setTint(0xBBBBBB);
    }
    
    update() {
        //console.log("bbbb");
        super.update();
        this.inventoryList.update();
        this.spellList.update();
        if(this.equipmentDrag || this.inventoryDrag || this.consumeDrag) {
            if(this.mouseMoved && !this.dragIcon.visible) {
                this.dragIcon.visible = true;
                this.updateEquipmentTints(this.dragItem);
                if(!this.consumeDrag) this.discardBox.setTint(0xFFFFFF);
            }
            if(this.mousePressX != this.game.input.mousePointer.x || this.mousePressY != this.game.input.mousePointer.y) {this.mouseMoved = true;}
            this.dragIcon.x = this.game.input.mousePointer.x - this.startDragX;
            this.dragIcon.y = this.game.input.mousePointer.y - this.startDragY;
        }
        if(this.spellDrag) {
            if(this.mouseMoved && !this.dragSpellIcon.visible) {
                this.dragSpellIcon.visible = true;
            }
            if(this.mousePressX != this.game.input.mousePointer.x || this.mousePressY != this.game.input.mousePointer.y) {this.mouseMoved = true;}
            this.dragSpellIcon.x = this.game.input.mousePointer.x - this.startDragX;
            this.dragSpellIcon.y = this.game.input.mousePointer.y - this.startDragY;
        }
        this.timeSinceLastClick = Math.min(PcInfoWindow.DOUBLE_CLICK_THRESHOLD, this.timeSinceLastClick+1);
    }
    
    updateEquipmentTints(item) {
        for(var i=0;i<this.icons.length;i++) {
            var valid = false;
            if(item != null) {
                if(item.equipType == "light" && i == 3) valid = true;
                if(item.equipType == "light" && i == 1 && this.pc.equipItems[3] != null) {
                    if(this.pc.equipItems[3].type == item.type) {
                        valid = true;
                    }
                }
                if(item.equipType == "one-handed" && i == 3) valid = true;
                if(item.equipType == "two-handed" && i == 3) valid = true;
                if(item.equipType == "ranged" && i == 2) valid = true;
                if(item.equipType == "shield" && i == 1) {
                    valid = true;
                    if(this.pc.equipItems[3] != null) {
                        if(this.pc.equipItems[3].equipType == "two-handed") {
                            valid = false;
                        }
                    }
                }
                if(item.equipType == "head" && i == 0) valid = true;
                if(item.equipType == "hand" && (i == 4 || i == 6)) valid = true;
                if(item.equipType == "armour" && i == 5) valid = true;
                if(item.equipType == "feet" && i == 7) valid = true;
            }
            this.validDragSlots[i] = valid;
            if(valid) this.icons[i].tint = 0xFFFF66;
            else this.icons[i].tint = 0xFFFFFF;
        }
        if(this.pc.equipItems[3] != null) {
            if(this.pc.equipItems[3].equipType == "two-handed") this.icons[1].tint = 0xFFBBBB;
        }
    }
}

PcInfoWindow.ICON_BASE_X = 25;
PcInfoWindow.ICON_BASE_X2 = 145;
PcInfoWindow.ICON_BASE_Y = 51;
PcInfoWindow.ICON_BASE_Y2 = 38;
PcInfoWindow.ICON_DIST = 25;
PcInfoWindow.INVENTORY_LIST_SIZE = 5;
PcInfoWindow.DOUBLE_CLICK_THRESHOLD = 25;