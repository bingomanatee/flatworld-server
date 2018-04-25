const Bottle = require('bottlejs');
const WorldElement = require('./WorldElement');
const IsoFace = require('./IsoFace');
const FaceEdge = require('./FaceEdge');
const World = require('./World');
const Point = require('./Point');
const FaceNode = require('./FaceNode');
const PathNode = require('./PathNode');
const PointNode = require('./PointNode');
const utils = require('./utils');
const {fabric}  = require('fabric');

module.exports =  () => {
  let bottle = new Bottle();
  bottle.constant('fabric', fabric);

  WorldElement(bottle);
  World(bottle);
  IsoFace(bottle);
  Point(bottle);
  FaceEdge(bottle);
  FaceNode(bottle);
  PointNode(bottle);
  PathNode(bottle);
  utils(bottle);

  return bottle;
}
