import _ from 'lodash';

/**
 * a utility class to arrange faces in order around shared edges
 */

export default (bottle) => bottle.factory('FaceEdge', (container) => class FaceEdge extends container.WorldElement {
  constructor(indexA, indexB, world) {
    super(world);
    this.orderedIndexes = FaceEdge.order(indexA, indexB);
    this.id = FaceEdge.faceEdgeKey(this.orderedIndexes);
    this.edgeIsoFaces = new Set();
    this.init();
  }

  otherPoint(point) {
    return _.difference(this.edgePoints, [point])[0]
  }

  hasFace(face) {
    return this.edgeIsoFaces.has(face);
  }

  otherFace(face) {
    return _.difference(Array.from(this.edgeIsoFaces.values()), [face])[0];
  }

  hasPoint(pt) {
    return this.edgePoints.includes(pt);
  }

  init() {
    this.world.edges.set(this.id, this);
    // note edgePoints is an array because it is ORDERED
    this.edgePoints = this.orderedIndexes.map(index => this.points.get(index));

    for (let point of this.edgePoints) {
      point.pointEdges.add(this);
    }
  }

  static order(indexA, indexB) {
    if (Array.isArray(indexA)) {
      return container.numSort(indexA);
    } else {
      return container.numSort([indexA, indexB]);
    }
  }

  static faceEdgeKey(indexA, indexB) {
    return FaceEdge.order(indexA, indexB).join(' to ')
  }

  static findOrMakeEdge(indexA, indexB, world) {
    const id = FaceEdge.faceEdgeKey(indexA, indexB);
    if (world.edges.has(id)) {
      return world.edges.get(id);
    }
    const edge = new FaceEdge(indexA, indexB, world);
    world.edges.set(id, edge);
    return edge;
  }

  toString () {
    const es = this.edgePoints.map((p) => p.toString());
    return `<< edge: [${es.join(' to ')}] >>`
  }
});