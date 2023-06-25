const config = {
    type: Phaser.AUTO,
    width: 1074,
    height: 782.667,
    dom: { createContainer: true },

    scene: [
        Menu,
        Credit,
        Settings,
        Load_Game,
        Start,
        Test,

    ],

    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'core'
    },

    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },

    audio: { disableWebAudio: true },

    fps: {//   '120' FPS
        target: 120,
        forceSetTimeOut: false
    },

    fullScreenTarget: document.getElementById('core'),
    parent: "core"
};

let GAME = {
    "roundTime": 20, // each 1 minute
    "playerBreak": 1
}

// default config
let UPGRADES = [
    {"name": "Resistance", "description": "Increases the player's health max", "levelMax": 4, "img": 0},
    {"name": "Faster movement", "description": "Increases the player's movement speed", "levelMax": 3, "img": 1},
    {"name": "Faster attack", "description": "Increases the player's attack speed", "levelMax": 2, "img": 3},
    {"name": "Strength", "description": "Increases the player's attack strength", "levelMax": 1, "img": 5},
    {"name": "magnetic", "description": "Increases the player's attraction of monster items", "levelMax": 1, "img": 6},
    {"name": "Health", "description": "Increases the player's health", "levelMax": 1000000000, "img": 9},
];

let PLAYER = {
    "key": "player",
    "velocity": 3,
    "scale": 0.3,
    "max_health": 200,
    "damage": 50
}

const DEBUG = {
    "attack": false,
    "monster_rays": false,
    "border_map_collide": false,
}

const MONSTERS = {
    "slime": {
        "nbr": 10,
        "xp": 20, 
        "attackFrame": [0, 13], // 0, 1
        "moveFrame": [26, 30], // 0, 1 
        "animationSpeed": {"attack": 10, "move": 15},

        // class config
        "scale": 0.3,
        "attackFrameProgress": 1,
        "velocity": 1,
        "loot_src": "assets/slime/slimeLoot.png",
        "loot_scale": 0.2,
        "sheet_src": "assets/SlimeAnimations/Green/greenSlimeSpritesheet.png",
        "health": 1,
        "damage": 2,
        "frameSize": [640, 411],
        "maxDistPlayer": 30,
        "key": "slime:sprite",
        "type": "slime"
    },
    
    "crow": {
        "nbr": 5,
        "xp": 35,
        "attackFrame": [25, 29],
        "moveFrame": [5, 9],
        "animationSpeed": {"attack": 5, "move": 10},

        // class config
        "scale": 0.2,
        "attackFrameProgress": 0.75,
        "velocity": 2,
        "loot_src": "assets/crow/crowLoot.png",
        "loot_scale": 0.2,
        "sheet_src": "assets/crow/crow_animation.png",
        "health": 100,
        "damage": 2,
        "frameSize": [400, 400],
        "maxDistPlayer": 130,
        "key": "crow:sprite",
        "type": "crow"
    },
}

