import {ClassFeatures} from "./classFeatures.js"

// Namespace Configuration Values
export const bfrpg = {};

// ASCII Artwork
bfrpg.ASCII = ` 
 ____  ______ _____  _____   _____ 
|  _ \\|  ____|  __ \\|  __ \\ / ____|
| |_) | |__  | |__) | |__) | |  __ 
|  _ <|  __| |  _  /|  ___/| | |_ |
| |_) | |    | | \\ \\| |    | |__| |
|____/|_|    |_|  \\_\\_|     \\_____|
                                                                     
`;


/* Start MRP edit */


// ==============================
// Common Character Data
bfrpg.races = {
  "": "",
  "dwarf": "bfrpg.RaceDwarf",
  "elf": "bfrpg.RaceElf",
  "halfling": "bfrpg.RaceHalfling",
  "human": "bfrpg.RaceHuman"
};

bfrpg.gender = {
  "male": "bfrpg.Male",
  "female": "bfrpg.Female"
};

bfrpg.saves = {
  "poison": "bfrpg.SavePoison",
  "wands": "bfrpg.SaveWands",
  "paralysis": "bfrpg.SaveParalysis",
  "breath": "bfrpg.SaveBreath",
  "spells": "bfrpg.SaveSpells"
};

bfrpg.saveModDwarf = [
  4, // poison
  4, // wands
  4, // paralysis
  3, // breath
  4  // spells
];

bfrpg.saveModElf = [
  0, // poison
  2, // wands
  1, // paralysis
  0, // breath
  2  // spells
];

bfrpg.saveModHalfling = [
  4, // poison
  4, // wands
  4, // paralysis
  3, // breath
  4  // spells
];

bfrpg.saveModHuman = [
  0, // poison
  0, // wands
  0, // paralysis
  0, // breath
  0  // spells
];

bfrpg.abilityCheckTable = [
  17, // Level:1
  16, // Level:2
  16, // Level:3
  15, // Level:4
  15, // Level:5
  14, // Level:6
  14, // Level:7
  13, // Level:8
  13, // Level:9
  12, // Level:10
  12, // Level:11
  11, // Level:12
  11, // Level:13
  10, // Level:14
  10, // Level:15
  9, // Level:16
  9, // Level:17
  8, // Level:18
  8, // Level:19
  7  // Level:20
];

bfrpg.abilityModifierTable = [
  -5, // 1
  -4, // 2
  -3, // 3
  -2, // 4
  -2, // 5
  -1, // 6
  -1, // 7
  -1, // 8
  0,  // 9
  0,  // 10
  0,  // 11
  0,  // 12
  1,  // 13
  1,  // 14
  1,  // 15
  2,  // 16
  2,  // 17
  3,  // 18
  3,  // 19
  4,  // 20
  4,  // 21
  5,  // 22
  5,  // 23
  6,  // 24
  6   // 25
];

bfrpg.encumbranceLight = [
  5,   // 1
  15,  // 2
  25,  // 3
  35,  // 4
  35,  // 5
  50,  // 6
  50,  // 7
  50,  // 8
  60,  // 9
  60,  // 10
  60,  // 11
  60,  // 12
  65,  // 13
  65,  // 14
  65,  // 15
  70,  // 16
  70,  // 17
  80,  // 18
  80,  // 19
  90,  // 20
  90,  // 21
  100, // 22
  100, // 23
  110, // 24
  110  // 25
];

bfrpg.encumbranceHeavy = [
  5,   // 1
  15,  // 2
  60,  // 3
  90,  // 4
  90,  // 5
  120, // 6
  120, // 7
  120, // 8
  150, // 9
  150, // 10
  150, // 11
  150, // 12
  165, // 13
  165, // 14
  165, // 15
  180, // 16
  180, // 17
  195, // 18
  195, // 19
  215, // 20
  215, // 21
  235, // 22
  235, // 23
  260, // 24
  260  // 25
];

bfrpg.encumbranceLightHalfling = [
  5,   // 1
  10,  // 2
  20,  // 3
  30,  // 4
  30,  // 5
  40,  // 6
  40,  // 7
  40,  // 8
  50,  // 9
  50,  // 10
  50,  // 11
  50,  // 12
  55,  // 13
  55,  // 14
  55,  // 15
  60,  // 16
  60,  // 17
  65,  // 18
  65,  // 19
  70,  // 20
  70,  // 21
  80,  // 22
  80,  // 23
  90,  // 24
  90   // 25
];

bfrpg.encumbranceHeavyHalfling = [
  10,  // 1
  20,  // 2
  40,  // 3
  60,  // 4
  60,  // 5
  80,  // 6
  80,  // 7
  80,  // 8
  100, // 9
  100, // 10
  100, // 11
  100, // 12
  110, // 13
  110, // 14
  110, // 15
  120, // 16
  120, // 17
  130, // 18
  130, // 19
  150, // 20
  150, // 21
  165, // 22
  165, // 23
  280, // 24
  280  // 25
];


// ==============================



// ==============================
// Cleric Character Data
bfrpg.Cleric_EXP_LEVELS =  [
  0,       // Level:1
  1500,    // Level:2
  3000,    // Level:3
  6000,    // Level:4
  12000,   // Level:5
  24000,   // Level:6
  48000,   // Level:7
  90000,   // Level:8
  180000,  // Level:9
  270000,  // Level:10
  360000,  // Level:11
  450000,  // Level:12
  540000,  // Level:13
  630000,  // Level:14
  720000,  // Level:15
  810000,  // Level:16
  900000,  // Level:17
  990000,  // Level:18
  1080000, // Level:19
  1170000  // Level:20
];

bfrpg.Cleric_HIT_DICE =  [
  "1d6",    // Level:1
  "2d6",    // Level:2
  "3d6",    // Level:3
  "4d6",    // Level:4
  "5d6",    // Level:5
  "6d6",    // Level:6
  "7d6",    // Level:7
  "8d6",    // Level:8
  "9d6",    // Level:9
  "9d6+1",  // Level:10
  "9d6+2",  // Level:11
  "9d6+3",  // Level:12
  "9d6+4",  // Level:13
  "9d6+5",  // Level:14
  "9d6+6",  // Level:15
  "9d6+7",  // Level:16
  "9d6+8",  // Level:17
  "9d6+9",  // Level:18
  "9d6+10", // Level:19
  "9d6+11"  // Level:20
];

bfrpg.Cleric_ATTACK_BONUS_TABLE = [
  1, // Level:1
  1, // Level:2
  2, // Level:3
  2, // Level:4
  3, // Level:5
  3, // Level:6
  4, // Level:7
  4, // Level:8
  5, // Level:9
  5, // Level:10
  5, // Level:11
  6, // Level:12
  6, // Level:13
  6, // Level:14
  7, // Level:15
  7, // Level:16
  7, // Level:17
  8, // Level:18
  8, // Level:19
  8  // Level:20
];

bfrpg.Cleric_SAVING_THROW_TABLE = [
  [11, 12, 14, 16, 15], // Level:1
  [10, 11, 13, 15, 14], // Level:2
  [10, 11, 13, 15, 14], // Level:3
  [9, 10, 13, 15, 14],  // Level:4
  [9, 10, 13, 15, 14],  // Level:5
  [9, 10, 12, 14, 13],  // Level:6
  [9, 10, 12, 14, 13],  // Level:7
  [8, 9, 12, 14, 13],   // Level:8
  [8, 9, 12, 14, 13],   // Level:9
  [8, 9, 11, 13, 12],   // Level:10
  [8, 9, 11, 13, 12],   // Level:11
  [7, 8, 11, 13, 12],   // Level:12
  [7, 8, 11, 13, 12],   // Level:13
  [7, 8, 10, 12, 11],   // Level:14
  [7, 8, 10, 12, 11],   // Level:15
  [6, 7, 10, 12, 11],   // Level:16
  [6, 7, 10, 12, 11],   // Level:17
  [6, 7, 9, 11, 10],    // Level:18
  [6, 7, 9, 11, 10],    // Level:19
  [5, 6, 9, 11, 10]     // Level:20
];

