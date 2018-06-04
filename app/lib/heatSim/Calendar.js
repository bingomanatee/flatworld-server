const _ = require('lodash');
const is = require('is');

const assertWhole = (value, unit) => {
  if (!is.integer(value)) {
    throw new Error(`${value} is not a valid ${unit} value`)
  }
  if (!is.ge(value, 0)){
    throw new Error(`${value} must be a positive number >= 1`);
  }
  return true;
};
const assertPosInt = (value, unit) => {
  if (!is.integer(value)) {
    throw new Error(`${value} is not a valid ${unit} value`)
  }
  if (!is.ge(value, 1)){
    throw new Error(`${value} must be a positive number >= 1`);
  }
  return true;
};

module.exports = class Calendar {
  constructor (hoursInDay = null, daysInYear = null) {
    this._hour = 0;
    this._day = 0;
    this._year = 0;
    this.hoursInDay = hoursInDay;
    this.daysInYear = daysInYear;
  }

  get percentOfYear () {
    let day = this._day;
    day += this._hour / this._hoursInDay;
    return _.clamp(day / this._daysInYear, 0, 1);
  }

  advance (unit, value=1) {
    assertPosInt(value, unit);
    switch (unit) {
      case 'hour':
        this.hour += value;
        break;

      case 'day':
        this.day += value;
        break;

      case 'year':
        this.year += value;
        break;
      default:
        throw new Error('attempt to advance unknown unit :' + unit);
    }
  }

  get hoursInDay () {
    return this._hoursInDay;
  }

  set hoursInDay (value) {
    assertPosInt(value, 'hoursInDay');
    this._hoursInDay = value;
  }

  get daysInYear () {
    return this._daysInYear;
  }

  set daysInYear (value) {
    assertPosInt(value, 'daysInYear');
    this._daysInYear = value;
  }

  get hour () {
    return this._hour;
  }

  set hour (value) {
    assertWhole(value, 'hour');
    this._hour = value;
    this.rollover('hour');
  }

  get day () {
    return this._day;
  }

  set day (value) {
    assertWhole(value, 'day');
    this._day = value;
    this.rollover('day');
  }

  get year () {
    return this._year;
  }

  set year (value) {
    assertWhole(value, 'year');
    this._year = value;
  }

  rollover (unit) {
    let value = 0;
    let max = 1;
    switch (unit) {
      case 'hour':
        value = this.hour;
        max = this.hoursInDay;
        break;

      case 'day':
        value = this.day;
        max = this.daysInYear;
        break;

      default:
        throw new Error('cannot rollover ' + unit);
    }

    if (value < max) {
      return;
    }

    let newValue = value % max;
    let nextValue = Math.floor(value / max);

    switch (unit) {
      case 'hour':
        this.day += nextValue;
        this.hour = newValue;
        break;

      case 'day':
        this.year += nextValue;
        this.day = newValue;
        break;
    }
  }
  reset () {
    this.hour = 0;
    this.day = 0;
    this.year = 0;
  }

  get days () {
    return this.day + this.year * this.daysInYear + (this.hour / this.hoursInDay);
  }

  get hours() {
    return this.day * this.hoursInDay + this.hour + (this.year * (this.hoursInDay * this.daysInYear));
  }

  toArray () {
    return [this.hour, this.day, this.year];
  }

  toJSON (asArray = false) {
    return asArray ? toArray() : {
      hour: this.hour,
      day: this.day,
      year: this.year,
    }
  }
}
