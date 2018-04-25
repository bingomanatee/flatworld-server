const {Vector2, Vector3, IcosahedronGeometry} = require('three');

const tinyGradient = require('tinygradient');
const tinyColor = require('tinycolor2');

/**
 * converts a XYZ vector3 to longitude latitude (Direct Polar)
 * @param lng longitude
 * @param lat latitude
 * @param vector3 optional output vector3
 * @returns a unit vector of the 3d position
 */
function lonLatToVector3 (lng, lat, Vector3) {
  out = new THREE.Vector3();

  //flips the Y axis
  lat = Math.PI / 2 - lat;

  //distribute to sphere
  out.set(
    Math.sin(lat) * Math.sin(lng),
    Math.cos(lat),
    Math.sin(lat) * Math.cos(lng)
  );

  return out;

}

/**
 * converts a XYZ THREE.Vector3 to longitude latitude. beware, the point will be normalized!
 * @param point {Vector3}
 * @param Vector2 {class} the CLASS DEFINITIION of the Vector2 class
 * @returns {Vector2}
 */
function vector3toLonLat (point, Vector2) {

  point = point.clone()
               .normalize();

  //longitude = angle of the vector around the Y axis
  //-( ) : negate to flip the longitude (3d space specific )
  //- PI / 2 to face the Z axis
  var lng = -(Math.atan2(-point.z, -point.x)) - Math.PI / 2;

  //to bind between -PI / PI
  if (lng < -Math.PI) {
    lng += Math.PI * 2;
  }

  //latitude : angle between the vector & the vector projected on the XZ plane on a unit sphere

  //project on the XZ plane
  var p = new THREE.Vector3(point.x, 0, point.z);
  //project on the unit sphere
  p.normalize();

  //commpute the angle ( both vectors are normalized, no division by the sum of lengths )
  var lat = Math.acos(p.dot(point));

  //invert if Y is negative to ensure teh latitude is comprised between -PI/2 & PI / 2
  if (point.y < 0) {
    lat *= -1;
  }

  return new Vector2(lng, lat);

}

/**
 * determines if a polyline contains a point
 * @param polygon a series of X,Y coordinates pairs
 * @param x point.x
 * @param y point.y
 * @returns true if the path contains the point, false otherwise
 */
function polygonContains (polygon, x, y) {
  var j = 0;
  var oddNodes = false;
  for (var i = 0; i < polygon.length; i += 2) {

    j = (j + 2) % polygon.length;

    var ix = polygon[i];
    var iy = polygon[i + 1];
    var jx = polygon[j];
    var jy = polygon[j + 1];

    if ((iy < y && jy >= y) || (jy < y && iy >= y)) {
      if (ix + (y - iy) / (jx - ix) * (jx - ix) < x) {
        oddNodes = !oddNodes
      }
    }
  }
  return oddNodes;
}

/**
 * locateCamera: orients a camera to look at another object & preserve the camera's UP axis
 * @param target object to lookAt
 * @param camera object (camera) to position
 * @param camera_angle extra angle on the latitude
 * @param camera_distance distance between the target and the camera
 */
function locateCamera (target, camera, camera_angle, camera_distance) {

  var UP = new THREE.Vector3(0, 1, 0);
  var NORMAL = target.clone()
                     .normalize();

  var angle = Math.acos(UP.dot(NORMAL));
  angle += camera_angle || 0;

  if (angle > Math.PI) {
    UP.y *= -1;
  }
  if (angle < 0) {
    angle += Math.PI;
  }

  var AX = UP.crossVectors(UP, NORMAL);

  var tmp = new THREE.Vector3(0, 1, 0);
  tmp.applyAxisAngle(AX, angle);
  tmp.multiplyScalar(camera_distance)
     .add(target);

  camera.position.copy(tmp);
  camera.lookAt(target);

}

module.exports =  (bottle) => {
  bottle.constant('Vector2', Vector2);
  bottle.constant('Vector3', Vector3);
  bottle.constant('IcosahedronGeometry', IcosahedronGeometry);

  bottle.constant('floatToString', (n) => Number.parseFloat(n)
                                                .toFixed(3));
  bottle.constant('numSort', (array) => array.sort((a, b) => a - b));
  bottle.constant('percent', (n) => `${Number.parseFloat(n * 100)
                                             .toFixed(1)}%`);
  bottle.constant('setsEqual', function setsEqual (s1, s2) {
    if (s1.size !== s2.size) {
      return false;
    }
    for (let e of s1) if (!s2.has(e)) {
      return false;
    }
    for (let e of s2) if (!s1.has(e)) {
      return false;
    }
    return true;
  });

  bottle.constant('pointToUvVertex',  (point, size) => point.meanUv.clone()
                                                                .multiplyScalar(size));

  bottle.constant('uvToCanvas',  (uv, size) => {
    uv = uv.clone()
           .multiplyScalar(size);
    uv.y = size - uv.y;
    return uv;
  });

  bottle.constant('globeGradient', tinyGradient([

      {color: tinyColor({r: 204, g: 125, b: 0, a: 0}), pos: 0},
      {color: tinyColor({r: 204, g: 187, b: 0, a: 1}), pos: 0.1},
      {color: tinyColor({r: 75, g: 150, b: 0}), pos: 0.25},
      {color: tinyColor({r: 52, g: 166, b: 0}), pos: 0.66},
      {color: tinyColor({r: 245, g: 173, b: 108}), pos: 0.9},
      {
        color: tinyColor({r: 255, g: 235, b: 204})
          .toString(), pos: 1
      }]));

  bottle.constant('time',  (fn, msg) => {
    let time = new Date().getTime();
    fn();
    console.log(msg, (new Date().getTime() - time) / 1000);
  });

  bottle.factory('pointToLatLon',  (container) => (pt) => vector3toLonLat(pt, container.Vector2))
}
