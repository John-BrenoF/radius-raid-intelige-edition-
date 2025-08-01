/*==============================================================================
Miscellaneous
==============================================================================*/
$.util = {};
$.pi = Math.PI;
$.tau = $.pi * 2;

/*==============================================================================
Random Range
==============================================================================*/
$.util.rand = function (min, max) {
  return Math.random() * (max - min) + min;
};

/*==============================================================================
Calculations
==============================================================================*/
$.util.distance = function (p1x, p1y, p2x, p2y) {
  let xDistance = p1x - p2x;
  let yDistance = p1y - p2y;
  return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
};

$.util.rectInRect = function (r1x, r1y, r1w, r1h, r2x, r2y, r2w, r2h) {
  return !(
    r2x > r1x + r1w ||
    r2x + r2w < r1x ||
    r2y > r1y + r1h ||
    r2y + r2h < r1y
  );
};

$.util.arcInRect = function (ax, ay, ar, rx, ry, rw, rh) {
  return !(
    ax + ar <= rx ||
    ax - ar >= rx + rw ||
    ay + ar <= ry ||
    ay - ar >= ry + rh
  );
};

$.util.arcIntersectingRect = function (ax, ay, ar, rx, ry, rw, rh) {
  return !(
    ax <= rx - ar ||
    ax >= rx + rw + ar ||
    ay <= ry - ar ||
    ay >= ry + rh + ar
  );
};

$.util.pointInRect = function (px, py, rx, ry, rw, rh) {
  return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh;
};

/*==============================================================================
Shapes
==============================================================================*/
$.util.circle = function (ctx, x, y, radius) {
  radius = radius <= 0 ? 1 : radius;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, $.tau, false);
};

$.util.fillCircle = function (ctx, x, y, radius, fillStyle) {
  $.util.circle(ctx, x, y, radius);
  ctx.fillStyle = fillStyle;
  ctx.fill();
};

$.util.strokeCircle = function (ctx, x, y, radius, strokeStyle, lineWidth) {
  $.util.circle(ctx, x, y, radius);
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = strokeStyle;
  ctx.stroke();
};

/*==============================================================================
Miscellaneous
==============================================================================*/
$.util.pad = function (amount, digits) {
  amount += "";
  if (amount.length < digits) {
    amount = "0" + amount;
    return $.util.pad(amount, digits);
  } else {
    return amount;
  }
};

$.util.convertTime = function (seconds) {
  let minutes = Math.floor(seconds / 60);
  seconds = Math.floor(seconds % 60);
  return $.util.pad(minutes, 2) + ":" + $.util.pad(seconds, 2);
};

$.util.commas = function (nStr) {
  nStr += "";
  let x = nStr.split("."),
    x1 = x[0],
    x2 = x.length > 1 ? "." + x[1] : "",
    rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, "$1" + "," + "$2");
  }
  return x1 + x2;
};

$.util.isset = function (prop) {
  return typeof prop != "undefined";
};

// Retorna o inimigo mais próximo da posição (x, y)
$.util.getNearestEnemy = function(x, y) {
  let minDist = Infinity;
  let nearest = null;
  for (let i = 0; i < $.enemies.length; i++) {
    let enemy = $.enemies[i];
    if (!enemy.inView || enemy.life <= 0) continue;
    let dist = $.util.distance(x, y, enemy.x, enemy.y);
    if (dist < minDist) {
      minDist = dist;
      nearest = enemy;
    }
  }
  return nearest;
};
