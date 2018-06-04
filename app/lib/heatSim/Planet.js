const THREE = require('three');
const is = require('is');

const assertNumber = (value, name = 'value') => {
  if (!is.number(value)) {
    throw new Error(`${value} is not a valid ${name} value`)
  }
  return true;
};

const assertNonNegNumber = (value, name = 'value', max = null) => {
  if (!is.number(value)) {
    throw new Error(`${value} is not a valid ${name} value`)
  }
  if (!is.ge(value, 0)){
    throw new Error(`${value} must be a positive number >= 1`);
  }
  if (!(max === null) && !(is.ge(max, null))){
    throw new Error(`${value} > max accepted ${max} for ${name}`);
  }
  return true;
};
const assertWhole = (value, name = 'value', max = null) => {
  if (!is.integer(value)) {
    throw new Error(`${value} is not a valid ${name} value`)
  }
  if (!is.ge(value, 0)){
    throw new Error(`${value} must be a positive number >= 1`);
  }
  if (!(max === null) && !(is.ge(max, null))){
    throw new Error(`${value} > max accepted ${max} for ${name}`);
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

module.exports = class Planet {

  constructor (config = {}) {
    this.resolution = config.resolution || 0;
    this.tilt = config.tilt || 0;
    if (config.hasOwnProperty('tiltRad')){
      this.tiltRad = config.tiltRad;
    }
    this.climate = config.climate || 0;
    this.config = config;
    this.id = config.id || '';
    this.sub = config.sub || '';
  }

  init() {
    this.iso = new THREE.IcosahedronGeometry(1, this.resolution);
    this.mesh = new THREE.Mesh(this.iso);
  }

  /* ======================== properties ===================== */


  get id () {
    return this._id;
  }

  set id (value) {
    this._id = `${value}`;
  }

  get sub () {
    return this._sub;
  }

  set sub (value) {
    this._sub = `${value}`;
  }

  get config () {
    return this._config;
  }

  set config (value) {
    this._config = value;
  }

  get resolution () {
    return this._resolution;
  }

  set resolution (value) {
    assertWhole(value, 'resolution', 10);
    this._resolution = value;
  }

  get tilt () {
    return this._tilt;
  }

  set tilt (value) {
    assertNonNegNumber(value, 'tilt', Math.PI/2);
    this._tilt = value;
  }

  // a derived property of tilt
  set tiltRad(value) {
    assertNonNegNumber(value, 'tiltDeg', 90);
    this.tilt = 360 * value / (Math.PI * 2);
  }

  get tiltRad() {
    return this.tilt * (Math.PI * 2) / 360;
  }

  get climate () {
    return this._climate;
  }

  set climate (value) {
    assertNumber(value, 'climate');
    this._climate = value;
  }
};