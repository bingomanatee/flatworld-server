const newCanvas = require('./newCanvas');
const {fabric} = require('fabric');
const fs = require('fs');

module.exports = (data, num, size) => {
  canvas = newCanvas(size, 'black');
  const scale = size / 100;
  for (let edge of data.edges) {
    let points = edge.map((c) =>({x: c[0] * scale, y: c[1] * scale}));
    let line = new fabric.Polyline(points, {stroke: 'white', strokeWidth: 3});
    canvas.add(line);
  }
  canvas.renderAll();
  canvas.createPNGStream().pipe(fs.createWriteStream(`${__dirname}/worldSnapshots/world_coord_images/edge_${num}.png`));
};
