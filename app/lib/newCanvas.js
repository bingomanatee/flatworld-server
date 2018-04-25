const {fabric} = require('fabric');

module.exports = (size, fill) => {
  let canvas = new fabric.StaticCanvas(null, {width: size, height: size});
  canvas.add(new fabric.Rect({width: size, height: size, fill: fill}));
  return canvas;
};