bfrpg.Cleric_SPELL_SLOT_TABLE = [
  [],                  // Level:1
  [1],                 // Level:2
  [2],                 // Level:3
  [2, 1],              // Level:4
  [2, 2],              // Level:5
  [2, 2, 1],           // Level:6
  [3, 2, 2],           // Level:7
  [3, 2, 2, 1],        // Level:8
  [3, 3, 2, 2],        // Level:9
  [3, 3, 2, 2, 1],     // Level:10
  [4, 3, 3, 2, 2],     // Level:11
  [4, 4, 3, 2, 2, 1],  // Level:12
  [4, 4, 3, 3, 2, 2],  // Level:13
  [4, 4, 4, 3, 2, 2],  // Level:14
  [4, 4, 4, 3, 3, 2],  // Level:15
  [5, 4, 4, 3, 3, 2],  // Level:16
  [5, 5, 4, 3, 3, 2],  // Level:17
  [5, 5, 4, 4, 3, 3],  // Level:18
  [6, 5, 4, 4, 3, 3],  // Level:19
  [6, 5, 5, 4, 3, 3]   // Level:20
];

 bfrpg.Cleric_TURN_UNDEAD_TABLE = [
  ["13", "17", "19", "No", "No", "No", "No", "No", "No"], // Level:1
  ["11", "15", "18", "20", "No", "No", "No", "No", "No"], // Level:2
  ["9",  "13", "17", "19", "No", "No", "No", "No", "No"], // Level:3
  ["7",  "11", "15", "18", "20", "No", "No", "No", "No"], // Level:4
  ["5",  "9",  "13", "17", "19", "No", "No", "No", "No"], // Level:5
  ["3",  "7",  "11", "15", "18", "20", "No", "No", "No"], // Level:6
  ["2",  "5",   "9", "13", "17", "19", "No", "No", "No"], // Level:7
  ["T",  "3",   "7", "11", "15", "18", "20", "No", "No"], // Level:8
  ["T",  "2",   "5",  "9", "13", "17", "19", "No", "No"], // Level:9
  ["T",  "T",   "3",  "7", "11", "15", "18", "20", "No"], // Level:10
  ["D",  "T",   "2",  "5",  "9", "13", "17", "19", "No"], // Level:11
  ["D",  "T",   "T",  "3",  "7", "11", "15", "18", "20"], // Level:12
  ["D",  "D",   "T",  "2",  "5",  "9", "13", "17", "19"], // Level:13
  ["D",  "D",   "T",  "T",  "3",  "7", "11", "15", "18"], // Level:14
  ["D",  "D",   "D",  "T",  "2",  "5",  "9", "13", "17"], // Level:15
  ["D",  "D",   "D",  "T",  "T",  "3",  "7", "11", "15"], // Level:16
  ["D",  "D",   "D",  "D",  "T",  "2",  "5",  "9", "13"], // Level:17
  ["D",  "D",   "D",  "D",  "T",  "T",  "3",  "7", "11"], // Level:18
  ["D",  "D",   "D",  "D",  "D",  "T",  "2",  "5",  "9"], // Level:19
  ["D",  "D",   "D",  "D",  "D",  "T",  "T",  "3",  "7"]  // Level:20
]; 

bfrpg.turnUndead = {
  "skeleton": "Turn Skeleton [1 Hit Die]",
  "zombie": "Turn Zombie [2 Hit Dice]",
  "ghoul": "Turn Ghoul [3 Hit Dice]",
  "wight": "Turn Wight [4 Hit Dice]",
  "wraith": "Turn Wraith [5 Hit Dice]",
  "mummy": "Turn Mummy [6 Hit Dice]",
  "spectre": "Turn Spectre [7 Hit Dice]",
  "vampire": "Turn Vampire [8 Hit Dice]",
  "ghost": "Turn Ghost [9+ Hit Dice]"  
};
// ==============================



// ==============================
// Magic User Character Data
bfrpg.MagicUser_EXP_LEVELS =  [
  0,       // Level:1
  2500,    // Level:2
  5000,    // Level:3
  10000,   // Level:4
  20000,   // Level:5
  40000,   // Level:6
  80000,   // Level:7
  150000,  // Level:8
  300000,  // Level:9
  450000,  // Level:10
  600000,  // Level:11
  750000,  // Level:12
  900000,  // Level:13
  1050000, // Level:14
  1200000, // Level:15
  1350000, // Level:16
  1500000, // Level:17
  1650000, // Level:18
  1800000, // Level:19
  1950000  // Level:20
];

bfrpg.MagicUser_HIT_DICE =  [
  "1d4",    // Level:1
  "2d4",    // Level:2
  "3d4",    // Level:3
  "4d4",    // Level:4
  "5d4",    // Level:5
  "6d4",    // Level:6
  "7d4",    // Level:7
  "8d4",    // Level:8
  "9d4",    // Level:9
  "9d4+1",  // Level:10
  "9d4+2",  // Level:11
  "9d4+3",  // Level:12
  "9d4+4",  // Level:13
  "9d4+5",  // Level:14
  "9d4+6",  // Level:15
  "9d4+7",  // Level:16
  "9d4+8",  // Level:17
  "9d4+9",  // Level:18
  "9d4+10", // Level:19
  "9d4+11"  // Level:20
];

bfrpg.MagicUser_ATTACK_BONUS_TABLE = [
  1, // Level:1
  1, // Level:2
  1, // Level:3
  2, // Level:4
  2, // Level:5
  3, // Level:6
  3, // Level:7
  3, // Level:8
  4, // Level:9
  4, // Level:10
  4, // Level:11
  4, // Level:12
  5, // Level:13
  5, // Level:14
  5, // Level:15
  6, // Level:16
  6, // Level:17
  6, // Level:18
  7, // Level:19
  7  // Level:20
];

bfrpg.MagicUser_SAVING_THROW_TABLE = [
  [13, 14, 13, 16, 15], // Level:1
  [13, 14, 13, 15, 14], // Level:2
  [13, 14, 13, 15, 14], // Level:3
  [12, 13, 12, 15, 13], // Level:4
  [12, 13, 12, 15, 13], // Level:5
  [12, 12, 11, 14, 13], // Level:6
  [12, 12, 11, 14, 13], // Level:7
  [11, 11, 10, 14, 12], // Level:8
  [11, 11, 10, 14, 12], // Level:9
  [11, 10, 9, 13, 11],  // Level:10
  [11, 10, 9, 13, 11],  // Level:11
  [10, 10, 9, 13, 11],  // Level:12
  [10, 10, 9, 13, 11],  // Level:13
  [10, 9, 8, 12, 10],   // Level:14
  [10, 9, 8, 12, 10],   // Level:15
  [9, 8, 7, 12, 9],     // Level:16
  [9, 8, 7, 12, 9],     // Level:17
  [9, 7, 6, 11, 9],     // Level:18
  [9, 7, 6, 11, 9],     // Level:19
  [8, 6, 5, 11, 8]      // Level:20
];

bfrpg.MagicUser_SPELL_SLOT_TABLE = [
  [1],                // Level:1
  [2],                // Level:2
  [2, 1],             // Level:3
  [2, 2],             // Level:4
  [2, 2, 1],          // Level:5
  [3, 2, 2],          // Level:6
  [3, 2, 2, 1],       // Level:7
  [3, 3, 2, 2],       // Level:8
  [3, 3, 2, 2, 1],    // Level:9
  [4, 3, 3, 2, 2],    // Level:10
  [4, 4, 3, 2, 2, 1], // Level:11
  [4, 4, 3, 3, 2, 2], // Level:12
  [4, 4, 4, 3, 2, 2], // Level:13
  [4, 4, 4, 3, 3, 2], // Level:14
  [5, 4, 4, 3, 3, 2], // Level:15
  [5, 5, 4, 3, 3, 2], // Level:16
  [5, 5, 4, 4, 3, 3], // Level:17
  [6, 5, 4, 4, 3, 3], // Level:18
  [6, 5, 5, 4, 3, 3], // Level:19
  [6, 5, 5, 4, 4, 3]  // Level:20
];
// ==============================


