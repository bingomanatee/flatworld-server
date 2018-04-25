/**
 * a base class with shortcuts to the tiler methods
 */


module.exports =  (bottle) => bottle.factory('WorldElement', (container) => class WorldElement {

  /**
   *
   * @param world {IcosahedronGeometry }
   */
  constructor(world) {
    this.world = world;
  }

  /**
   *
   * @returns {IcosahedronGeometry}
   */
  get geometry() {
    return this.world.geometry;
  }

  get points() {
    return this.world.points;
  }

  get isoFaces() {
    return this.world.isoFaces;
  }

  get edges() {
    return this.world.edges;
  }

  get faceUvs() {
    return this.world.faceUvs;
  }
});
