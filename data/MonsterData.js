class MonsterData{}

// name, initiative, hp, sta, animation sequence, attack bonus, die number, die type, damage bonus, crit chance, crit multiplier, damage type, attack group yes/no, status effect, status effect probability

MonsterData.DATA = [
    ["wolf", 1, 25, 25, [1, 0, 0, 0], 2, 1, 1, 6, 0, 0.05, 2, "melee", false, "", 0],
    ["bat", 1, 10, 10, [1, 0, 1, 0], 4, 1, 1, 2, 0, 0.05, 2, "melee", false, "poison", 1],
    ["rat", 1, 20, 20, [1, 0, 0, 0], 3, 1, 1, 3, 0, 0.05, 2, "melee", false, "", 0],
    ["skeleton", 1, 30, 30, [1, 0, 1, 0], 3, 1, 1, 6, 0, 0.05, 2, "melee", false, "", 0],
    ["ghost", 1, 25, 25, [1, 0, 1, 0], 1, 1, 1, 6, 0, 0.05, 2, "melee", true, "", 0],
    ["mountain man", 1, 50, 50, [0, 0, 1], 1, 1, 1, 8, 0, 0.05, 2, "melee", false, "", 0],
    ["basilisk", 1, 50, 50, [1, 0, 1, 0], 1, 1, 1, 6, 0, 0.05, 2, "melee", false, "", 0],
    ["creepy crawler", 1, 20, 20, [1, 0, 1, 0], 1, 1, 1, 6, 0, 0.05, 2, "melee", false, "poison", 0.1],
    ["sludge beast", 1, 30, 30, [1, 1, 0, 0], 1, 1, 1, 6, 0, 0.05, 2, "melee", true, "", 0]
];