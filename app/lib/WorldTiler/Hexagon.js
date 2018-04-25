const _ = require('lodash');
const {Vector2} = require('three');

module.exports =  (bottle) => {

  bottle.factory('Zone2dSet', (container) => class ZoneSet {
    constructor (size) {
      this.size = size;
      this.sizeMaps = new Map();
      ZoneSet.mapDefs.forEach((def) => {
        let {name, left, top, right, bottom} = def;
        let zone = new container.Zone2D(left, bottom, right, top, name);
        zone.scale(size);
      })
    }
  });

  bottle.factory('Zone2d', (container) => class Zone {
    constructor (left, bottom, right, top, name) {
      if (!(left < right)) throw new Error(`invalid zone - left ${left} >= right ${right}`);
      if (!(bottom < top)) throw new Error(`invalid zone - bottom ${bottom} >= top ${top}`);

      this.top = top;
      this.bottom = bottom;
      this.left = left;
      this.right = right;
      this.name = name;
    }

    scale(n) {
      Zone.DIMS.forEach((dim) => this[dim] = n * this[dim])
    }

   static get DIMS () { return 'left,top,right,bottom'.split(',') }

    contains(pt) {
      return _.inRange(pt.x, this.left, this.right) && _.contains(pt.y, this.bottom, this.top);
    }
  });

  bottle.factory('Hexagon', (container) => class Hexagon extends container.PointNode {

    constructor(id, uv, registry, size, face) {
      super(id, uv, registry);
      this.face = face;
      this.size = size;
    }

    linkEdge(edge) {
      if (edge.hasFace(this.coordinate)) {
        let otherFace = edge.otherFace(this.face);
        let otherFaceNode = this.registry.get(otherFace.faceIndex);
        if (otherFaceNode) {
          this.link(otherFaceNode);
        }
        return true;
      } else {
        return false;
      }
    }

    static zones = new Map();


    /**
     *
     * @param point {Point}
     * @param size {float}
     */
    static fromPoint(point, size) {
      let nodeMap = new Map();
      Array.from(point.pointIsoFaces.values())
        .map((face) => new Hexagon(face.faceIndex, face.meanUv, nodeMap, size, face));


      for (let edge of point.pointEdges.values()) {
        for (let node of nodes) {
          if (node.linkEdge(edge)) {
            break;
          }
        }
      }

      return nodeMap;
    }

  });
}
