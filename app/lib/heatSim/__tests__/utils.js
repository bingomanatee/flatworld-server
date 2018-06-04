const is = require('is');

exports.almostEqual = function  (a, b, n = 0.01) {
  return is.number(a) && is.number(b) && (Math.abs(a - b) < n);
};
