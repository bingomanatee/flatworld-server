const worldTiler = require('./WorldTiler');
const bottle = worldTiler();
const fs = require('fs');

for (let recurse of [0,1,2,3,4,5, 6]) {
  let world = bottle.container.World.fromIso(1, recurse);
  world.init();
  let data = world.data(100);
  fs.writeFileSync(__dirname + '/worldSnapshots/world_coords/recurse' + recurse + '.json', JSON.stringify(data));
}
