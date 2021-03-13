var roomManager = {

    /** @param {Room} room **/
    run: function(room) {
        const terrain = new Room.Terrain(room.name);
        if (room.sources == null){
            var sources = room.find(FIND_SOURCES);
            room.memory.sources = {};

            
            for (var source of sources) {
                const pos = source.pos;
                const id = source.id;
                var harvestPos = 8;
                var record = {};
                // try to count how many open spots are around a source for harvesting
                var range = [-1,0,1];
                for (let i = -1;i < 2;i++){
                    for (let k = -1;k < 2;k++) {
                        if (terrain.get(pos.x + i, pos.x + k) == TERRAIN_MASK_WALL) {
                            harvestPos = harvestPos - 1;
                        }
                    }
                }
                record.MaxHarvester = harvestPos;
                record.CurrentHarvester = 0;
                room.memory.sources[id] = record;
            }
        }
    }
};

module.exports = roomManager;