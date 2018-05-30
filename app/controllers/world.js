


exports.create = async (ctx) => {
  const {modelBottle, params, request} = ctx;
  ctx.assert(params.sub, 401, 'needs user');
  let world = request.body;
  console.log('saving body, ', world);
  let worldId = await modelBottle.container.createWorld(world, params.sub)
  ctx.body = JSON.stringify({worldId});
  console.log('returning body: ', ctx.body);
}