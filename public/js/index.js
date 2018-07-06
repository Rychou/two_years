var extend = function extend(base) {
  for (var _len = arguments.length, extensions = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    extensions[_key - 1] = arguments[_key];
  }

  return Object.assign.apply(Object, [{}, base].concat(extensions));
};

var parseColor = function parseColor(_ref) {
  var h = _ref.h,
      s = _ref.s,
      l = _ref.l,
      a = _ref.a;
  return 'hsla(' + h + ',' + s + '%,' + l + '%,' + a + ')';
};

var Color = extend.bind(null, { h: 0, s: 100, l: 100, a: 1 });

var Vector = extend.bind(null, { x: 0, y: 0 });

var Particle = extend.bind(null, {
  pos: Vector(),
  vel: Vector(),
  angle: 0,
  speed: 0,
  radius: 0,
  rotation: 0,
  color: Color()
});

var colors = [Color({ h: 20, s: 100, l: 50 }), Color({ h: 200, l: 50 }), Color({ h: 300, l: 50 }), Color({ h: 100, l: 40 })];

var animationLoop = function animationLoop(scope) {
  if (scope.animation) {
    scope.animation(animationLoop.bind(null, scope));
  }

  var ctx = scope.ctx;
  var canvas = ctx.canvas;

  var rc = rough.canvas(canvas);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  scope.particles.map(function (p, i) {
    p.pos.y -= p.speed;
    if (i % 2) {
      p.pos.x = p.pos.x + Math.sin(p.angle) * .2;
    } else {
      p.pos.x = p.pos.x - Math.cos(p.angle) * .2;
    }
    p.angle += .01;
    rc.circle(p.pos.x, p.pos.y, p.radius, {
      fill: parseColor(p.color),
      roughness: Math.random() * 1.5,
      hachureGap: p.hachureGap,
      hachureAngle: p.hachureAngle
    });
    rc.line(p.pos.x, p.pos.y + p.radius * 1.2, p.pos.x, p.pos.y + p.radius / 2, {
      bowing: Math.random() * 3
    });
    if (p.pos.y + p.radius * 3 < 0) {
      p.pos.y = canvas.height + p.radius * 3;
      p.pos.x = Math.random() * (canvas.width - p.radius);
    }
  });
};

var scope = {
  animation: requestAnimationFrame.bind(null),
  ctx: document.createElement('canvas').getContext('2d'),
  title: 'Brian Douglas',
  rotation: 0,
  particles: []
};

~function (scope) {
  var canvas = scope.ctx.canvas;


  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);

  var particleCount = 50;
  while (particleCount--) {
    scope.particles.push(Particle({
      pos: {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height
      },
      speed: Math.random() + .2,
      radius: Math.random() * 60 + 20,
      color: colors[Math.floor(Math.random() * colors.length)],
      hachureAngle: Math.random() * 90,
      hachureGap: Math.random() * 8 + 1
    }));
  }

  animationLoop(scope);
}(scope);

if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
  window.addEventListener('resize', function () {
    scope.ctx.canvas.width = window.innerWidth;
    scope.ctx.canvas.height = window.innerHeight;
  });
}