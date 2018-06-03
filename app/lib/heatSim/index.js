const Bottle = require('bottlejs');
const model = require('../model');
const sim = require('./sim');

module.exports =  (bottle) => {
  if (!bottle) bottle = new Bottle();

  model(bottle);
  sim(bottle);

  return bottle;
}
