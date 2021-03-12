var roomManager = {

    /** @param {Room} room **/
    run: function(room) {
        const terrain = new Room.Terrain(room.name);
        var sources = room.find(FIND_SOURCES);

        for (source of sources) {
            const pos = source.pos;
            var harvestPos = 8;
            var range = [-1,0,1];
            for (i of range ){
                for (k of range) {
                    if (terrain.get(pos.x + i, pos.x + k) = TERRAIN_MASK_WALL) {
                        harvestPos = harvestPos - 1;
                    }
                }
            }
            room[source.id].availablePos = harvestPos;
        }
    }
};

module.exports = roomManager;