// ==============================
// Fighter Character Data
bfrpg.Fighter_EXP_LEVELS =  [
  0,       // Level:1
  2000,    // Level:2
  4000,    // Level:3
  8000,    // Level:4
  16000,   // Level:5
  32000,   // Level:6
  64000,   // Level:7
  120000,  // Level:8
  240000,  // Level:9
  360000,  // Level:10
  480000,  // Level:11
  600000,  // Level:12
  720000,  // Level:13
  840000,  // Level:14
  960000,  // Level:15
  1080000, // Level:16
  1200000, // Level:17
  1320000, // Level:18
  1440000, // Level:19
  1560000  // Level:20
];

bfrpg.Fighter_HIT_DICE =  [
  "1d8",    // Level:1
  "2d8",    // Level:2
  "3d8",    // Level:3
  "4d8",    // Level:4
  "5d8",    // Level:5
  "6d8",    // Level:6
  "7d8",    // Level:7
  "8d8",    // Level:8
  "9d8",    // Level:9
  "9d8+2",  // Level:10
  "9d8+4",  // Level:11
  "9d8+6",  // Level:12
  "9d8+8",  // Level:13
  "9d8+10", // Level:14
  "9d8+12", // Level:15
  "9d8+14", // Level:16
  "9d8+16", // Level:17
  "9d8+18", // Level:18
  "9d8+20", // Level:19
  "9d8+22"  // Level:20
];

bfrpg.Fighter_Halfling_HIT_DICE =  [
  "1d6",    // Level:1
  "2d6",    // Level:2
  "3d6",    // Level:3
  "4d6",    // Level:4
  "5d6",    // Level:5
  "6d6",    // Level:6
  "7d6",    // Level:7
  "8d6",    // Level:8
  "9d6",    // Level:9
  "9d6+2",  // Level:10
  "9d6+4",  // Level:11
  "9d6+6",  // Level:12
  "9d6+8",  // Level:13
  "9d6+10", // Level:14
  "9d6+12", // Level:15
  "9d6+14", // Level:16
  "9d6+16", // Level:17
  "9d6+18", // Level:18
  "9d6+20", // Level:19
  "9d6+22"  // Level:20
];

bfrpg.Fighter_ATTACK_BONUS_TABLE = [
  1,  // Level:1
  2,  // Level:2
  2,  // Level:3
  3,  // Level:4
  4,  // Level:5
  4,  // Level:6
  5,  // Level:7
  6,  // Level:8
  6,  // Level:9
  6,  // Level:10
  7,  // Level:11
  7,  // Level:12
  8,  // Level:13
  8,  // Level:14
  8,  // Level:15
  9,  // Level:16
  9,  // Level:17
  10, // Level:18
  10, // Level:19
  10  // Level:20
];

bfrpg.Fighter_SAVING_THROW_TABLE = [
  [12, 13, 14, 15, 17], // Level:1
  [11, 12, 14, 15, 16], // Level:2
  [11, 12, 14, 15, 16], // Level:3
  [11, 11, 13, 14, 15], // Level:4
  [11, 11, 13, 14, 15], // Level:5
  [10, 11, 12, 14, 15], // Level:6
  [10, 11, 12, 14, 15], // Level:7
  [9, 10, 12, 13, 14],  // Level:8
  [9, 10, 12, 13, 14],  // Level:9
  [9, 9, 11, 12, 13],   // Level:10
  [9, 9, 11, 12, 13],   // Level:11
  [8, 9, 10, 12, 13],   // Level:12
  [8, 9, 10, 12, 13],   // Level:13
  [7, 8, 10, 11, 12],   // Level:14
  [7, 8, 10, 11, 12],   // Level:15
  [7, 7, 9, 10, 11],    // Level:16
  [7, 7, 9, 10, 11],    // Level:17
  [6, 7, 8, 10, 11],    // Level:18
  [6, 7, 8, 10, 11],    // Level:19
  [5, 6, 8, 9, 10]      // Level:20
];

// ==============================


// ==============================
// Thief Character Data
bfrpg.Thief_EXP_LEVELS =  [
  0,      // Level:1
  1250,   // Level:2
  2500,   // Level:3
  5000,   // Level:4
  10000,  // Level:5
  20000,  // Level:6
  40000,  // Level:7
  75000,  // Level:8
  150000, // Level:9
  225000, // Level:10
  300000, // Level:11
  375000, // Level:12
  450000, // Level:13
  525000, // Level:14
  600000, // Level:15
  675000, // Level:16
  750000, // Level:17
  825000, // Level:18
  900000, // Level:19
  975000  // Level:20
];

bfrpg.Thief_HIT_DICE =  [
  "1d4",    // Level:1
  "2d4",    // Level:2
  "3d4",    // Level:3
  "4d4",    // Level:4
  "5d4",    // Level:5
  "6d4",    // Level:6
  "7d4",    // Level:7
  "8d4",    // Level:8
  "9d4",    // Level:9
  "9d4+2",  // Level:10
  "9d4+4",  // Level:11
  "9d4+6",  // Level:12
  "9d4+8",  // Level:13
  "9d4+10", // Level:14
  "9d4+12", // Level:15
  "9d4+14", // Level:16
  "9d4+16", // Level:17
  "9d4+18", // Level:18
  "9d4+20", // Level:19
  "9d4+22"  // Level:20
];

bfrpg.Thief_ATTACK_BONUS_TABLE = [
  1, // Level:1
  1, // Level:2
  2, // Level:3
  2, // Level:4
  3, // Level:5
  3, // Level:6
  4, // Level:7
  4, // Level:8
  5, // Level:9
  5, // Level:10
  5, // Level:11
  6, // Level:12
  6, // Level:13
  6, // Level:14
  7, // Level:15
  7, // Level:16
  7, // Level:17
  8, // Level:18
  8, // Level:19
  8  // Level:20
];

bfrpg.Thief_SAVING_THROW_TABLE = [
  [13, 14, 13, 16, 15], // Level:1
  [12, 14, 12, 15, 14], // Level:2
  [12, 14, 12, 15, 14], // Level:3
  [11, 13, 12, 14, 13], // Level:4
  [11, 13, 12, 14, 13], // Level:5
  [11, 13, 11, 13, 13], // Level:6
  [11, 13, 11, 13, 13], // Level:7
  [10, 12, 11, 12, 12], // Level:8
  [10, 12, 11, 12, 12], // Level:9
  [9, 12, 10, 11, 11],  // Level:10
  [9, 12, 10, 11, 11],  // Level:11
  [9, 10, 10, 10, 11],  // Level:12
  [9, 10, 10, 10, 11],  // Level:13
  [8, 10, 9, 9, 10],    // Level:14
  [8, 10, 9, 9, 10],    // Level:15
  [7, 9, 9, 8, 9],      // Level:16
  [7, 9, 9, 8, 9],      // Level:17
  [7, 9, 8, 7, 9],      // Level:18
  [7, 9, 8, 7, 9],      // Level:19
  [6, 8, 8, 6, 8]       // Level:20
];

bfrpg.Thief_ABILITY_TABLE = [
  [25, 20, 30, 25, 80, 10, 30], // Level:1
  [30, 25, 35, 30, 81, 15, 34], // Level:2
  [35, 30, 40, 35, 82, 20, 38], // Level:3
  [40, 35, 45, 40, 83, 25, 42], // Level:4
  [45, 40, 50, 45, 84, 30, 46], // Level:5
  [50, 45, 55, 50, 85, 35, 50], // Level:6
  [55, 50, 60, 55, 86, 40, 54], // Level:7
  [60, 55, 65, 60, 87, 45, 58], // Level:8
  [65, 60, 70, 65, 88, 50, 62], // Level:9
  [68, 63, 74, 68, 89, 53, 65], // Level:10
  [71, 66, 78, 71, 90, 56, 68], // Level:11
  [74, 69, 82, 74, 91, 59, 71], // Level:12
  [77, 72, 86, 77, 92, 62, 74], // Level:13
  [80, 75, 90, 80, 93, 65, 77], // Level:14
  [83, 78, 94, 83, 94, 68, 80], // Level:15
  [84, 79, 95, 85, 95, 69, 83], // Level:16
  [85, 80, 96, 87, 96, 70, 86], // Level:17
  [86, 81, 97, 89, 97, 71, 89], // Level:18
  [87, 82, 98, 91, 98, 72, 92], // Level:19
  [88, 83, 99, 93, 99, 73, 95]  // Level:20
];

