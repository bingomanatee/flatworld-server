const _ = require('lodash');
const {Vector2} = require('three');


/**
 * a wrapper around Vector3 with associated data and links
 *
 * @param bottle {Bottle}
 */
module.exports =  (bottle) => bottle.factory('Point', (container) => class Point extends container.WorldElement {

  /**
   *
   * @param vertex {Vector3}
   * @param vertexIndex {int}
   * @param world {World}
   */
  constructor (vertex, vertexIndex, world) {
    super(world);
    this.vertex = vertex;
    this.vertexIndex = vertexIndex;
    this.world = world;
    this.uvs = new Set();
    this.pointEdges = new Set();
    this.points.set(vertexIndex, this);
    this.pointIsoFaces = new Set();
  }

  uvStrings () {
    return Array.from(this.uvs.values())
                .map((uv) => `(uv ${container.percent(uv.x)}, ${container.percent(uv.y)}`);
  }

  toString (withUVs) {
    let uvs = withUVs ? "\nUVs: " + this.uvStrings()
                                        .join("\n") : '';
    let out = `<< point index ${this.vertexIndex} at (${this.vertex.toArray()
                                                            .map(container.floatToString)
                                                            .join(',')}) -- ${uvs} >>`;
    return out;
  }

  initUV () {
    let u = [];
    let v = [];

    for (let uv of this.uvs) {
      u.push(uv.x % 1);
      v.push(uv.y % 1);
    }

    this.meanUv = new Vector2(_.mean(u), _.mean(v));
  }

  neighborPointNodes () {
    let neighborEdges = _(Array.from(this.pointIsoFaces.values()))
      .map((isoFace) => Array.from(isoFace.faceEdges.values()))
      .flattenDeep()
      .filter((edge) => !edge.orderedIndexes.includes(this.vertexIndex))
      .value();

    const nodeMap = new Map();
    let edgePoints = _(neighborEdges)
      .map('edgePoints')
      .flattenDeep()
      .uniq()
      .value();
    const nodes = _(edgePoints)
      .map((point) => new container.PointNode(point, nodeMap))
      .value();

    if (nodeMap.size !== edgePoints.length) {
      eval('debugger');
    }
    for (let edge of neighborEdges) {
      for (let node of nodes) {
        node.linkEdge(edge);
      }
    }
    return nodeMap;
  }

  get neighborRing () {
    if (!this._neighborRing) {
      let nnMap = this.neighborPointNodes();
      this._neighborRing = Array.from(nnMap.values())[0].ring()
                                                        .map((node) => node.coordinate);
    }
    return this._neighborRing;
  }

  getHexPoints() {
    let ring = this.neighborRing;
    return ring.map((point) => point.vertex.clone()
      .lerp(this.vertex, 0.5));
  }

  neighborFaceNodes () {
    let nodeMap = new Map();
    let nodes = Array.from(this.pointIsoFaces.values())
                     .map((face) => new container.FaceNode(this, face, nodeMap));

    for (let edge of this.pointEdges.values()) {
      for (let node of nodes) {
        node.linkEdge(edge);
      }
    }
    return nodeMap;
  }

  get faceRing () {
    if (!this._faceRing) {
      let faceNodeMap = this.neighborFaceNodes();
      this._faceRing = Array.from(faceNodeMap.values())[0].ring();
    }
    return this._faceRing;
  }

  init () {
    this.initUV();
  }

  drawHexFrame (hexGridShape, size) {
    for (let faceNode of this.faceRing) {
      faceNode.drawHexFramePart(hexGridShape, size);
    }
  }

  getHexEdges (edges, size) {
    for (let faceNode of this.faceRing) {
      faceNode.getHexEdges(edges, size);
    }
  }

  distanceToSquared (p) {
    return this.vertex.distanceToSquared(p);
  }

  get x () {
    return this.vertex.x;
  }

  get y () {
    return this.vertex.y;
  }

  get z () {
    return this.vertex.z;
  }

  initCanvasHex (alpha, stage, size) {
    let points = [];
    for (let faceNode of this.faceRing) {
      faceNode.addHexWedge(points, this, size);
    }
    this._canvasHex = new bottle.container.fabric.Path(points.join(''));
    this._canvasHex.set({fill: container.globeGradient.rgbAt(alpha).toString(), opacity: alpha, visible: alpha > 0, stroke: false});
    stage.add(this._canvasHex);
  }

  getHexWedges(size=100) {
    let wedgePoints = [];
    for (let faceNode of this.faceRing) {
      faceNode.addHexWedge(wedgePoints, this, size);
    }
    return _.compact(wedgePoints);
  }

  /**
   * paints or increases the hexagon with increased Alpha
   *
   * @param alpha
   * @param stage
   * @param size
   * @returns {boolean}
   */
  paintHex (alpha, stage, size ) {
    if (!this._canvasHex) {
      this.initCanvasHex(alpha, stage, size);
      return true;
    } else {
      let opacity = this._canvasHex.get('opacity');
      if (opacity > 0.5) alpha /= 2;
      let originalOpacity = opacity;
      opacity += alpha;
      opacity = _.clamp(opacity, 0, 1);
      if (opacity === originalOpacity) return false;
      let color = container.globeGradient.rgbAt(opacity).toString();
      this._canvasHex.set('fill', color);
      this._canvasHex.set('opacity', opacity);
      this._canvasHex.visible = opacity > 0;
      return true;
    }
  }
});

