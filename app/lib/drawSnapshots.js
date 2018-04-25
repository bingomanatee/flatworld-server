const fs = require('fs');
const _ = require('lodash');
const drawEdges = require('./drawEdges');
const drawHexes = require('./drawHexes');

const SIZE = 1024;

require('./makeSnapshots');

for (let recurse of [0, 1, 2, 3, 4, 5]) {
  let data = JSON.parse(fs.readFileSync(__dirname + '/worldSnapshots/world_coords/recurse' + recurse + '.json'));

  drawEdges(data, recurse, SIZE);
  drawHexes(data, recurse, SIZE);
}