bfrpg.thiefSkills = {
  "openLocks": "Open Locks",
  "removeTraps": "Remove Traps",
  "pickPockets": "Pick Pockets",
  "moveSilently": "Move Silently",
  "climbWalls": "Climb Walls",
  "hide": "Hide",
  "listen": "Listen"
};

// ==============================


// ==============================
// FighterMagicUser Character Data
bfrpg.FighterMagicUser_EXP_LEVELS =  [
  0,       // Level:1
  4500,    // Level:2
  9000,    // Level:3
  18000,   // Level:4
  36000,   // Level:5
  72000,   // Level:6
  144000,  // Level:7
  270000,  // Level:8
  540000,  // Level:9
  810000,  // Level:10
  1080000, // Level:11
  1350000, // Level:12
  1620000, // Level:13
  1890000, // Level:14
  2160000, // Level:15
  2430000, // Level:16
  2700000, // Level:17
  2970000, // Level:18
  3240000, // Level:19
  3510000  // Level:20
];

bfrpg.FighterMagicUser_HIT_DICE =  [
  "1d6",    // Level:1
  "2d6",    // Level:2
  "3d6",    // Level:3
  "4d6",    // Level:4
  "5d6",    // Level:5
  "6d6",    // Level:6
  "7d6",    // Level:7
  "8d6",    // Level:8
  "9d6",    // Level:9
  "9d6+1",  // Level:10
  "9d6+3",  // Level:11
  "9d6+4",  // Level:12
  "9d6+6",  // Level:13
  "9d6+7",  // Level:14
  "9d6+9",  // Level:15
  "9d6+10", // Level:16
  "9d6+12", // Level:17
  "9d6+13", // Level:18
  "9d6+15", // Level:19
  "9d6+16"  // Level:20
];

bfrpg.FighterMagicUser_ATTACK_BONUS_TABLE = [
  1,  // Level:1
  2,  // Level:2
  2,  // Level:3
  3,  // Level:4
  4,  // Level:5
  4,  // Level:6
  5,  // Level:7
  6,  // Level:8
  6,  // Level:9
  6,  // Level:10
  7,  // Level:11
  7,  // Level:12
  8,  // Level:13
  8,  // Level:14
  8,  // Level:15
  9,  // Level:16
  9,  // Level:17
  10, // Level:18
  10, // Level:19
  10  // Level:20
];

bfrpg.FighterMagicUser_SAVING_THROW_TABLE = [
  [12, 13, 13, 15, 15], // Level:1
  [11, 12, 13, 15, 14], // Level:2
  [11, 12, 13, 15, 14], // Level:3
  [11, 11, 12, 14, 13], // Level:4
  [11, 11, 12, 14, 13], // Level:5
  [10, 11, 11, 14, 13], // Level:6
  [10, 11, 11, 14, 13], // Level:7
  [9, 10, 10, 13, 12],  // Level:8
  [9, 10, 10, 13, 12],  // Level:9
  [9, 9, 9, 12, 11],    // Level:10
  [9, 9, 9, 12, 11],    // Level:11
  [8, 9, 9, 12, 11],    // Level:12
  [8, 9, 9, 12, 11],    // Level:13
  [7, 8, 8, 11, 10],    // Level:14
  [7, 8, 8, 11, 10],    // Level:15
  [7, 7, 7, 10, 9],     // Level:16
  [7, 7, 7, 10, 9],     // Level:17
  [6, 7, 6, 10, 9],     // Level:18
  [6, 7, 6, 10, 9],     // Level:19
  [5, 6, 5, 9, 8]       // Level:20
];

bfrpg.FighterMagicUser_SPELL_SLOT_TABLE = [
  [1],                // Level:1
  [2],                // Level:2
  [2, 1],             // Level:3
  [2, 2],             // Level:4
  [2, 2, 1],          // Level:5
  [3, 2, 2],          // Level:6
  [3, 2, 2, 1],       // Level:7
  [3, 3, 2, 2],       // Level:8
  [3, 3, 2, 2, 1],    // Level:9
  [4, 3, 3, 2, 2],    // Level:10
  [4, 4, 3, 2, 2, 1], // Level:11
  [4, 4, 3, 3, 2, 2], // Level:12
  [4, 4, 4, 3, 2, 2], // Level:13
  [4, 4, 4, 3, 3, 2], // Level:14
  [5, 4, 4, 3, 3, 2], // Level:15
  [5, 5, 4, 3, 3, 2], // Level:16
  [5, 5, 4, 4, 3, 3], // Level:17
  [6, 5, 4, 4, 3, 3], // Level:18
  [6, 5, 5, 4, 3, 3], // Level:19
  [6, 5, 5, 4, 4, 3]  // Level:20
];
// ==============================


// ==============================
// MagicUserThief Character Data
bfrpg.MagicUserThief_EXP_LEVELS =  [
  0,       // Level:1
  3750,    // Level:2
  7500,    // Level:3
  15000,   // Level:4
  30000,   // Level:5
  60000,   // Level:6
  120000,  // Level:7
  225000,  // Level:8
  450000,  // Level:9
  675000,  // Level:10
  900000,  // Level:11
  1125000, // Level:12
  1350000, // Level:13
  1575000, // Level:14
  1800000, // Level:15
  2025000, // Level:16
  2250000, // Level:17
  2475000, // Level:18
  2700000, // Level:19
  2925000  // Level:20
];

bfrpg.MagicUserThief_HIT_DICE =  [
  "1d4",    // Level:1
  "2d4",    // Level:2
  "3d4",    // Level:3
  "4d4",    // Level:4
  "5d4",    // Level:5
  "6d4",    // Level:6
  "7d4",    // Level:7
  "8d4",    // Level:8
  "9d4",    // Level:9
  "9d4+1",  // Level:10
  "9d4+3",  // Level:11
  "9d4+4",  // Level:12
  "9d4+6",  // Level:13
  "9d4+7",  // Level:14
  "9d4+9",  // Level:15
  "9d4+10", // Level:16
  "9d4+12", // Level:17
  "9d4+13", // Level:18
  "9d4+15", // Level:19
  "9d4+16"  // Level:20
];

bfrpg.MagicUserThief_ATTACK_BONUS_TABLE = [
  1, // Level:1
  1, // Level:2
  2, // Level:3
  2, // Level:4
  3, // Level:5
  3, // Level:6
  4, // Level:7
  4, // Level:8
  5, // Level:9
  5, // Level:10
  5, // Level:11
  6, // Level:12
  6, // Level:13
  6, // Level:14
  7, // Level:15
  7, // Level:16
  7, // Level:17
  8, // Level:18
  8, // Level:19
  8  // Level:20
];

bfrpg.MagicUserThief_SAVING_THROW_TABLE = [
  [13, 14, 13, 16, 15], // Level:1
  [12, 14, 12, 15, 14], // Level:2
  [12, 14, 12, 15, 14], // Level:3
  [11, 13, 12, 14, 13], // Level:4
  [11, 13, 12, 14, 13], // Level:5
  [11, 12, 11, 13, 13], // Level:6
  [11, 12, 11, 13, 13], // Level:7
  [10, 11, 10, 12, 12], // Level:8
  [10, 11, 10, 12, 12], // Level:9
  [9, 10, 9, 11, 11],   // Level:10
  [9, 10, 9, 11, 11],   // Level:11
  [9, 10, 9, 10, 11],   // Level:12
  [9, 10, 9, 10, 11],   // Level:13
  [8, 9, 8, 9, 10],     // Level:14
  [8, 9, 8, 9, 10],     // Level:15
  [7, 8, 7, 8, 9],      // Level:16
  [7, 8, 7, 8, 9],      // Level:17
  [7, 7, 6, 7, 9],      // Level:18
  [7, 7, 6, 7, 9],      // Level:19
  [6, 6, 5, 6, 8]       // Level:20
];

