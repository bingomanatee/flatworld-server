'use strict';
const heatSim = require('../index');
const tap = require('tap');
const {almostEqual} = require('./utils');
const util = require('util');

function SSFactory () {
  const bottle = heatSim();
  return bottle.container.SolarSystem;
}

tap.test('SolarSystem', (suite) => {

  suite.test('sim cycle', (cTest) => {
    const SolarSystem = SSFactory();

    const world = {
      id: 'fafdasdfsaas',
      sub: 'facebook|23fafasfew',
      daysInYear: 100,
      hoursInDay: 20,
      tilt: 15,
      climate: 20
    };

    const ss = new SolarSystem(world);
    ss.init();
    let data = [];

    ss.on('update', (event) => data.push(event));

    ss.simulate({endValue: 40, unit: 'hour', advance: 2});

    cTest.same(data, [
      {hour: 0, day: 0, year: 0},
      {hour: 2, day: 0, year: 0},
      {hour: 4, day: 0, year: 0},
      {hour: 6, day: 0, year: 0},
      {hour: 8, day: 0, year: 0},
      {hour: 10, day: 0, year: 0},
      {hour: 12, day: 0, year: 0},
      {hour: 14, day: 0, year: 0},
      {hour: 16, day: 0, year: 0},
      {hour: 18, day: 0, year: 0},
      {hour: 0, day: 1, year: 0},
      {hour: 2, day: 1, year: 0},
      {hour: 4, day: 1, year: 0},
      {hour: 6, day: 1, year: 0},
      {hour: 8, day: 1, year: 0},
      {hour: 10, day: 1, year: 0},
      {hour: 12, day: 1, year: 0},
      {hour: 14, day: 1, year: 0},
      {hour: 16, day: 1, year: 0},
      {hour: 18, day: 1, year: 0},
      {hour: 0, day: 2, year: 0}
    ]);

    cTest.end();
  });

  suite.end();
});