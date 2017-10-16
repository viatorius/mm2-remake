class ItemData{}

ItemData.DATA = [
    // melee:  name, slot, proficiency, base cost, weight, strike nd/td/cc/cm, thrust nd/td/cc/cm
    // ranged: name, slot, proficiency, base cost, weight, shoot nd/td/cc/cm
    ["none", "none", "light", 0, 0, [0, 0, 0, 0], [0, 0, 0, 0]],
    ["dagger", "light", "simple", 2, 0.5, [1, 4, 0.1, 2], [1, 4, 0.1, 2]],
    ["light mace", "light", "simple", 5, 2, [1, 6, 0.05, 2], [1, 4, 0.05, 2]],
    ["club", "one-handed", "simple", 3, 1.5, [2, 3, 0.05, 2], [1, 4, 0.05, 2]],
    ["pitchfork", "two-handed", "simple", 8, 2.5, [1, 4, 0.05, 2], [1, 8, 0.05, 2]],
    ["spear", "one-handed", "simple", 10, 3, [1, 4, 0.05, 2], [1, 8, 0.05, 3]],
    ["crossbow", "ranged", "simple", 35, 2, [1, 8, 0.1, 2]],

    ["handaxe", "light", "martial", 6, 1.5, [1, 6, 0.05, 3], [1, 4, 0.05, 2]],
    ["pick", "light", "martial", 4, 1.5, [1, 4, 0.05, 4], [1, 4, 0.05, 2]],
    ["rapier", "one-handed", "martial", 20, 1, [1, 6, 0.05, 2], [1, 6, 0.15, 2]],
    ["morningstar", "one-handed", "martial", 8, 3, [1, 8, 0.05, 2], [1, 4, 0.05, 2]],
    ["cutlass", "one-handed", "martial", 8, 3, [1, 6, 0.15, 2], [1, 6, 0.05, 2]],
    ["falchion", "two-handed", "martial", 75, 4, [2, 4, 0.15, 3], [1, 6, 0.05, 2]],
    ["halberd", "two-handed", "martial", 10, 6, [1, 10, 0.05, 3], [1, 10, 0.05, 3]],
    ["glaive", "two-handed", "martial", 10, 6, [1, 10, 0.15, 3], [1, 8, 0.05, 2]],
    ["greataxe", "two-handed", "martial", 20, 6, [1, 12, 0.05, 3], [1, 4, 0.05, 2]], 
    ["greatsword", "two-handed", "martial", 50, 4, [2, 6, 0.1, 2], [1, 8, 0.1, 2]],
    ["scythe", "two-handed", "martial", 18, 5, [2, 4, 0.05, 4], [1, 4, 0.05, 2]],
    ["shortbow", "ranged", "martial", 30, 1, [1, 6, 0.1, 3]],
    ["recurve bow", "ranged", "martial", 75, 1, [1, 8, 0.05, 3]],

    ["sai", "light", "exotic", 10, 0.5, [1, 4, 0.05, 2], [1, 6, 0.15, 2]],
    ["shuriken", "ranged", "exotic", 50, 0.5, [1, 4, 0.15, 2]],
    ["sabre", "one-handed", "exotic", 50, 2.5, [1, 10, 0.05, 2], [1, 10, 0.05, 2]],
    ["shillelagh", "one-handed", "exotic", 35, 1.5, [1, 8, 0.05, 2], [1, 4, 0.05, 2]],
    ["staff", "one-handed", "exotic", 1, 1.5, [1, 4, 0.05, 2], [1, 4, 0.05, 2]],
    ["wand", "one-handed", "exotic", 10, 0.5, [1, 4, 0.05, 2], [1, 4, 0.05, 2]],
    ["scroll", "two-handed", "exotic", 1, 1.5, [1, 2, 0.05, 2], [1, 2, 0.05, 2]],
    ["spellbook", "two-handed", "exotic", 10, 0.5, [1, 2, 0.05, 2], [1, 2, 0.05, 2]],
    
    
    
    

    // name, slot, proficiency, base cost, weight, AC bonuses
    ["buckler", "shield", "light", 10, 2.5, [0, 1]],
    ["small shield", "shield", "light", 25, 3.5, [-1, 3]],
    ["kite shield", "shield", "heavy", 25, 6, [-2, 5]],
    ["tower shield", "shield", "heavy", 50, 20, [-4, 8]],
    ["feral shield", "shield", "heavy", 150, 4, [0, 3]],
    ["regal shield", "shield", "heavy", 250, 8, [-2, 6]],

    // name, slot, proficiency, base cost, weight, AC bonuses
    ["padded jack","armour", "light",  5, 5, [0, 1]],
    ["leather suit", "armour", "light", 35, 7.5, [0, 2]],
    ["chain shirt", "armour", "medium", 100, 12.5, [-1, 4]],
    ["iron cuirass", "armour", "medium", 200, 17.5, [-3, 7]],
    ["banded mail", "armour", "heavy", 500, 20, [-4, 9]],
    ["full plate", "armour", "heavy", 1000, 25, [-6, 12]],

    // name, slot, proficiency, base cost, weight
    ["ring", "hand", "", 50, 0.1],
    ["amulet", "head", "", 50, 0.1],
    ["boots", "feet", "", 50, 1],
    ["bracelet", "hand", "", 50, 0.2],
    ["helm", "head", "", 50, 0.1],
    ["glove", "hand", "", 50, 0.1],
    ["angel ring", "hand", "", 50, 1],
    ["cloak", "head", "", 50, 0.2],
    ["greaves", "feet", "", 50, 0.1],
    ["horn helm", "head", "", 50, 0.1],
    ["sabatons", "feet", "", 50, 1],
    ["gauntlet", "hand", "", 50, 0.2],
    ["pearl ring", "hand", "", 50, 1],
    ["ruby ring", "hand", "", 50, 1],
    ["garnet ring", "hand", "", 50, 0.2],
    
    ["flask", "booster", "", 10, 0.2],
    ["potion", "booster", "", 10, 0.2],
    ["key", "quest", "", 10, 0.2],
    ["torch", "booster", "", 10, 0.2],
    ["bomb", "explosive", "", 10, 0.2],
]; 

