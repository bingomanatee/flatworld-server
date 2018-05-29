const uuidv1 = require('uuid/v1');

module.exports = (bottle) => {

  bottle.constant('REDIS_WORLD_ROOT', 'flatworld/worlds');

  bottle.factory('createWorld', (container) => {
    const {redis} = container;

    return (worldData, sub) => {
      const id = uuidv1();
      const {config, data} = worldData;

      redis.set(`${container.REDIS_WORLD_ROOT}/${sub}/${id}/data`, JSON.stringify(data))
           .then(() => redis.set(`${container.REDIS_WORLD_ROOT}/${sub}/${id}/config`, JSON.stringify(config)))
           .then(() => id);
    }
  });
}