bfrpg.MagicUserThief_SPELL_SLOT_TABLE = [
  [1],                // Level:1
  [2],                // Level:2
  [2, 1],             // Level:3
  [2, 2],             // Level:4
  [2, 2, 1],          // Level:5
  [3, 2, 2],          // Level:6
  [3, 2, 2, 1],       // Level:7
  [3, 3, 2, 2],       // Level:8
  [3, 3, 2, 2, 1],    // Level:9
  [4, 3, 3, 2, 2],    // Level:10
  [4, 4, 3, 2, 2, 1], // Level:11
  [4, 4, 3, 3, 2, 2], // Level:12
  [4, 4, 4, 3, 2, 2], // Level:13
  [4, 4, 4, 3, 3, 2], // Level:14
  [5, 4, 4, 3, 3, 2], // Level:15
  [5, 5, 4, 3, 3, 2], // Level:16
  [5, 5, 4, 4, 3, 3], // Level:17
  [6, 5, 4, 4, 3, 3], // Level:18
  [6, 5, 5, 4, 3, 3], // Level:19
  [6, 5, 5, 4, 4, 3]  // Level:20
];

bfrpg.MagicUserThief_ABILITY_TABLE = [
  [25, 20, 30, 25, 80, 10, 30], // Level:1
  [30, 25, 35, 30, 81, 15, 34], // Level:2
  [35, 30, 40, 35, 82, 20, 38], // Level:3
  [40, 35, 45, 40, 83, 25, 42], // Level:4
  [45, 40, 50, 45, 84, 30, 46], // Level:5
  [50, 45, 55, 50, 85, 35, 50], // Level:6
  [55, 50, 60, 55, 86, 40, 54], // Level:7
  [60, 55, 65, 60, 87, 45, 58], // Level:8
  [65, 60, 70, 65, 88, 50, 62], // Level:9
  [68, 63, 74, 68, 89, 53, 65], // Level:10
  [71, 66, 78, 71, 90, 56, 68], // Level:11
  [74, 69, 82, 74, 91, 59, 71], // Level:12
  [77, 72, 86, 77, 92, 62, 74], // Level:13
  [80, 75, 90, 80, 93, 65, 77], // Level:14
  [83, 78, 94, 83, 94, 68, 80], // Level:15
  [84, 79, 95, 85, 95, 69, 83], // Level:16
  [85, 80, 96, 87, 96, 70, 86], // Level:17
  [86, 81, 97, 89, 97, 71, 89], // Level:18
  [87, 82, 98, 91, 98, 72, 92], // Level:19
  [88, 83, 99, 93, 99, 73, 95]  // Level:20
];
// ==============================

// Racial Abilities/Restrictions
bfrpg.RacialAbilities = {
  "darkvision": "Darkvision 60'",
  "stonework": "Detect stonework: slanting passages/traps/shifting walls/new construction on 1-2 in 1d6",
  "noLweapons": "No L sized weapons >4' in length (two-handed swords, polearms, longbows)",
  "doors": "Find Secret Doors on 1-2 in 1d6, 1 in 1d6 if not searching",
  "surprise": "Surprised only 1 in 1d6",
  "paralysis": "Immune to Ghoul paralysis",
  "hide": "90% Hide in outdoors, 70% Hide in other environments",
  "noLMweapons": "No L weapons, M weapons require both hands",
  "xpbonus": "+10% Bonus to XP",
  "maxhd": "d6 max Hit Die",
  "ranged": "+1 ToHit using Ranged Weapons",
  "initiative": "+1 on Initiative Rolls",
  "largeAC": "+2 AC Bonus vs. size L"
};


// Armor Proficiencies
bfrpg.ArmorProficiencies = {
  "all": "All",
  "none": "None",
  "leather": "Leather only, No metal, No Shield"
};


// Weapon Proficiencies
bfrpg.WeaponProficiencies = {
  "all": "All",
  "blunt": "Blunt",
  "dagger": "Dagger or Walking Staff"
};

// Special Attacks & Bonuses
bfrpg.SpecialAttacks = {
};

// Special Defenses & Bonuses
bfrpg.SpecialDefenses = {
};

// Miscellaneous Traits
bfrpg.MiscTraits = {
};


// Challenge Rating XP Levels
bfrpg.HD_EXP_LEVELS = [
  10, 25, 75, 145, 240, 360, 500, 670, 875, 1075, 1300, 1575, 1875, 2175, 2500, 2850, 3250, 3600,
  4000, 4500, 5250, 6000, 6750, 7500, 8250, 9000, 10000, 11000, 12250, 13500, 15000
];

bfrpg.HD_EXP_BONUS_LEVELS = [
  3, 12, 25, 30, 40, 45, 55, 65, 70, 75, 90, 100, 110, 115, 125, 135, 145, 160,
  175, 200, 225, 250, 275, 300, 325, 355, 385, 420, 455, 495, 530
];

bfrpg.saveClasses = {
  "fighter": "Fighter",
  "cleric": "Cleric",
  "thief": "Thief",
  "magicuser": "Magic-User"
};


/* End MRP edit */



/**
 * The set of Ability Scores used within the system
 * @type {Object}
 */
bfrpg.abilities = {
  "str": "bfrpg.AbilityStr",
  "dex": "bfrpg.AbilityDex",
  "con": "bfrpg.AbilityCon",
  "int": "bfrpg.AbilityInt",
  "wis": "bfrpg.AbilityWis",
  "cha": "bfrpg.AbilityCha"
};

bfrpg.abilityAbbreviations = {
  "str": "bfrpg.AbilityStrAbbr",
  "dex": "bfrpg.AbilityDexAbbr",
  "con": "bfrpg.AbilityConAbbr",
  "int": "bfrpg.AbilityIntAbbr",
  "wis": "bfrpg.AbilityWisAbbr",
  "cha": "bfrpg.AbilityChaAbbr"
};

/* -------------------------------------------- */

/**
 * Character alignment options
 * @type {Object}
 */
bfrpg.alignments = {
  'lg': "bfrpg.AlignmentLG",
  'ng': "bfrpg.AlignmentNG",
  'cg': "bfrpg.AlignmentCG",
  'ln': "bfrpg.AlignmentLN",
  'tn': "bfrpg.AlignmentTN",
  'cn': "bfrpg.AlignmentCN",
  'le': "bfrpg.AlignmentLE",
  'ne': "bfrpg.AlignmentNE",
  'ce': "bfrpg.AlignmentCE"
};


/* bfrpg.weaponProficiencies = {
  "sim": "bfrpg.WeaponSimpleProficiency",
  "mar": "bfrpg.WeaponMartialProficiency"
};  */

bfrpg.toolProficiencies = {
  "art": "bfrpg.ToolArtisans",
  "disg": "bfrpg.ToolDisguiseKit",
  "forg": "bfrpg.ToolForgeryKit",
  "game": "bfrpg.ToolGamingSet",
  "herb": "bfrpg.ToolHerbalismKit",
  "music": "bfrpg.ToolMusicalInstrument",
  "navg": "bfrpg.ToolNavigators",
  "pois": "bfrpg.ToolPoisonersKit",
  "thief": "bfrpg.ToolThieves",
  "vehicle": "bfrpg.ToolVehicle"
};


/* -------------------------------------------- */

/**
 * This Object defines the various lengths of time which can occur
 * @type {Object}
 */
bfrpg.timePeriods = {
  "inst": "bfrpg.TimeInst",
  "turn": "bfrpg.TimeTurn",
  "round": "bfrpg.TimeRound",
  "minute": "bfrpg.TimeMinute",
  "hour": "bfrpg.TimeHour",
  "day": "bfrpg.TimeDay",
  "month": "bfrpg.TimeMonth",
  "year": "bfrpg.TimeYear",
  "perm": "bfrpg.TimePerm",
  "spec": "bfrpg.Special"
};


/* -------------------------------------------- */

/**
 * This describes the ways that an ability can be activated
 * @type {Object}
 */
