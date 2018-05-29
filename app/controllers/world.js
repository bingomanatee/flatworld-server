


exports.create = async (ctx) => {
  const {modelBottle, params, request} = ctx;
  ctx.assert(params.sub, 401, 'needs user');
  let world = request.body;
  console.log('saving body, ', world);
  modelBottle.createWorld(world, params.sub)
    .then((worldId) => {
      ctx.body = JSON.stringify({worldId});
    });
}