'use strict';
const heatSim = require('../index');
const tap = require('tap');
const {almostEqual} = require('./utils');

function CalendarFactory () {
  const bottle = heatSim();
  return bottle.container.Calendar;
}

tap.test('Calendar', (suite) => {

  suite.test('constructor', (cTest) => {
    const Calendar = CalendarFactory();
    let cal = new Calendar(20, 100);
    cTest.equal(cal.hoursInDay, 20, '20 hours in day');
    cTest.equal(cal.daysInYear, 100, '100 days in week');

    cTest.test('bad', (bTest) => {

      const Calendar = CalendarFactory();
      bTest.throws(() => {
        let cal = new Calendar();
      }, {message: 'null is not a valid hoursInDay value'});
      bTest.throws(() => {
        let cal = new Calendar(10);
      }, {message: 'null is not a valid daysInYear value'});

      bTest.end();
    });

    cTest.end();
  });

  suite.test('properties', (pTest) => {

    const Calendar = CalendarFactory();
    let cal = new Calendar(20, 100);

    pTest.equal(cal.hour, 0);
    pTest.equal(cal.day, 0);
    pTest.equal(cal.year, 0);

    pTest.test('simple/in range', (sTest) => {

      const Calendar = CalendarFactory();
      let cal = new Calendar(20, 100);

      cal.hour = 10;
      sTest.equal(cal.hour, 10);
      cal.day = 20;
      sTest.equal(cal.day, 20);
      sTest.equal(cal.hour, 10);
      cal.year = 30;
      sTest.equal(cal.year, 30);
      sTest.equal(cal.day, 20);
      sTest.equal(cal.hour, 10);

      sTest.end();
    });

    pTest.test('rollover time', (rTest) => {

      const Calendar = CalendarFactory();
      let cal = new Calendar(20, 100);

      cal.hour = 20;
      rTest.equal(cal.hour, 0);
      rTest.equal(cal.day, 1);
      rTest.equal(cal.year, 0);

      cal = new Calendar(20, 100);
      cal.day = 100;
      rTest.equal(cal.hour, 0);
      rTest.equal(cal.day, 0);
      rTest.equal(cal.year, 1);

      rTest.end();
    });

    pTest.test('advance', (rTest) => {

      const Calendar = CalendarFactory();
      let cal = new Calendar(20, 100);

      cal.advance('hour');
      rTest.equal(cal.hour, 1);
      rTest.equal(cal.day, 0);
      rTest.equal(cal.year, 0);

      cal.advance('hour', 19);
      rTest.equal(cal.hour, 0);
      rTest.equal(cal.day, 1);
      rTest.equal(cal.year, 0);

      cal.advance('day');
      rTest.equal(cal.hour, 0);
      rTest.equal(cal.day, 2);
      rTest.equal(cal.year, 0);

      cal.advance('day', 10);
      rTest.equal(cal.hour, 0);
      rTest.equal(cal.day, 12);
      rTest.equal(cal.year, 0);

      cal.advance('year', 10);
      rTest.equal(cal.hour, 0);
      rTest.equal(cal.day, 12);
      rTest.equal(cal.year, 10);

      rTest.end();
    });

    pTest.end();
  });

  suite.test('percentOfYear', (poyTest) => {
    const Calendar = CalendarFactory();
    let cal = new Calendar(20, 100);

    poyTest.equal(cal.percentOfYear, 0, 'poy starts at zero');
    cal.hour = 1;
    poyTest.ok(almostEqual(cal.percentOfYear, 1/(20 * 100)), 'hours affect poy');
    cal.reset();
    cal.day = 50;
    poyTest.equal(cal.percentOfYear, 0.5, 'poy half year');
    cal.reset();
    cal.day = 99;
    cal.hour = 19;
    poyTest.ok(almostEqual(cal.percentOfYear, 1), 'end of year');
    poyTest.end();
  });

  suite.end();
});
