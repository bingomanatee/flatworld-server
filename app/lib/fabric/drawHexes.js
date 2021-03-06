const {fabric} = require('fabric');
const tinyGradient = require('tinygradient');
const tinyColor = require('tinycolor2');
const newCanvas = require('./newCanvas');
const _ = require('lodash');
const fs = require('fs');

const spectrumMap = new Map();

const COLORS_PER_SPECTRUM = 6;

let seedColorsBase = tinyGradient(['red', 'green', 'blue']).hsv(100);
let lightColors = seedColorsBase.map((c) => c.clone().lighten(20));
seedColorsBase = _.shuffle(seedColorsBase.concat(seedColorsBase.map((c) => c.clone().darken(10))).concat(lightColors));

let seedColors = [seedColorsBase.pop()];

let tries = 0;

while (seedColorsBase.length) {
  let last = _.last(seedColors);
  let next = _.first(seedColorsBase);
  if (tries > 3 || tinyColor.readability(last, next) > 10) {
    seedColors.push(seedColorsBase.shift());
    tries = 0;
  } else {
    seedColorsBase = _.shuffle(seedColorsBase);
    ++tries;
  }
}

const getColor = (i) => {
  let spectrum = getSpectrum(Math.floor(i / COLORS_PER_SPECTRUM));
  let color = spectrum[i % COLORS_PER_SPECTRUM];
  return color;
};

const getSpectrum = (series) => {
  if (!spectrumMap.has(series)) {
    let color1 = seedColors[series % seedColors.length];
    let color2 = seedColors[(series + 1) % seedColors.length];
    spectrumMap.set(series, tinyGradient([color1, color2]).rgb(COLORS_PER_SPECTRUM));
  }
  return spectrumMap.get(series);
};

module.exports = (data, num, size) => {
  canvas = newCanvas(size, 'black');
  const scale = size / 100;
  const scaleCoord = (n) => (scale * n);

  for (let hex of _.values(data.hexes)) {
    let {uvs, id} = hex;
    id = parseInt(id);
    let fill = getColor(id).toRgbString();
    for (let wedge of uvs) {
      wedge = wedge.map((pt) => pt.map(scaleCoord))
        .map((pt) => ({x: pt[0], y: pt[1]}));
      canvas.add(new fabric.Polyline(wedge, {stroke: fill, strokeWidth: 4, fill}));
    }
  }
  for (let edge of data.edges) {
    let points = edge.map((c) =>({x: c[0] * scale, y: c[1] * scale}));
    let line = new fabric.Polyline(points, {stroke: 'grey', strokeWidth: 1});
    canvas.add(line);
  }
  canvas.renderAll();
  canvas.createPNGStream().pipe(fs.createWriteStream(`${__dirname}/worldSnapshots/world_coord_images/hexes_${num}.png`));
};