bfrpg.abilityActivationTypes = {
  "none": "bfrpg.None",
  "action": "bfrpg.Action",
  "bonus": "bfrpg.BonusAction",
  "reaction": "bfrpg.Reaction",
  "minute": bfrpg.timePeriods.minute,
  "hour": bfrpg.timePeriods.hour,
  "day": bfrpg.timePeriods.day,
  "special": bfrpg.timePeriods.spec,
  "legendary": "bfrpg.LegAct",
  "lair": "bfrpg.LairAct",
  "crew": "bfrpg.VehicleCrewAction"
};

/* -------------------------------------------- */


bfrpg.abilityConsumptionTypes = {
  "ammo": "bfrpg.ConsumeAmmunition",
  "attribute": "bfrpg.ConsumeAttribute",
  "material": "bfrpg.ConsumeMaterial",
  "charges": "bfrpg.ConsumeCharges"
};


/* -------------------------------------------- */

// Creature Sizes
bfrpg.actorSizes = {
  "tiny": "bfrpg.SizeTiny",
  "sm": "bfrpg.SizeSmall",
  "med": "bfrpg.SizeMedium",
  "lg": "bfrpg.SizeLarge",
  "huge": "bfrpg.SizeHuge",
  "grg": "bfrpg.SizeGargantuan"
};

bfrpg.tokenSizes = {
  "tiny": 1,
  "sm": 1,
  "med": 1,
  "lg": 2,
  "huge": 3,
  "grg": 4
};

/* -------------------------------------------- */

/**
 * Classification types for item action types
 * @type {Object}
 */
bfrpg.itemActionTypes = {
  "mwak": "bfrpg.ActionMWAK",
  "rwak": "bfrpg.ActionRWAK",
  "msak": "bfrpg.ActionMSAK",
  "rsak": "bfrpg.ActionRSAK",
  "save": "bfrpg.ActionSave",
  "heal": "bfrpg.ActionHeal",
  "abil": "bfrpg.ActionAbil",
  "util": "bfrpg.ActionUtil",
  "other": "bfrpg.ActionOther"
};

/* -------------------------------------------- */

bfrpg.itemCapacityTypes = {
  "items": "bfrpg.ItemContainerCapacityItems",
  "weight": "bfrpg.ItemContainerCapacityWeight"
};

/* -------------------------------------------- */

/**
 * Enumerate the lengths of time over which an item can have limited use ability
 * @type {Object}
 */
bfrpg.limitedUsePeriods = {
  "sr": "bfrpg.ShortRest",
  "lr": "bfrpg.LongRest",
  "day": "bfrpg.Day",
  "charges": "bfrpg.Charges"
};


/* -------------------------------------------- */

/**
 * The set of equipment types for armor, clothing, and other objects which can ber worn by the character
 * @type {Object}
 */
bfrpg.equipmentTypes = {
//  "light": "bfrpg.EquipmentLight",
//  "medium": "bfrpg.EquipmentMedium",
//  "heavy": "bfrpg.EquipmentHeavy",
//  "natural": "bfrpg.EquipmentNatural",
  "bonus": "bfrpg.EquipmentBonus",
  "shield": "bfrpg.EquipmentShield",
  "clothing": "bfrpg.EquipmentClothing",
  "trinket": "bfrpg.EquipmentTrinket",
  "vehicle": "bfrpg.EquipmentVehicle",
  "leather": "bfrpg.EquipmentLeather",
  "leathermagic": "bfrpg.EquipmentLeatherMagic",
  "metal": "bfrpg.EquipmentMetal",
  "metalmagic": "bfrpg.EquipmentMetalMagic"
};


/* -------------------------------------------- */

/**
 * The set of Armor Proficiencies which a character may have
 * @type {Object}
 */
/* bfrpg.armorProficiencies = {
  "lgt": bfrpg.equipmentTypes.light,
  "med": bfrpg.equipmentTypes.medium,
  "hvy": bfrpg.equipmentTypes.heavy,
  "shl": "bfrpg.EquipmentShieldProficiency"
};  */


/* -------------------------------------------- */

/**
 * Enumerate the valid consumable types which are recognized by the system
 * @type {Object}
 */
bfrpg.consumableTypes = {
  "ammo": "bfrpg.ConsumableAmmunition",
  "potion": "bfrpg.ConsumablePotion",
  "poison": "bfrpg.ConsumablePoison",
  "food": "bfrpg.ConsumableFood",
  "scroll": "bfrpg.ConsumableScroll",
  "wand": "bfrpg.ConsumableWand",
  "rod": "bfrpg.ConsumableRod",
  "trinket": "bfrpg.ConsumableTrinket"
};

/* -------------------------------------------- */

/**
 * The valid currency denominations supported by the BFRPG system
 * @type {Object}
 */
bfrpg.currencies = {
  "pp": "bfrpg.CurrencyPP",
  "gp": "bfrpg.CurrencyGP",
  "ep": "bfrpg.CurrencyEP",
  "sp": "bfrpg.CurrencySP",
  "cp": "bfrpg.CurrencyCP",
};


/**
 * Define the upwards-conversion rules for registered currency types
 * @type {{string, object}}
 */
bfrpg.currencyConversion = {
  cp: {into: "sp", each: 10},
  sp: {into: "ep", each: 5 },
  ep: {into: "gp", each: 2 },
  gp: {into: "pp", each: 10}
};

/* -------------------------------------------- */


// Damage Types
bfrpg.damageTypes = {
  "acid": "bfrpg.DamageAcid",
  "bludgeoning": "bfrpg.DamageBludgeoning",
  "cold": "bfrpg.DamageCold",
  "fire": "bfrpg.DamageFire",
  "force": "bfrpg.DamageForce",
  "lightning": "bfrpg.DamageLightning",
  "necrotic": "bfrpg.DamageNecrotic",
  "piercing": "bfrpg.DamagePiercing",
  "poison": "bfrpg.DamagePoison",
  "psychic": "bfrpg.DamagePsychic",
  "radiant": "bfrpg.DamageRadiant",
  "slashing": "bfrpg.DamageSlashing",
  "thunder": "bfrpg.DamageThunder"
};

// Damage Resistance Types
bfrpg.damageResistanceTypes = mergeObject(duplicate(bfrpg.damageTypes), {
  "physical": "bfrpg.DamagePhysical"
});


/* -------------------------------------------- */


/**
 * The valid units of measure for movement distances in the game system.
 * By default this uses the imperial units of feet and miles.
 * @type {Object<string,string>}
 */
bfrpg.movementUnits = {
  "ft": "bfrpg.DistFt",
  "mi": "bfrpg.DistMi"
}

/**
 * The valid units of measure for the range of an action or effect.
 * This object automatically includes the movement units from bfrpg.movementUnits
 * @type {Object<string,string>}
 */
bfrpg.distanceUnits = {
  "none": "bfrpg.None",
  "self": "bfrpg.DistSelf",
  "touch": "bfrpg.DistTouch",
  "spec": "bfrpg.Special",
  "any": "bfrpg.DistAny"
};
for ( let [k, v] of Object.entries(bfrpg.movementUnits) ) {
  bfrpg.distanceUnits[k] = v;
}

/* -------------------------------------------- */


/**
 * Configure aspects of encumbrance calculation so that it could be configured by modules
 * @type {Object}
 */
bfrpg.encumbrance = {
  currencyPerWeight: 50,
  strMultiplier: 15,
  vehicleWeightMultiplier: 2000 // 2000 lbs in a ton
};

/* -------------------------------------------- */

/**
 * This Object defines the types of single or area targets which can be applied
 * @type {Object}
 */
bfrpg.targetTypes = {
  "none": "bfrpg.None",
  "self": "bfrpg.TargetSelf",
  "creature": "bfrpg.TargetCreature",
  "ally": "bfrpg.TargetAlly",
  "enemy": "bfrpg.TargetEnemy",
  "object": "bfrpg.TargetObject",
  "space": "bfrpg.TargetSpace",
  "radius": "bfrpg.TargetRadius",
  "sphere": "bfrpg.TargetSphere",
  "cylinder": "bfrpg.TargetCylinder",
  "cone": "bfrpg.TargetCone",
  "square": "bfrpg.TargetSquare",
  "cube": "bfrpg.TargetCube",
  "line": "bfrpg.TargetLine",
  "wall": "bfrpg.TargetWall"
};


