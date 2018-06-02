const uuidv1 = require('uuid/v1');
const _ = require('lodash');

module.exports = (bottle) => {

  bottle.constant('REDIS_WORLD_ROOT', 'flatworld/worlds');

  bottle.factory('createWorld', (container) => {
    const {redis} = container;

    return (worldData, sub) => {
      const id = uuidv1();
      const {config, elevation} = worldData;
      config.saved = Date.now();

      return redis.set(`${container.REDIS_WORLD_ROOT}/${sub}/${id}/data`, JSON.stringify(config))
                  .then(() => redis.set(`${container.REDIS_WORLD_ROOT}/${sub}/${id}/elevation`, JSON.stringify(elevation)))
                  .then(() => id);
    }
  });

  bottle.factory('getWorlds', (container) => {
    const {redis} = container;


    return (sub) =>
      redis.keys(`${container.REDIS_WORLD_ROOT}/${sub}/*/data`)
           .then((keys) => redis.mget(keys))
           .then((items) => _(items)
             .compact()
             .map(item => {
               try {
                 return JSON.parse(item);
               } catch (err) {
                 return false;
               }
             })
             .compact()
             .filter('saved')
             .value());

  });
}
// flatworld/worlds/facebook|10156102864753942/6a737b70-669a-11e8-817d-bfdc245dce30/elevation