const THREE = require('three');
const EventEmitter = require('events').EventEmitter;
const is = require('is');
module.exports = (bottle) => {

  bottle.factory('SolarSystem', (container) => {
    return class SolarSystem extends EventEmitter {
      constructor (config) {
        super();
        this.config = config;
        this.id = this.config.id;
        this.sub = this.config.sub;
        this.calendar = new container.Calendar(config.hoursInDay, config.daysInYear);
      }

      /**
       * planet.iso represents a planet with radius 1
       * at origin 0. In this simulation, the sun orbits around the
       * planet; the tilt group swings back and forth every year about the
       * z axis,
       * and the planet spins around the y axis on a daily basis inside it.
       */
      init () {
        this.planet = new container.Planet(this.config);
        this.planet.init();
        this.scene = new THREE.Scene();
        this.planetGroup = new THREE.Group();
        this.tiltGroup = new THREE.Group();
        this.tiltGroup.rotation.z = this.planet.tiltRad;
        this.tiltGroup.add(this.planet.mesh);
        this.planetGroup.add(this.tiltGroup);
        this.scene.add(this.planetGroup);
        this.sunPoint = new THREE.Vector3(1, 0, 0);
      }

      update () {
        this.angleAroundSun = this.calendar.percentOfYear * Math.PI * 2;
        this.tiltScale = Math.cos(this.angleAroundSun);
        this.tiltGroup.rotation.z = this.planet.tiltRad * this.tiltScale;
        this.dayAngle = this.calendar.hour * Math.PI * 2 / this.planet.hoursInDay;

        this.planet.mesh.rotation.y = this.dayAngle;
        this.sunPoint.x = Math.cos(this.angleAroundSun);
        this.sunPoint.y = Math.sin(this.angleAroundSun);
        this.sunPoint.normalize();
        this.planet.mesh.updateMatrixWorld();
      };

      simulate ({endValue = this.planet.daysInYear, fromValue = 0, unit='hour', advance = 1}) {
        if (!(is.integer(advance) && is.ge(advance, 1))) {
          throw new Error('advanceHour must be an integer >= 1');
        }

        const keepGoing = () => {
          if (unit === 'day') {
            return this.calendar.days <= endValue;
          } else if (unit === 'hour') {
            return this.calendar.hours <= endValue;
          }
        }

        this.calendar.reset();
        this.calendar.day = fromValue;
        while (keepGoing()) {
          this.update();
          this.emit('update', this.calendar.toJSON());
          this.calendar.advance('hour', advance);
        }
      }

    };
  });
};