/* -------------------------------------------- */


/**
 * Map the subset of target types which produce a template area of effect
 * The keys are bfrpg target types and the values are MeasuredTemplate shape types
 * @type {Object}
 */
bfrpg.areaTargetTypes = {
  cone: "cone",
  cube: "rect",
  cylinder: "circle",
  line: "ray",
  radius: "circle",
  sphere: "circle",
  square: "rect",
  wall: "ray"
};


/* -------------------------------------------- */

// Healing Types
bfrpg.healingTypes = {
  "healing": "bfrpg.Healing",
  "temphp": "bfrpg.HealingTemp"
};


/* -------------------------------------------- */


/**
 * Enumerate the denominations of hit dice which can apply to classes
 * @type {Array.<string>}
 */
bfrpg.hitDieTypes = ["d6", "d8", "d10", "d12"];


/* -------------------------------------------- */

/**
 * Character senses options
 * @type {Object}
 */
bfrpg.senses = {
  "bs": "bfrpg.SenseBS",
  "dv": "bfrpg.SenseDV",
  "ts": "bfrpg.SenseTS",
  "tr": "bfrpg.SenseTR"
};


/* -------------------------------------------- */

/**
 * The set of skill which can be trained
 * @type {Object}
 */
bfrpg.skills = {
  "acr": "bfrpg.SkillAcr",
  "ani": "bfrpg.SkillAni",
  "arc": "bfrpg.SkillArc",
  "ath": "bfrpg.SkillAth",
  "dec": "bfrpg.SkillDec",
  "his": "bfrpg.SkillHis",
  "ins": "bfrpg.SkillIns",
  "itm": "bfrpg.SkillItm",
  "inv": "bfrpg.SkillInv",
  "med": "bfrpg.SkillMed",
  "nat": "bfrpg.SkillNat",
  "prc": "bfrpg.SkillPrc",
  "prf": "bfrpg.SkillPrf",
  "per": "bfrpg.SkillPer",
  "rel": "bfrpg.SkillRel",
  "slt": "bfrpg.SkillSlt",
  "ste": "bfrpg.SkillSte",
  "sur": "bfrpg.SkillSur"
};


/* -------------------------------------------- */

bfrpg.spellPreparationModes = {
  "prepared": "bfrpg.SpellPrepPrepared",
  "pact": "bfrpg.PactMagic",
  "always": "bfrpg.SpellPrepAlways",
  "atwill": "bfrpg.SpellPrepAtWill",
  "innate": "bfrpg.SpellPrepInnate"
};

bfrpg.spellUpcastModes = ["always", "pact", "prepared"];

bfrpg.spellProgression = {
  "none": "bfrpg.SpellNone",
  "full": "bfrpg.SpellProgFull",
  "half": "bfrpg.SpellProgHalf",
  "third": "bfrpg.SpellProgThird",
  "pact": "bfrpg.SpellProgPact",
  "artificer": "bfrpg.SpellProgArt"
};

/* -------------------------------------------- */

/**
 * The available choices for how spell damage scaling may be computed
 * @type {Object}
 */
bfrpg.spellScalingModes = {
  "none": "bfrpg.SpellNone",
  "cantrip": "bfrpg.SpellCantrip",
  "level": "bfrpg.SpellLevel"
};

/* -------------------------------------------- */


/**
 * Define the set of types which a weapon item can take
 * @type {Object}
 */
bfrpg.weaponTypes = {
  "simpleM": "bfrpg.WeaponSimpleM",
  "simpleR": "bfrpg.WeaponSimpleR",
  "martialM": "bfrpg.WeaponMartialM",
  "martialR": "bfrpg.WeaponMartialR",
  "natural": "bfrpg.WeaponNatural",
  "improv": "bfrpg.WeaponImprov",
  "siege": "bfrpg.WeaponSiege"
};


/* -------------------------------------------- */

/**
 * Define the set of weapon property flags which can exist on a weapon
 * @type {Object}
 */
bfrpg.weaponProperties = {
  "amm": "bfrpg.WeaponPropertiesAmm",
  "hvy": "bfrpg.WeaponPropertiesHvy",
  "fin": "bfrpg.WeaponPropertiesFin",
  "fir": "bfrpg.WeaponPropertiesFir",
  "foc": "bfrpg.WeaponPropertiesFoc",
  "lgt": "bfrpg.WeaponPropertiesLgt",
  "lod": "bfrpg.WeaponPropertiesLod",
  "rch": "bfrpg.WeaponPropertiesRch",
  "rel": "bfrpg.WeaponPropertiesRel",
  "ret": "bfrpg.WeaponPropertiesRet",
  "spc": "bfrpg.WeaponPropertiesSpc",
  "thr": "bfrpg.WeaponPropertiesThr",
  "two": "bfrpg.WeaponPropertiesTwo",
  "ver": "bfrpg.WeaponPropertiesVer"
};


// Spell Components
bfrpg.spellComponents = {
  "V": "bfrpg.ComponentVerbal",
  "S": "bfrpg.ComponentSomatic",
  "M": "bfrpg.ComponentMaterial"
};

// Spell Schools
bfrpg.spellSchools = {
  "abj": "bfrpg.SchoolAbj",
  "con": "bfrpg.SchoolCon",
  "div": "bfrpg.SchoolDiv",
  "enc": "bfrpg.SchoolEnc",
  "evo": "bfrpg.SchoolEvo",
  "ill": "bfrpg.SchoolIll",
  "nec": "bfrpg.SchoolNec",
  "trs": "bfrpg.SchoolTrs"
};

// Spell Levels
bfrpg.spellLevels = {
  0: "bfrpg.SpellLevel0",
  1: "bfrpg.SpellLevel1",
  2: "bfrpg.SpellLevel2",
  3: "bfrpg.SpellLevel3",
  4: "bfrpg.SpellLevel4",
  5: "bfrpg.SpellLevel5",
  6: "bfrpg.SpellLevel6",
  7: "bfrpg.SpellLevel7",
  8: "bfrpg.SpellLevel8",
  9: "bfrpg.SpellLevel9"
};

// Spell Scroll Compendium UUIDs
bfrpg.spellScrollIds = {
  0: 'Compendium.bfrpg.items.rQ6sO7HDWzqMhSI3',
  1: 'Compendium.bfrpg.items.9GSfMg0VOA2b4uFN',
  2: 'Compendium.bfrpg.items.XdDp6CKh9qEvPTuS',
  3: 'Compendium.bfrpg.items.hqVKZie7x9w3Kqds',
  4: 'Compendium.bfrpg.items.DM7hzgL836ZyUFB1',
  5: 'Compendium.bfrpg.items.wa1VF8TXHmkrrR35',
  6: 'Compendium.bfrpg.items.tI3rWx4bxefNCexS',
  7: 'Compendium.bfrpg.items.mtyw4NS1s7j2EJaD',
  8: 'Compendium.bfrpg.items.aOrinPg7yuDZEuWr',
  9: 'Compendium.bfrpg.items.O4YbkJkLlnsgUszZ'
};

/**
 * Define the standard slot progression by character level.
 * The entries of this array represent the spell slot progression for a full spell-caster.
 * @type {Array[]}
 */
bfrpg.SPELL_SLOT_TABLE = [
  [2],
  [3],
  [4, 2],
  [4, 3],
  [4, 3, 2],
  [4, 3, 3],
  [4, 3, 3, 1],
  [4, 3, 3, 2],
  [4, 3, 3, 3, 1],
  [4, 3, 3, 3, 2],
  [4, 3, 3, 3, 2, 1],
  [4, 3, 3, 3, 2, 1],
  [4, 3, 3, 3, 2, 1, 1],
  [4, 3, 3, 3, 2, 1, 1],
  [4, 3, 3, 3, 2, 1, 1, 1],
  [4, 3, 3, 3, 2, 1, 1, 1],
  [4, 3, 3, 3, 2, 1, 1, 1, 1],
  [4, 3, 3, 3, 3, 1, 1, 1, 1],
  [4, 3, 3, 3, 3, 2, 1, 1, 1],
  [4, 3, 3, 3, 3, 2, 2, 1, 1]
];

