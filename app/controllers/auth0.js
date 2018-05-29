
// this is a debugging tool - not intended for relese as it exposes secure connection data.

exports.token = async (ctx) => {
  let token = await ctx.modelBottle.container.getAuth0token();

  console.log('auth0 token retrieved, ', token);
  ctx.body = JSON.stringify(token);
}