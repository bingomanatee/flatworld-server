/**
 * A utility class for an IsoSphere that converts points into hexagons.
 * @param bottle {Bottle}
 */
const kdt = require('kd-tree-javascript');
const _ = require('lodash');
const iterator = require('object-recursive-iterator');

module.exports = (bottle) => bottle.factory('World', (container) => class World {

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
    this._nearPointIndex = new kdt.kdTree(Array.from(this.points.values()), (a, b) => {
      return b.distanceToSquared(a);
    }, ['x', 'y', 'z']);
  }

  paintHex (point, alpha, hexGridShape, size) {
    let nearest = this.nearestPoint(point, 4);
    if (nearest && nearest.paintHex(alpha, hexGridShape, size)) {
      for (let neighbor of nearest.neighborRing) {
        neighbor.paintHex(alpha / 2, hexGridShape, size);
      }
    }
  }

  data (size = 100, fixedPlaces = 3) {
    let hexes = Array.from(this.points.values())
                     .reduce((data, pt) => {
                       data[pt.vertexIndex] = {
                         id: pt.vertexIndex,
                         center: pt.vertex.toArray(),
                         corners: pt.getHexPoints()
                                    .map((p) => p.toArray()),
                         uvs: pt.getHexWedgeUV(size),
                         neighbors: pt.neighborRing.map((point) => point.vertexIndex)
                       };
                       return data;
                     }, {});

    let edges = [];

    for (let p of this.points.values()) {
      p.getHexEdges(edges, size);
    }

    let delta = size / 10000;

    edges = _.uniqBy(edges, (edge) => {
      return _(edge)
        .sortBy()
        .map((coords) => coords.map((coord) => parseFloat(coord)
          .toFixed(3)))
        .flattenDeep()
        .join(',');
    });

    let data = {hexes, edges};

    iterator.forAll(data, (path, key, obj) => {
      let value = obj[key];

      if (_.isNumber(value) && (value !== Math.floor(value))) {
        if (Math.abs(value) > 1) {
          obj[key] = Number.parseFloat(value.toFixed(fixedPlaces));
        } else {
          obj[key] = Number.parseFloat(value.toFixed(fixedPlaces * 2));
        }
      }
    });
    return data;
  }

  static fromIso (radius = 1, recurse = 0) {
    const geo = new container.IcosahedronGeometry(radius, recurse);
    return new World(geo);
  }
});
