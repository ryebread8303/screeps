/*var utility = require('utility');*/
var utilQueue = require('queue.src');
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roomManager = require('roommanager');
module.exports.loop = function () {
    roomManager.run(Game.rooms['sim']);
    let rolesList = ['harvester','builder','upgrader'];
    // garbage collection
        for(var name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }
        for(var role of rolesList) {
            //console.log('Clearing old role count for:', role);
            delete Memory[ role ];
        }
    //utility functions
    function countRole(role) {
        var creepsRole = _.filter(Game.creeps, (creep) => creep.memory.role == role);
        Memory[ role ] = creepsRole.length;
    }

    // autospawn
    var creepCount = Object.keys(Game.creeps).length;
    Memory['creepsCount'] = creepCount;
    for (var role of rolesList){
        countRole(role);
    }

    if(Memory.harvester / creepCount < .5) {
        var newName = 'Harvester' + Game.time;
        Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,CARRY,MOVE,MOVE], newName,
            {memory: {role: 'harvester'}});
    }
    else if (Memory.upgrader / creepCount < .1) {
        var newName = 'Upgrader' + Game.time;
        Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,CARRY,MOVE,MOVE], newName,
            {memory: {role: 'upgrader'}});
    }
    else if (Memory.builder /creepCount < .4) {
        var newName = 'Builder' + Game.time;
        Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,CARRY,MOVE,MOVE], newName,
            {memory: {role: 'builder'}});
    }

    if(Game.spawns['Spawn1'].spawning) {
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y,
            {align: 'left', opacity: 0.8});
    }
// tower behavior
    var tower = Game.getObjectById('514806a6eb1de3ca0d7308a9');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }
// creep behavior
    //check for spawner energy count, let harvesters act as upgraders if it's full
    var spawnFreespace = Game.spawns['Spawn1'].store.getFreeCapacity('energy');
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            if (spawnFreespace == 0) {
                roleBuilder.run(creep);
            }else {
                roleHarvester.run(creep);
            }
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}