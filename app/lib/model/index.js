const Bottle = require('bottlejs');
const redis = require('./redis');
const account = require('./account');
const world = require('./world');

module.exports =  () => {
  let bottle = new Bottle();
  redis(bottle);
  account(bottle);
  world(bottle);

  return bottle;
}
