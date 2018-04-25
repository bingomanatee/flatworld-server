const _ = require('lodash');

module.exports =  (bottle) => bottle.factory('FaceNode', (container) => class PointNode extends container.PathNode {
  constructor(point, face, nodeMap) {
    super(face.faceIndex, face.meanUv, nodeMap);
    this.point = point;
    this.face = face;
  }

  linkEdge(edge) {
    if (edge.hasFace(this.face)) {
      let otherFace = edge.otherFace(this.face);
      let otherFaceNode = this.registry.get(otherFace.faceIndex);
      if (!otherFaceNode) {
      } else {
        this.link(otherFaceNode);
      }
      return true;
    } else {
      return false;
    }
  }

  /**
   * Because the faces can be split on the seam, drawing a point
   * from one faces' midpoint to the other is problematic. Instead we
   * are drawing edges from the faces' midpoints to the faces edge midpoint.
   *
   * @param hexGridShape {Shape}
   * @param size {int}
   */
  drawHexFramePart(hexGridShape, size) {
    let meanPointUv = this.face.meanUv.clone().multiplyScalar(size);
    for (let edge of this.face.faceEdges) {
      if (edge.hasPoint(this.point)) {
        let faceVertexIndexes = edge.orderedIndexes.map((vi) => this.face.faceVertexIndexes.indexOf(vi));
        let midpointUvs = faceVertexIndexes.map((index) => this.face.myFaceUvs[index]);
        let midPointUv = midpointUvs[0].clone().lerp(midpointUvs[1], 0.5).multiplyScalar(size);
        let points = [meanPointUv.clone(), midPointUv.clone()];
        const path = new container.fabric.Polyline (points, {stroke: 'rgba(255,255,255,0.25)', objectCaching: false});
        hexGridShape.add(path);
      }
    }
  }

  getHexEdges(edges, size) {
    let meanPointUv = this.face.meanUv.clone().multiplyScalar(size);
    for (let edge of this.face.faceEdges) {
      if (edge.hasPoint(this.point)) {
        let faceVertexIndexes = edge.orderedIndexes.map((vi) => this.face.faceVertexIndexes.indexOf(vi));
        let midpointUvs = faceVertexIndexes.map((index) => this.face.myFaceUvs[index]);
        let midPointUv = midpointUvs[0].clone().lerp(midpointUvs[1], 0.5).multiplyScalar(size);
        let points = [meanPointUv, midPointUv];
        edges.push(points.map((p) => p.toArray()))
      }
    }
  }

  addHexWedge(points, point, size) {
    let meanPointUv = container.uvToCanvas(this.face.meanUv, size);
    let pointIndex = this.face.faceVertexIndexes.indexOf(point.vertexIndex);
    let cornerUv = container.uvToCanvas(this.face.myFaceUvs[pointIndex], size);

    for (let edge of this.face.faceEdges) {
      if (edge.hasPoint(this.point)) {
        let faceVertexIndexes = edge.orderedIndexes.map((vi) => this.face.faceVertexIndexes.indexOf(vi));
        let midpointUvs = faceVertexIndexes.map((index) => this.face.myFaceUvs[index]);
        let midPointUv = container.uvToCanvas(midpointUvs[0].clone().lerp(midpointUvs[1], 0.5), size);
        points.push('M', cornerUv.x, ',', cornerUv.y);
        points.push('L', meanPointUv.x, ',', meanPointUv.y);
        points.push('L', midPointUv.x, ',', midPointUv.y);
        points.push('L', cornerUv.x, ',', cornerUv.y);
      }
    }
  }


  getHexWedge(points, point, size) {
    let meanPointUv = container.uvToCanvas(this.face.meanUv, size);
    let pointIndex = this.face.faceVertexIndexes.indexOf(point.vertexIndex);
    let cornerUv = container.uvToCanvas(this.face.myFaceUvs[pointIndex], size);
    const mpa = meanPointUv.toArray();

    for (let edge of this.face.faceEdges) {
      if (edge.hasPoint(this.point)) {
        let faceVertexIndexes = edge.orderedIndexes.map((vi) => this.face.faceVertexIndexes.indexOf(vi));
        let midpointUvs = faceVertexIndexes.map((index) => this.face.myFaceUvs[index]);
        let midPointUv = container.uvToCanvas(midpointUvs[0].clone().lerp(midpointUvs[1], 0.5), size);
        points.push(cornerUv.toArray(), mpa, midPointUv.toArray());
      }
    }
  }

  toString() {
    let point = this.point;
    return `<< node of point ${point.toString()} -- face ${this.id} 
      links: ${_(Array.from(this.edges.values()))
      .compact()
      .map('id')
      .join(",")}
    >>`
  }
});
