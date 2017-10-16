class SpellData{}

SpellData.DATA = [
    // name, class, level, base stamina cost, level scale, target
    ["light", "sorcerer", 1, 1, false, Spell.PARTY],
    ["electric arrow", "sorcerer", 1, 2, false, Spell.COMBAT],
    ["detect magic", "sorcerer", 1, 1, false, Spell.ITEM],
    
    ["first aid", "cleric", 1, 1, false, Spell.PC],
    ["awaken", "cleric", 1, 1, false, Spell.PC],
    ["flying fist", "cleric", 2, 2, false, Spell.COMBAT],
    
    //
    
    ["sleep", "sorcerer", 2, 3, false, Spell.COMBAT],
    ["fire bolt", "sorcerer", 2, 1, true, Spell.COMBAT],
    ["toxic cloud", "sorcerer", 2, 4, false, Spell.COMBAT],
    
    ["cure wounds", "cleric", 2, 2, true, Spell.COMBAT],
    ["protection", "cleric", 2, 1, true, Spell.PARTY],
    ["suppress poison", "cleric", 2, 4, false, Spell.COMBAT],
    
    //
    
    ["acid stream", "sorcerer", 3, 5, false, Spell.COMBAT],
    ["wizard eye", "sorcerer", 3, 5, false, Spell.PARTY],
    ["jump", "sorcerer", 3, 4, false, Spell.PARTY],
    
    ["turn undead", "cleric", 3, 5, false, Spell.COMBAT],
    ["silence", "cleric", 3, 6, false, Spell.COMBAT],
    ["bless", "cleric", 3, 2, true, Spell.PC],
    
    // 
    
    ["lightning bolt", "sorcerer", 4, 2, true, Spell.COMBAT],
    ["power shield", "sorcerer", 4, 2, true, Spell.COMBAT],
    ["fireball", "sorcerer", 4, 2, true, Spell.COMBAT],
    
    ["power cure", "cleric", 4, 2, true, Spell.PC],
    ["cure poison", "cleric", 4, 8, false, Spell.PC],
    ["fiery flail", "cleric", 4, 12, false, Spell.COMBAT],
    
    //
    
    ["teleport", "sorcerer", 5, 12, false, Spell.PARTY],
    ["recharge item", "sorcerer", 5, 15, false, Spell.ITEM],
    ["paralyse", "sorcerer", 5, 20, false, Spell.COMBAT],
    
    ["town portal", "cleric", 5, 20, false, Spell.PARTY],
    ["heroism", "cleric", 5, 3, true, Spell.PC],
    ["cure paralysis", "cleric", 5, 12, false, Spell.PC],
    
    // 
    
    ["incinerate", "sorcerer", 6, 35, false, Spell.COMBAT],
    ["dancing sword", "sorcerer", 6, 4, true, Spell.COMBAT],
    ["enchant item", "sorcerer", 6, 40, false, Spell.ITEM],
    
    ["raise dead", "cleric", 6, 50, false, Spell.PC],
    ["holy word", "cleric", 6, 75, false, Spell.COMBAT],
    ["miracle cure", "cleric", 6, 100, false, Spell.PARTY]
]