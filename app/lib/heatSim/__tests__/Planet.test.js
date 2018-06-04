'use strict';
const heatSim = require('../index');
const tap = require('tap');

function PlanetFactory () {
  const bottle = heatSim();
  return bottle.container.Planet;
}
tap.test('Planet', (suite) => {
  suite.test('constructor', (cTest) => {
    const Planet = PlanetFactory();

    const p = new Planet({resolution:2, tilt: 15, climate: 20});

    cTest.equal(p.resolution, 2, 'resolution is 2');
    cTest.equal(p.tilt, 15, 'tilt is 15');
    cTest.equal(p.climate, 20, 'climate is 20');

    cTest.end();
  });

  suite.end();
});