/* -------------------------------------------- */

// Polymorph options.
bfrpg.polymorphSettings = {
  keepPhysical: 'bfrpg.PolymorphKeepPhysical',
  keepMental: 'bfrpg.PolymorphKeepMental',
  keepSaves: 'bfrpg.PolymorphKeepSaves',
  keepSkills: 'bfrpg.PolymorphKeepSkills',
  mergeSaves: 'bfrpg.PolymorphMergeSaves',
  mergeSkills: 'bfrpg.PolymorphMergeSkills',
  keepClass: 'bfrpg.PolymorphKeepClass',
  keepFeats: 'bfrpg.PolymorphKeepFeats',
  keepSpells: 'bfrpg.PolymorphKeepSpells',
  keepItems: 'bfrpg.PolymorphKeepItems',
  keepBio: 'bfrpg.PolymorphKeepBio',
  keepVision: 'bfrpg.PolymorphKeepVision'
};

/* -------------------------------------------- */

/**
 * Skill, ability, and tool proficiency levels
 * Each level provides a proficiency multiplier
 * @type {Object}
 */
bfrpg.proficiencyLevels = {
  0: "bfrpg.NotProficient",
  1: "bfrpg.Proficient",
  0.5: "bfrpg.HalfProficient",
  2: "bfrpg.Expertise"
};

/* -------------------------------------------- */

/**
 * The amount of cover provided by an object.
 * In cases where multiple pieces of cover are
 * in play, we take the highest value.
 */
bfrpg.cover = {
  0: 'bfrpg.None',
  .5: 'bfrpg.CoverHalf',
  .75: 'bfrpg.CoverThreeQuarters',
  1: 'bfrpg.CoverTotal'
};

/* -------------------------------------------- */


// Condition Types
bfrpg.conditionTypes = {
  "blinded": "bfrpg.ConBlinded",
  "charmed": "bfrpg.ConCharmed",
  "deafened": "bfrpg.ConDeafened",
  "diseased": "bfrpg.ConDiseased",
  "exhaustion": "bfrpg.ConExhaustion",
  "frightened": "bfrpg.ConFrightened",
  "grappled": "bfrpg.ConGrappled",
  "incapacitated": "bfrpg.ConIncapacitated",
  "invisible": "bfrpg.ConInvisible",
  "paralyzed": "bfrpg.ConParalyzed",
  "petrified": "bfrpg.ConPetrified",
  "poisoned": "bfrpg.ConPoisoned",
  "prone": "bfrpg.ConProne",
  "restrained": "bfrpg.ConRestrained",
  "stunned": "bfrpg.ConStunned",
  "unconscious": "bfrpg.ConUnconscious"
};

// Languages
bfrpg.languages = {
  "common": "bfrpg.LanguagesCommon",
  "aarakocra": "bfrpg.LanguagesAarakocra",
  "abyssal": "bfrpg.LanguagesAbyssal",
  "aquan": "bfrpg.LanguagesAquan",
  "auran": "bfrpg.LanguagesAuran",
  "celestial": "bfrpg.LanguagesCelestial",
  "deep": "bfrpg.LanguagesDeepSpeech",
  "draconic": "bfrpg.LanguagesDraconic",
  "druidic": "bfrpg.LanguagesDruidic",
  "dwarvish": "bfrpg.LanguagesDwarvish",
  "elvish": "bfrpg.LanguagesElvish",
  "giant": "bfrpg.LanguagesGiant",
  "gith": "bfrpg.LanguagesGith",
  "gnomish": "bfrpg.LanguagesGnomish",
  "goblin": "bfrpg.LanguagesGoblin",
  "gnoll": "bfrpg.LanguagesGnoll",
  "halfling": "bfrpg.LanguagesHalfling",
  "ignan": "bfrpg.LanguagesIgnan",
  "infernal": "bfrpg.LanguagesInfernal",
  "orc": "bfrpg.LanguagesOrc",
  "primordial": "bfrpg.LanguagesPrimordial",
  "sylvan": "bfrpg.LanguagesSylvan",
  "terran": "bfrpg.LanguagesTerran",
  "cant": "bfrpg.LanguagesThievesCant",
  "undercommon": "bfrpg.LanguagesUndercommon"
};

// Character Level XP Requirements
bfrpg.CHARACTER_EXP_LEVELS =  [
  0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000, 85000, 100000,
  120000, 140000, 165000, 195000, 225000, 265000, 305000, 355000]
;

// Challenge Rating XP Levels
bfrpg.CR_EXP_LEVELS = [
  10, 200, 450, 700, 1100, 1800, 2300, 2900, 3900, 5000, 5900, 7200, 8400, 10000, 11500, 13000, 15000, 18000,
  20000, 22000, 25000, 33000, 41000, 50000, 62000, 75000, 90000, 105000, 120000, 135000, 155000
];

// Character Features Per Class And Level
bfrpg.classFeatures = ClassFeatures;

// Configure Optional Character Flags
bfrpg.characterFlags = {
  "diamondSoul": {
    name: "bfrpg.FlagsDiamondSoul",
    hint: "bfrpg.FlagsDiamondSoulHint",
    section: "Feats",
    type: Boolean
  },
  "elvenAccuracy": {
    name: "bfrpg.FlagsElvenAccuracy",
    hint: "bfrpg.FlagsElvenAccuracyHint",
    section: "Racial Traits",
    type: Boolean
  },
  "halflingLucky": {
    name: "bfrpg.FlagsHalflingLucky",
    hint: "bfrpg.FlagsHalflingLuckyHint",
    section: "Racial Traits",
    type: Boolean
  },
  "initiativeAdv": {
    name: "bfrpg.FlagsInitiativeAdv",
    hint: "bfrpg.FlagsInitiativeAdvHint",
    section: "Feats",
    type: Boolean
  },
  "initiativeAlert": {
    name: "bfrpg.FlagsAlert",
    hint: "bfrpg.FlagsAlertHint",
    section: "Feats",
    type: Boolean
  },
  "jackOfAllTrades": {
    name: "bfrpg.FlagsJOAT",
    hint: "bfrpg.FlagsJOATHint",
    section: "Feats",
    type: Boolean
  },
  "observantFeat": {
    name: "bfrpg.FlagsObservant",
    hint: "bfrpg.FlagsObservantHint",
    skills: ['prc','inv'],
    section: "Feats",
    type: Boolean
  },
  "powerfulBuild": {
    name: "bfrpg.FlagsPowerfulBuild",
    hint: "bfrpg.FlagsPowerfulBuildHint",
    section: "Racial Traits",
    type: Boolean
  },
  "reliableTalent": {
    name: "bfrpg.FlagsReliableTalent",
    hint: "bfrpg.FlagsReliableTalentHint",
    section: "Feats",
    type: Boolean
  },
  "remarkableAthlete": {
    name: "bfrpg.FlagsRemarkableAthlete",
    hint: "bfrpg.FlagsRemarkableAthleteHint",
    abilities: ['str','dex','con'],
    section: "Feats",
    type: Boolean
  },
  "weaponCriticalThreshold": {
    name: "bfrpg.FlagsWeaponCritThreshold",
    hint: "bfrpg.FlagsWeaponCritThresholdHint",
    section: "Feats",
    type: Number,
    placeholder: 20
  },
  "spellCriticalThreshold": {
    name: "bfrpg.FlagsSpellCritThreshold",
    hint: "bfrpg.FlagsSpellCritThresholdHint",
    section: "Feats",
    type: Number,
    placeholder: 20
  },
  "meleeCriticalDamageDice": {
    name: "bfrpg.FlagsMeleeCriticalDice",
    hint: "bfrpg.FlagsMeleeCriticalDiceHint",
    section: "Feats",
    type: Number,
    placeholder: 0
  },
};

// Configure allowed status flags
bfrpg.allowedActorFlags = ["isPolymorphed", "originalActor"].concat(Object.keys(bfrpg.characterFlags));
