const _ = require('lodash');

module.exports =  (bottle) => bottle.factory('PointNode', (container) => class PointNode extends container.PathNode {
  constructor (point, nodeMap) {
    super(point.vertexIndex, point, nodeMap);
  }

  linkEdge (edge) {
    if (edge.hasPoint(this.coordinate)) {
      let otherPoint = edge.otherPoint(this.coordinate);
      let otherNode = this.registry.get(otherPoint.vertexIndex);
      this.link(otherNode);
      return true;
    }
  }

  toString () {
    let point = this.point;
    return `<< node of point ${point.toString()}} 
      links: ${Array.from(this.edges.values())
                    .map(node => node.id)
                    .join(",")}
    >>`
  }

});