ItemData.BONUS_COSTS = [
    ["of health", 100],
    ["of vitality", 80],
    
    ["first aid", 100],
];
    
//    [
//    // melee weapons
//    ["cudgel", "one-hand", 10],
//    ["hand axe", "one-hand", 10],
//    ["spear", "flexible-hand", 20],
//    ["short sword", "one-hand", 30],
//    // ranged weapons
//    ["short bow", "ranged", 10],
//    ["recurve bow", "ranged", 50],
//    ["crossbow", "ranged", 100],
//    ["sling", "ranged", 10],
//    // armour
//    ["padded jack", "armour", 20],
//    ["leather armour", "armour", 40],
//    ["chain shirt", "armour", 100],
//    ["full plate", "armour", 500],
//    // shields
//    ["buckler", "shield"],
//    ["kite shield", "shield"],
//    ["iron shield", "shield"],
//    ["tower shield, shield"]
//    //
//    ];

//public static var ITEM_DATA:Array = [
//			["none", "none", "light", 3],
//			["dagger", "simple", "light", 1, 4, 19, 2, "melee"],
//			["light mace", "simple", "light", 1, 6, 20, 2, "melee"],
//			["club", "simple", "one-handed", 2, 3, 20, 2, "melee"],
//			["pitchfork", "simple", "two-handed", 1, 8, 20, 2, "reach"],
//			["spear", "simple", "two-handed", 1, 8, 20, 3, "reach"],
//			["crossbow", "simple", "two-handed", 1, 8, 19, 2, "ranged"],
//			
//			["handaxe", "martial", "light", 1, 6, 20, 3, "melee"],
//			["pick", "martial", "light", 1, 4, 20, 4, "melee"],
//			["rapier", "martial", "one-handed", 1, 6, 18, 2, "melee"],
//			["morningstar", "martial", "one-handed", 1, 8, 20, 2, "melee"],
//			["falchion", "martial", "two-handed", 2, 4, 18, 3, "melee"],
//			["halberd", "martial", "two-handed", 1, 10, 20, 3, "reach"],
//			["greataxe", "martial", "two-handed", 1, 12, 20, 3, "melee"], 
//			["greatsword", "martial", "two-handed", 2, 6, 19, 2, "melee"],
//			["scythe", "martial", "two-handed", 2, 4, 20, 4, "melee"],
//			["shortbow", "martial", "two-handed", 1, 6, 19, 3, "ranged"],
//			["recurve bow", "martial", "two-handed", 1, 8, 20, 3, "ranged"],
//			
//			["sai", "exotic", "light", 1, 6, 18, 2, "melee"],
//			["shuriken", "exotic", "light", 1, 4, 18, 2, "reach"],
//			["sabre", "exotic", "one-handed", 1, 10, 20, 2, "melee"],
//			["shillelagh", "exotic", "one-handed", 1, 8, 20, 2, "melee"],
//			["staff", "exotic", "one-handed", 1, 4, 20, 2, "melee"],
//			["sceptre", "exotic", "one-handed", 1, 4, 20, 2, "melee"],
//			//["basterdsword", "exotic", "one-handed", 1, 10, 20, 2, "melee"],
//			
//			["buckler", "shield", 1, Number.MAX_VALUE, 0.05],
//			["small shield", "shield", 2, Number.MAX_VALUE, 0.15],
//			["kite shield", "shield", 3, 3, 0.3],  // -1 attack penalty
//			["tower shield", "shield", 4, 2, 0.5], // -2 attack penalty
//			
//			["padded jack", "armour", "light", 1, 8, 0.05],
//			["leather suit", "armour", "light", 2, 6, 0.10],
//			["chain shirt", "armour", "medium", 4, 4, 0.20],
//			["iron cuirass", "armour", "medium", 5, 3, 0.25],
//			["banded mail", "armour", "heavy", 6, 1, 0.35],
//			["full plate", "armour", "heavy", 8, 0, 0.5],
//			
//			["ring of protection", "special"],
//			["amulet of health", "special"],
//			
//		]; 