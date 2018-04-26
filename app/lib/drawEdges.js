const {createCanvas, loadImage} = require('canvas')
const fs = require('fs');
const _ = require('lodash');

module.exports = (data, num, size) => {
  let canvas = createCanvas(size, size);
  let ctx = canvas.getContext('2d');
  ctx.fillStyle = 'black';
  ctx.fillRect(0,0,size, size);
  const scale = size / 100;
  const coordsToPolyLine = (series) => series.map((c) => ({x: c[0] * scale, y: c[1] * scale}));

  ctx.strokeStyle = 'white';
  for (let edge of data.edges) {
    let points = coordsToPolyLine(edge);
    ctx.beginPath();
    let last = _.last(points);
    ctx.moveTo(last.x, last.y);
    for (let pt of points) {
      ctx.lineTo(pt.x, pt.y);
    }
    ctx.closePath();
    ctx.stroke();
  }
  canvas.pngStream().pipe(fs.createWriteStream(`${__dirname}/worldSnapshots/world_coord_images/edge_${num}.png`));
};