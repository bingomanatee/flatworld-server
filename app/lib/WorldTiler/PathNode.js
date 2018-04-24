import _ from "lodash";
import {Vector2} from "three";

export default (bottle) => {
  bottle.factory('PathNode', (container) =>
    class PathNode {
      constructor(identity, coordinate, registry = null) {
        this.coordinate = coordinate;
        this.id = identity;
        this.edges = new Set();
        this.registry = registry;
        if (this.registry) {
          this.registry.set(this.id, this);
        }
      }

      link(node, second) {
        if (!node) throw new Error('cannot link empty node');
        this.edges.add(node);
        if (!second) {
          node.link(this, true);
        }
      }

      /**
       * creates a circular node list. assumes that there are
       * two edges for every node.
       * @returns {[null,null,null]}
       */
      ring() {
        let edges = Array.from(this.edges.values());
        let lastNode = edges[1];
        let ring = [edges[0], this, lastNode];
        let failsafe = 0;

        do {
          let nfnEdges = Array.from(lastNode.edges);
          let nextFaceNode = _.difference(nfnEdges, ring)[0];
          lastNode = nextFaceNode;

          if (nextFaceNode) {
            ring.push(nextFaceNode);
          }

          if (++failsafe > 10) {
            break;
          }
        } while (lastNode);
        return ring;
      }
    });

}
