const fs = require('fs');
const _ = require('lodash');
const drawEdges = require('./drawEdges');
const drawHexes = require('./drawHexes');

const SIZE = 1024;
const EDGE_SIZE = 2 * SIZE;
require('./makeSnapshots');

for (let recurse of [0, 1, 2, 3, 4, 5, 6]) {
  let data = JSON.parse(fs.readFileSync(__dirname + '/worldSnapshots/world_coords/recurse' + recurse + '.json'));

  drawEdges(data, recurse, EDGE_SIZE);
  drawHexes(data, recurse, SIZE);
}
