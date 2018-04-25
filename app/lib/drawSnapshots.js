const worldTiler = require('./WorldTiler');
const fs = require('fs');
const {fabric} = require('fabric');

const SIZE = 2000;

const drawEdges = (data, num) => {
  let canvas = new fabric.StaticCanvas(null, {width: SIZE, height: SIZE});
  canvas.add(new fabric.Rect({width: SIZE, height: SIZE, fill: 'black'}));
  const scale = SIZE / 100;
  for (let edge of data.edges) {
    let points = edge.map((c) =>({x: c[0] * scale, y: c[1] * scale}));
    let line = new fabric.Polyline(points, {stroke: 'white', strokeWidth: 3});
    canvas.add(line);
  }
  canvas.renderAll();
  canvas.createPNGStream().pipe(fs.createWriteStream(`${__dirname}/worldSnapshots/world_coord_images/edge_${num}.png`));
};

for (let recurse of [0, 1, 2, 3, 4, 5]) {
  let data = JSON.parse(fs.readFileSync(__dirname + '/worldSnapshots/world_coords/recurse' + recurse + '.json'));

  drawEdges(data, recurse);
}
