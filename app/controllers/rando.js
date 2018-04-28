'use strict';
const Wordnik = require('wordnik');
const SimplexNoise = require('simplex-noise');
const fs = require('fs');
const path = require('path');

var wn = new Wordnik({
  api_key: '08b960b3935f529f040630ddeb61f6524b5ee8e415991b603'
});


exports.rando = async (ctx) => {
  let data = await new Promise((respond, fail) => {
    wn.randomWord((err, data) => {
      if (err) {
        return fail(err);
      }
      respond(data);
    });
  });
  ctx.body = JSON.stringify(data);
}

exports.noise = async (ctx) => {
  ctx.assert(ctx.params.resolution);
  ctx.assert(ctx.params.word);
  ctx.assert(ctx.params.zoom);
  const zoom = parseFloat(ctx.params.zoom);
  ctx.assert(!isNaN(zoom) && zoom);

  let data;
  try {
    data = await(new Promise((respond, fail) => {
      const DATA_PATH = path.resolve(__dirname, '../lib/worldSnapshots/world_coords/recurse' + ctx.params.resolution + '.json');
      fs.access(DATA_PATH, (err) => {
        if (err) {
          return fail(err);
        }

        fs.readFile(DATA_PATH, (err, data) => {
          if (err) {
            return fail(err);
          }
          respond(JSON.parse(data.toString()));
        });
      });
    }));
  } catch (err) {
    console.log('noise error: ', err);
    ctx.throw(500, (err && err.message) ? err.message : 'cannot get data');
  }

  let sn = new SimplexNoise(ctx.params.word);
  let out = {}
  for (let index in data.hexes) {
    let hex = data.hexes[index];
    let [x, y, z] = hex.center.map(n => n * zoom);
    let value = Math.max(0, sn.noise3D(x, y, z));
    out[index] = new Number(value.toFixed(6));
  }

  ctx.body = out;
};
