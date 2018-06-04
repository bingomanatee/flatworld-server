const Calendar = require('./Calendar');
const Planet = require('./Planet');
const SolarSystem = require('./SolarSystem');

module.exports = (bottle) => {

  bottle.constant('Calendar', Calendar);
  bottle.constant('Planet', Planet);

  SolarSystem(bottle);

  bottle.factory('initSim', (container) => {
    return (id) => container.getWorld(id)
                            .then((config) =>
                              new SolarSystem(config));
  });

  return bottle;
};