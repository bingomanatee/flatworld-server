const Redis = require('ioredis');

module.exports = (bottle) => {

  bottle.factory('redis', () => {
      return new Redis();
  });
}