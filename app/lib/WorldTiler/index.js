
import Bottle from 'bottlejs';
import WorldElement from './WorldElement';
import IsoFace from './IsoFace';
import FaceEdge from './FaceEdge';
import World from './World';
import Point from './Point';
import FaceNode from './FaceNode';
import PathNode from './PathNode';
import PointNode from './PointNode';
import utils from './utils';
import {fabric}  from 'fabric';

export default () => {
  let bottle = new Bottle();
  bottle.factory('fabric', () => fabric);

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