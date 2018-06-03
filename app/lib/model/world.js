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

  bottle.factory('keysToWorldInfo', (container) => {
    const {redis} = container;
    return (keys) => {
      function mapper (item, idx) {
        const [api, world, sub, id, data] = keys[idx].split('/');
        let out = {id, sub};
        Object.assign(out, JSON.parse(item));
        return out;
      }

      return redis.mget(keys)
           .then((items) => _(items)
             .map(mapper)
             .compact()
             .filter('saved')
             .value());
    }
  });

  bottle.factory('getWorlds', (container) => {
    const {getWorldsData} = container;
    return ({sub = "*", id = "*"}) => getWorldsData({sub, id})
  });

  bottle.factory('getWorld', (container) => {
    const {redis} = container;
    return ({id, sub}) => Promise.all([
      container.getWorldsData({id, sub}),
      container.getWorldsElevation({id, sub}),
    ])
  });

  bottle.factory('getWorldsData', (container) => {
    const {redis, REDIS_WORLD_ROOT, keysToWordInfo} = container;

    return ({sub = "*", id = "*"}) => redis.keys(`${REDIS_WORLD_ROOT}/${sub}/${id}/data`)
                                           .then(keysToWordInfo);
  });


  bottle.factory('getWorldsElevation', (container) => {
    const {redis, REDIS_WORLD_ROOT, keysToWordInfo} = container;

    return ({sub = "*", id = "*"}) => redis.keys(`${REDIS_WORLD_ROOT}/${sub}/${id}/elevation`)
                                           .then(keysToWordInfo);
  });

}
// flatworld/worlds/facebook|10156102864753942/6a737b70-669a-11e8-817d-bfdc245dce30/elevation