import _ from "lodash";

export default (bottle) => bottle.factory('IsoFace', (container) => class IsoFace extends container.WorldElement {

  /**
   * a utility class that wraps a THREE face in utility methods
   * @param face {Face3}
   * @param index {int}
   * @param world {World}
   */
  constructor(face, index, world) {
    super(world);
    this.face = face;
    this.faceIndex = index;
    this.faceVertexIndexes = [this.face.a, this.face.b, this.face.c];
    this.isoFaces.set(index, this);
  }

  midPoint() {
    this.midPoint = this.facePoints.reduce((mid, p) => mid.add(p), new container.Vector3());
    this.midPoint.divideScalar(3);
  }

  init() {
    this.facePoints = this.eachPoint((p) => p);
    this.midPoint();
    this.copyUvs();
    this.linkEdges();
    this.linkPoints();
    this.initUvs();
  }

  initUvs() {
    let u = [];
    let v = [];

    for (let uv of this.myFaceUvs) {
      u.push(uv.x);
      v.push(uv.y);
    }

    this.meanUv = new container.Vector2(_.mean(u), _.mean(v));
  }

  /**
   * point UVs are face-centric;
   * collect all the uv references to a single point
   * into the points uvs set
   */
  copyUvs() {
    this.eachPoint((point, indexOfVertexInFace) => {
      point.uvs.add(this.myFaceUvs[indexOfVertexInFace]);
    });
  }

  get myFaceUvs() {
    return this.faceUvs[this.faceIndex];
  }

  eachPoint(delta) {
    return this.faceVertexIndexes.map((vertexIndex, indexOfVertexInFace) => {
      let viPoint = this.points.get(vertexIndex);
      return delta(viPoint, indexOfVertexInFace, this);
    });
  }

  linkEdges() {
    let edgeVertexIndexes = this.eachPoint((point, indexOfVertexInFace, isoFace) => {
      let nextIndex = (indexOfVertexInFace + 1) % 3;
      return [this.faceVertexIndexes[indexOfVertexInFace], this.faceVertexIndexes[nextIndex]];
    });

    this.faceEdges = new Set(edgeVertexIndexes.map((a) => container.FaceEdge.findOrMakeEdge(a[0], a[1], this.world)));
    for (let edge of this.faceEdges) {
      edge.edgeIsoFaces.add(this);
    }
  }

  linkPoints() {
    this.eachPoint((point) => point.pointIsoFaces.add(this));
  }

  toString() {
    return `<< face ${this.faceIndex}
    points: [${this.eachPoint((p) => "\n" + p.toString())}>>`;
  }
});