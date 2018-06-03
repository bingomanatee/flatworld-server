const THREE = require('three');
const Calendar = require('./Calendar');
module.exports = (bottle) => {

  bottle.factory('simCalendar', () => Calendar)

  bottle.factory('initSim', (container) => {
    return (id) => container.getWorld(id)
                            .then((world) => {

                            });

  })


  return bottle;
}