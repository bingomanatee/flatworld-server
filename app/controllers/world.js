exports.create = async (ctx) => {
  const {modelBottle, params, request} = ctx;
  ctx.assert(params.sub, 401, 'needs user');
  let world = request.body;
  console.log('saving body, ', world);
  let worldId = await modelBottle.container.createWorld(world, params.sub)
  ctx.body = JSON.stringify({worldId});
  console.log('returning body: ', ctx.body);
}

exports.list = async(ctx) => {
  const {modelBottle, params} = ctx;
  ctx.assert(params.sub, 401, 'needs user');
  let list = await modelBottle.container.getWorlds(params.sub);
  console.log('list: ', require('util').inspect(list));
  ctx.body = list;
}