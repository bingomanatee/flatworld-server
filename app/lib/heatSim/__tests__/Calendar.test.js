'use strict';
const heatSim = require('../index')


describe('Home', () => {
  describe('Calendar', () => {

    describe('constructor', () => {
      it('should reflect input values', () => {
        const bottle = heatSim();
        const Calendar = bottle.container.Calendar;
        let cal = new Calendar(20, 100);
        expect(cal.hoursInDay).toBe(20);
        expect(cal.daysInYear).toBe(100);
      })
    })
  });
});