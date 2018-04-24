/**
 * A utility class for an IsoSphere that converts points into hexagons.
 * @param bottle {Bottle}
 */
let kdt = require('kd-tree-javascript');
export default (bottle) => bottle.factory('World', (container) => class World {

  /**
   *
   * @param geometry {IcosahedronGeometry }
   */
  constructor (geometry) {
    this.geometry = geometry;
    this.edges = new Map();
    this.faceUvs = this.geometry.faceVertexUvs[0];
    this.isoFaces = new Map();
    this.points = new Map();
  }

  vertsToPoints () {
    this.geometry.vertices.forEach((vert, index) => new container.Point(vert, index, this));
  }

  facesToIsoFace () {
    this.geometry.faces.forEach((face, index) => new container.IsoFace(face, index, this));
  }

  init () {
    this.vertsToPoints();
    this.facesToIsoFace();
    for (let isoFace of this.isoFaces.values()) {
      isoFace.init();
    }

    for (let point of this.points.values()) {
      point.init();
    }
    this.indexNearPoints();
  }

  nearestPoint (pt, range) {
    let time = new Date().getTime();
    let nearest = this._nearPointIndex.nearest(pt, range);
    return nearest
      .reduce((nearest, pair) => {
        if (!nearest.length) {
          return pair;
        }
        if (pair[1] < nearest[1]) {
          return pair;
        }
        return nearest;
      }, [])[0];
  }

  indexNearPoints () {
    console.log('indexed');
    this._nearPointIndex = new kdt.kdTree(Array.from(this.points.values()), (a, b) => {
      return b.distanceToSquared(a);
    }, ['x', 'y', 'z']);
  }

   paintHex(point, alpha, hexGridShape, size) {
    let nearest = this.nearestPoint(point, 4);
    if (nearest && nearest.paintHex(alpha, hexGridShape, size)) {
      for (let neighbor of nearest.neighborRing) {
        neighbor.paintHex(alpha / 2, hexGridShape, size);
      }
    }
  }
});