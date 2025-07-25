/*==============================================================================
Init
==============================================================================*/
$.init = function () {
  // Detectar se é mobile ANTES de tudo
  $.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  $.setupStorage();
  $.wrap = document.getElementById("wrap");
  $.cbg1 = document.getElementById("cbg1");
  $.cbg2 = document.getElementById("cbg2");
  $.cbg3 = document.getElementById("cbg3");
  $.cbg4 = document.getElementById("cbg4");
  $.cmg = document.getElementById("cmg");
  $.ctxbg1 = $.cbg1.getContext("2d");
  $.ctxbg2 = $.cbg2.getContext("2d");
  $.ctxbg3 = $.cbg3.getContext("2d");
  $.ctxbg4 = $.cbg4.getContext("2d");
  $.ctxmg = $.cmg.getContext("2d");
  $.cw = 800;
  $.ch = 600;
  $.cmg.width = 800;
  $.cmg.height = 600;
  $.cratio = $.cw / $.ch;
  // $.wrap.style.width = $.cw + "px";
  // $.wrap.style.height = $.ch + "px";
  $.ww = Math.floor($.cw * 2);
  $.wh = Math.floor($.ch * 2);
  $.gameScale = 1;
  $.shouldScale = 0;
  $.cbg1.width = Math.floor($.cw * 1.1);
  $.cbg1.height = Math.floor($.ch * 1.1);
  $.cbg2.width = Math.floor($.cw * 1.15);
  $.cbg2.height = Math.floor($.ch * 1.15);
  $.cbg3.width = Math.floor($.cw * 1.2);
  $.cbg3.height = Math.floor($.ch * 1.2);
  $.cbg4.width = Math.floor($.cw * 1.25);
  $.cbg4.height = Math.floor($.ch * 1.25);

  $.screen = {
    x: ($.ww - $.cw) / -2,
    y: ($.wh - $.ch) / -2,
  };

  $.mute = $.storage["mute"] || false;
  Howler.mute($.mute);

  $.keys = {
    state: {
      up: 0,
      down: 0,
      left: 0,
      right: 0,
      m: 0,
      p: 0,
      f: 0,
      esc: 0,
    },
    pressed: {
      up: 0,
      down: 0,
      left: 0,
      right: 0,
      m: 0,
      p: 0,
      f: 0,
      esc: 0,
    },
  };
  $.okeys = {};
  $.mouse = {
    x: $.ww / 2,
    y: $.wh / 2,
    sx: 0,
    sy: 0,
    ax: window.innerWidth / 2,
    ay: 0,
    down: 0,
  };
  $.buttons = [];

  $.minimap = {
    x: 20,
    y: $.ch - Math.floor($.ch * 0.1) - 20,
    width: Math.floor($.cw * 0.1),
    height: Math.floor($.ch * 0.1),
    scale: Math.floor($.cw * 0.1) / $.ww,
    color: "hsla(0, 0%, 0%, 0.85)",
    strokeColor: "#3a3a3a",
  };
  $.cOffset = {
    left: 0,
    top: 0,
  };

  $.levelCount = $.definitions.levels.length;
  $.states = {};
  $.state = "";
  $.enemies = [];
  $.bullets = [];
  $.explosions = [];
  $.powerups = [];
  $.particleEmitters = [];
  $.textPops = [];
  $.levelPops = [];
  $.powerupTimers = [];

  $.powerupDuration = 300;
  $.slowEnemyDivider = 3;
  $.healthBarParticleEmitterTickMax = 1;
  $.healthBarParticleEmitterTick = $.healthBarParticleEmitterTickMax;

  $.edgeSize = 50;

  $.resizecb();
  $.bindEvents();
  $.setupStates();
  $.renderBackground1();
  $.renderBackground2();
  $.renderBackground3();
  $.renderBackground4();
  $.setState("menu");
  $.loop();

  // Criar controles mobile se necessário
  if ($.isMobile) {
    $.createMobileControls();
  }
};

/*==============================================================================
Reset
==============================================================================*/
$.reset = function () {
  $.indexGlobal = 0;
  $.dt = 1;
  $.lt = 0;
  $.pt = null;
  $.elapsed = 0;
  $.tick = 0;

  $.gameoverTick = 0;
  $.gameoverTickMax = 200;
  $.gameoverExplosion = 0;

  $.instructionTick = 0;
  $.instructionTickMax = 400;

  $.levelDiffOffset = 0;
  $.enemyOffsetMod = 0;
  $.slow = 0;

  $.screen = {
    x: ($.ww - $.cw) / -2,
    y: ($.wh - $.ch) / -2,
  };
  $.rumble = {
    x: 0,
    y: 0,
    level: 0,
    decay: 0.4,
  };

  $.mouse.down = 0;

  $.level = {
    current: 0,
    kills: 0,
    killsToLevel: $.definitions.levels[0].killsToLevel,
    distribution: $.definitions.levels[0].distribution,
    distributionCount: $.definitions.levels[0].distribution.length,
  };

  $.enemies.length = 0;
  $.bullets.length = 0;
  $.explosions.length = 0;
  $.powerups.length = 0;
  $.particleEmitters.length = 0;
  $.textPops.length = 0;
  $.levelPops.length = 0;
  $.powerupTimers.length = 0;

  for (let i = 0; i < $.definitions.powerups.length; i++) {
    $.powerupTimers.push(0);
  }

  $.kills = 0;
  $.bulletsFired = 0;
  $.powerupsCollected = 0;
  $.score = 0;

  $.hero = new $.Hero();

  $.levelPops.push(
    new $.LevelPop({
      level: 1,
    })
  );
};

/*==============================================================================
Render Backgrounds
==============================================================================*/
$.renderBackground1 = function () {
  let gradient = $.ctxbg1.createRadialGradient(
    $.cbg1.width / 2,
    $.cbg1.height / 2,
    0,
    $.cbg1.width / 2,
    $.cbg1.height / 2,
    $.cbg1.height
  );
  gradient.addColorStop(0, "hsla(0, 0%, 100%, 0.1)");
  gradient.addColorStop(0.65, "hsla(0, 0%, 100%, 0)");
  $.ctxbg1.fillStyle = gradient;
  $.ctxbg1.fillRect(0, 0, $.cbg1.width, $.cbg1.height);

  let i = 2000;
  while (i--) {
    $.util.fillCircle(
      $.ctxbg1,
      $.util.rand(0, $.cbg1.width),
      $.util.rand(0, $.cbg1.height),
      $.util.rand(0.2, 0.5),
      "hsla(0, 0%, 100%, " + $.util.rand(0.05, 0.2) + ")"
    );
  }

  let j = 800;
  while (j--) {
    $.util.fillCircle(
      $.ctxbg1,
      $.util.rand(0, $.cbg1.width),
      $.util.rand(0, $.cbg1.height),
      $.util.rand(0.1, 0.8),
      "hsla(0, 0%, 100%, " + $.util.rand(0.05, 0.5) + ")"
    );
  }
};

$.renderBackground2 = function () {
  let i = 80;
  while (i--) {
    $.util.fillCircle(
      $.ctxbg2,
      $.util.rand(0, $.cbg2.width),
      $.util.rand(0, $.cbg2.height),
      $.util.rand(1, 2),
      "hsla(0, 0%, 100%, " + $.util.rand(0.05, 0.15) + ")"
    );
  }
};

$.renderBackground3 = function () {
  let i = 40;
  while (i--) {
    $.util.fillCircle(
      $.ctxbg3,
      $.util.rand(0, $.cbg3.width),
      $.util.rand(0, $.cbg3.height),
      $.util.rand(1, 2.5),
      "hsla(0, 0%, 100%, " + $.util.rand(0.05, 0.1) + ")"
    );
  }
};

$.renderBackground4 = function () {
  let size = $.edgeSize;
  $.ctxbg4.fillStyle = "hsla(0, 0%, 50%, 0.05)";
  let i = Math.round($.cbg4.height / size);
  while (i--) {
    $.ctxbg4.fillRect(0, i * size + 25, $.cbg4.width, 1);
  }
  i = Math.round($.cbg4.width / size);
  while (i--) {
    $.ctxbg4.fillRect(i * size, 0, 1, $.cbg4.height);
  }
};

$.refreshStaticBackgrounds = function () {
  [$.ctxbg1, $.ctxbg2, $.ctxbg3, $.ctxbg4].forEach((ctx) => {
    ctx.fillStyle = "transparent";
    ctx.fillRect(0, 0, 1, 1);
  });
};

/*==============================================================================
User Interface / UI / GUI / Minimap
==============================================================================*/

$.renderInterface = function () {
  /*==============================================================================
  Powerup Timers
  ==============================================================================*/
  for (let i = 0; i < $.definitions.powerups.length; i++) {
    let powerup = $.definitions.powerups[i];
    let powerupOn = $.powerupTimers[i] > 0;
    $.ctxmg.beginPath();
    let powerupText = $.text({
      ctx: $.ctxmg,
      x: $.minimap.x + $.minimap.width + 90,
      y: $.minimap.y + 4 + i * 12,
      text: powerup.title,
      hspacing: 1,
      vspacing: 1,
      halign: "right",
      valign: "top",
      scale: 1,
      snap: 1,
      render: 1,
    });
    if (powerupOn) {
      $.ctxmg.fillStyle = "hsla(0, 0%, 100%, 1)";
    } else {
      $.ctxmg.fillStyle = "hsla(0, 0%, 100%, 0.25)";
    }
    $.ctxmg.fill();
    if (powerupOn) {
      let powerupBarBack = {
        x: powerupText.ex + 5,
        y: powerupText.sy,
        width: 110,
        height: 5,
      };
      $.ctxmg.fillStyle = "hsla(0, 0%, 100%, 0.25)";
      $.ctxmg.fillRect(
        powerupBarBack.x,
        powerupBarBack.y,
        powerupBarBack.width,
        powerupBarBack.height
      );
      let powerupBar = {
        x: powerupText.ex + 5,
        y: powerupText.sy,
        width: 110,
        height: 5,
      };
      $.ctxmg.fillStyle =
        "hsl(" +
        powerup.hue +
        ", " +
        powerup.saturation +
        "%, " +
        powerup.lightness +
        "%)";
      $.ctxmg.fillRect(
        powerupBar.x,
        powerupBar.y,
        ($.powerupTimers[i] / $.powerupDuration) * powerupBar.width,
        powerupBar.height
      );
    }
  }

  /*==============================================================================
    Instructions
    ==============================================================================*/
  if ($.instructionTick < $.instructionTickMax) {
    $.instructionTick += $.dt;
    $.ctxmg.beginPath();
    $.text({
      ctx: $.ctxmg,
      x: $.cw / 2 - 10,
      y: $.ch - 20,
      text: "MOVE\nAIM/FIRE\nPAUSE\nMUTE",
      hspacing: 1,
      vspacing: 17,
      halign: "right",
      valign: "bottom",
      scale: 2,
      snap: 1,
      render: 1,
    });
    let alpha = 0.5;
    if ($.instructionTick < $.instructionTickMax * 0.25) {
      alpha = ($.instructionTick / ($.instructionTickMax * 0.25)) * 0.5;
    } else if (
      $.instructionTick >
      $.instructionTickMax - $.instructionTickMax * 0.25
    ) {
      alpha =
        (($.instructionTickMax - $.instructionTick) /
          ($.instructionTickMax * 0.25)) *
        0.5;
    }
    alpha = Math.min(1, Math.max(0, alpha));

    $.ctxmg.fillStyle = "hsla(0, 0%, 100%, " + alpha + ")";
    $.ctxmg.fill();

    $.ctxmg.beginPath();
    $.text({
      ctx: $.ctxmg,
      x: $.cw / 2 + 10,
      y: $.ch - 20,
      text: "WASD/ARROWS\nMOUSE\nP/ESC\nM",
      hspacing: 1,
      vspacing: 17,
      halign: "left",
      valign: "bottom",
      scale: 2,
      snap: 1,
      render: 1,
    });
    alpha = 1;
    if ($.instructionTick < $.instructionTickMax * 0.25) {
      alpha = ($.instructionTick / ($.instructionTickMax * 0.25)) * 1;
    } else if (
      $.instructionTick >
      $.instructionTickMax - $.instructionTickMax * 0.25
    ) {
      alpha =
        (($.instructionTickMax - $.instructionTick) /
          ($.instructionTickMax * 0.25)) *
        1;
    }
    alpha = Math.min(1, Math.max(0, alpha));

    $.ctxmg.fillStyle = "hsla(0, 0%, 100%, " + alpha + ")";
    $.ctxmg.fill();
  }

  /*==============================================================================
    Slow Enemies Screen Cover
    ==============================================================================*/
  if ($.powerupTimers[1] > 0) {
    $.ctxmg.fillStyle = "hsla(170, 100%, 20%, 0.1)";
    $.ctxmg.fillRect(0, 0, $.cw, $.ch);
  }

  /*==============================================================================
  Health
  ==============================================================================*/
  $.ctxmg.beginPath();
  let healthText = $.text({
    ctx: $.ctxmg,
    x: 20,
    y: 20,
    text: "HEALTH",
    hspacing: 1,
    vspacing: 1,
    halign: "top",
    valign: "left",
    scale: 2,
    snap: 1,
    render: 1,
  });
  $.ctxmg.fillStyle = "hsla(0, 0%, 100%, 0.5)";
  $.ctxmg.fill();
  let healthBar = {
    x: healthText.ex + 10,
    y: healthText.sy,
    width: 110,
    height: 10,
  };
  $.ctxmg.fillStyle = "hsla(0, 0%, 20%, 1)";
  $.ctxmg.fillRect(healthBar.x, healthBar.y, healthBar.width, healthBar.height);
  $.ctxmg.fillStyle = "hsla(0, 0%, 100%, 0.25)";
  $.ctxmg.fillRect(
    healthBar.x,
    healthBar.y,
    healthBar.width,
    healthBar.height / 2
  );
  $.ctxmg.fillStyle = "hsla(" + $.hero.life * 120 + ", 100%, 40%, 1)";
  $.ctxmg.fillRect(
    healthBar.x,
    healthBar.y,
    $.hero.life * healthBar.width,
    healthBar.height
  );
  $.ctxmg.fillStyle = "hsla(" + $.hero.life * 120 + ", 100%, 75%, 1)";
  $.ctxmg.fillRect(
    healthBar.x,
    healthBar.y,
    $.hero.life * healthBar.width,
    healthBar.height / 2
  );

  if ($.healthBarParticleEmitterTick < $.healthBarParticleEmitterTickMax) {
    $.healthBarParticleEmitterTick += $.dt;
  }

  if (
    $.hero.takingDamage &&
    $.hero.life > 0 &&
    $.healthBarParticleEmitterTick >= $.healthBarParticleEmitterTickMax
  ) {
    $.healthBarParticleEmitterTick = 0;
    $.particleEmitters.push(
      new $.ParticleEmitter({
        x: healthBar.x + $.hero.life * healthBar.width,
        y: healthBar.y,
        count: 1,
        spawnRange: 0,
        friction: 0.85,
        minSpeed: 2,
        maxSpeed: 20,
        minDirection: $.pi / 2 - 0.1,
        maxDirection: $.pi / 2 + 0.1,
        hue: $.hero.life * 120,
        saturation: 100,
        offsetScreen: true,
        offsetRumble: true,
      })
    );
  }

  /*==============================================================================
  Progress
  ==============================================================================*/
  $.ctxmg.beginPath();
  let progressText = $.text({
    ctx: $.ctxmg,
    x: healthBar.x + healthBar.width + 30,
    y: 20,
    text: `LEVEL ${$.util.pad($.level.current + 1, 2)}`,
    hspacing: 1,
    vspacing: 1,
    halign: "top",
    valign: "left",
    scale: 2,
    snap: 1,
    render: 1,
  });
  $.ctxmg.fillStyle = "hsla(0, 0%, 100%, 0.5)";
  $.ctxmg.fill();
  let progressBar = {
    x: progressText.ex + 10,
    y: progressText.sy,
    width: healthBar.width,
    height: healthBar.height,
  };
  $.ctxmg.fillStyle = "hsla(0, 0%, 20%, 1)";
  $.ctxmg.fillRect(
    progressBar.x,
    progressBar.y,
    progressBar.width,
    progressBar.height
  );
  $.ctxmg.fillStyle = "hsla(0, 0%, 100%, 0.25)";
  $.ctxmg.fillRect(
    progressBar.x,
    progressBar.y,
    progressBar.width,
    progressBar.height / 2
  );
  $.ctxmg.fillStyle = "hsla(0, 0%, 50%, 1)";
  $.ctxmg.fillRect(
    progressBar.x,
    progressBar.y,
    ($.level.kills / $.level.killsToLevel) * progressBar.width,
    progressBar.height
  );
  $.ctxmg.fillStyle = "hsla(0, 0%, 100%, 1)";
  $.ctxmg.fillRect(
    progressBar.x,
    progressBar.y,
    ($.level.kills / $.level.killsToLevel) * progressBar.width,
    progressBar.height / 2
  );

  if ($.level.kills == $.level.killsToLevel) {
    $.particleEmitters.push(
      new $.ParticleEmitter({
        x: progressBar.x + progressBar.width,
        y: progressBar.y,
        count: 30,
        spawnRange: 5,
        friction: 0.95,
        minSpeed: 2,
        maxSpeed: 25,
        minDirection: 0,
        minDirection: $.pi / 2 - $.pi / 4,
        maxDirection: $.pi / 2 + $.pi / 4,
        hue: 0,
        saturation: 0,
        offsetScreen: true,
        offsetRumble: true,
      })
    );
  }

  /*==============================================================================
  Score
  ==============================================================================*/
  $.ctxmg.beginPath();
  let scoreLabel = $.text({
    ctx: $.ctxmg,
    x: progressBar.x + progressBar.width + 30,
    y: 20,
    text: "SCORE",
    hspacing: 1,
    vspacing: 1,
    halign: "top",
    valign: "left",
    scale: 2,
    snap: 1,
    render: 1,
  });
  $.ctxmg.fillStyle = "hsla(0, 0%, 100%, 0.5)";
  $.ctxmg.fill();

  $.ctxmg.beginPath();
  let scoreText = $.text({
    ctx: $.ctxmg,
    x: scoreLabel.ex + 10,
    y: 20,
    text: $.util.pad($.score, 6),
    hspacing: 1,
    vspacing: 1,
    halign: "top",
    valign: "left",
    scale: 2,
    snap: 1,
    render: 1,
  });
  $.ctxmg.fillStyle = "hsla(0, 0%, 100%, 1)";
  $.ctxmg.fill();

  $.ctxmg.beginPath();
  let bestLabel = $.text({
    ctx: $.ctxmg,
    x: scoreText.ex + 30,
    y: 20,
    text: "BEST",
    hspacing: 1,
    vspacing: 1,
    halign: "top",
    valign: "left",
    scale: 2,
    snap: 1,
    render: 1,
  });
  $.ctxmg.fillStyle = "hsla(0, 0%, 100%, 0.5)";
  $.ctxmg.fill();

  $.ctxmg.beginPath();
  let bestText = $.text({
    ctx: $.ctxmg,
    x: bestLabel.ex + 10,
    y: 20,
    text: $.util.pad(Math.max($.storage["score"], $.score), 6),
    hspacing: 1,
    vspacing: 1,
    halign: "top",
    valign: "left",
    scale: 2,
    snap: 1,
    render: 1,
  });
  $.ctxmg.fillStyle = "hsla(0, 0%, 100%, 1)";
  $.ctxmg.fill();
};

$.renderMinimap = function () {
  $.ctxmg.fillStyle = $.minimap.color;
  $.ctxmg.fillRect($.minimap.x, $.minimap.y, $.minimap.width, $.minimap.height);

  $.ctxmg.fillStyle = "hsla(0, 0%, 100%, 0.1)";
  $.ctxmg.fillRect(
    $.minimap.x + -$.screen.x * $.minimap.scale,
    $.minimap.y + -$.screen.y * $.minimap.scale,
    $.cw * $.minimap.scale,
    $.ch * $.minimap.scale
  );

  $.ctxmg.beginPath();
  for (let i = 0; i < $.enemies.length; i++) {
    let enemy = $.enemies[i];
    let x = $.minimap.x + enemy.x * $.minimap.scale;
    let y = $.minimap.y + enemy.y * $.minimap.scale;
    if (
      $.util.pointInRect(
        x,
        y,
        $.minimap.x,
        $.minimap.y,
        $.minimap.width,
        $.minimap.height
      )
    ) {
      $.ctxmg.rect(x, y, 2, 2);
    }
  }
  $.ctxmg.fillStyle = "hsl(0, 100%, 60%)";
  $.ctxmg.fill();

  $.ctxmg.beginPath();
  for (let i = 0; i < $.bullets.length; i++) {
    let bullet = $.bullets[i];
    let x = $.minimap.x + bullet.x * $.minimap.scale;
    let y = $.minimap.y + bullet.y * $.minimap.scale;
    $.ctxmg.rect(x, y, 1, 1);
  }
  $.ctxmg.fillStyle = "#fff";
  $.ctxmg.fill();

  $.ctxmg.fillStyle = $.hero.fillStyle;
  $.ctxmg.fillRect(
    $.minimap.x + $.hero.x * $.minimap.scale,
    $.minimap.y + $.hero.y * $.minimap.scale,
    2,
    2
  );

  $.ctxmg.strokeStyle = $.minimap.strokeColor;
  $.ctxmg.strokeRect(
    $.minimap.x - 0.5,
    $.minimap.y - 0.5,
    $.minimap.width + 1,
    $.minimap.height + 1
  );
};

/*==============================================================================
Enemy Spawning
==============================================================================*/
$.getSpawnCoordinates = function (radius) {
  let quadrant = Math.floor($.util.rand(0, 4));
  let x;
  let y;
  let start;

  if (quadrant === 0) {
    x = $.util.rand(0, $.ww);
    y = -radius;
    start = "top";
  } else if (quadrant === 1) {
    x = $.ww + radius;
    y = $.util.rand(0, $.wh);
    start = "right";
  } else if (quadrant === 2) {
    x = $.util.rand(0, $.ww);
    y = $.wh + radius;
    start = "bottom";
  } else {
    x = -radius;
    y = $.util.rand(0, $.wh);
    start = "left";
  }

  return { x: x, y: y, start: start };
};

$.spawnEnemy = function (type) {
  let params = $.definitions.enemies[type];
  let coordinates = $.getSpawnCoordinates(params.radius);
  params.x = coordinates.x;
  params.y = coordinates.y;
  params.start = coordinates.start;
  params.type = type;
  return new $.Enemy(params);
};

$.spawnEnemies = function () {
  for (let i = 0; i < $.level.distributionCount; i++) {
    let timeCheck = $.level.distribution[i].time;
    if ($.levelDiffOffset > 0) {
      timeCheck = Math.max(1, timeCheck - $.levelDiffOffset * 2);
    }
    let timeDiff = Date.now() - $.level.distribution[i].lastSpawn;
    let timeCheckNormalized = timeCheck * (1000 / 60);
    let timeOverflow = Math.min(
      timeCheckNormalized,
      timeDiff - timeCheckNormalized
    );
    if (timeDiff >= timeCheckNormalized) {
      $.level.distribution[i].lastSpawn = Date.now() - timeOverflow;
      $.enemies.push($.spawnEnemy(i));
    }
  }
};

/*==============================================================================
Events
==============================================================================*/
$.mousemovecb = function (e) {
  e.preventDefault();
  $.mouse.ax = e.pageX;
  $.mouse.ay = e.pageY;
  $.mousescreen();
};

$.mousescreen = function () {
  $.mouse.sx = $.mouse.ax - $.cOffset.left;
  $.mouse.sy = $.mouse.ay - $.cOffset.top;
  $.mouse.x = $.mouse.sx / $.gameScale - $.screen.x;
  $.mouse.y = $.mouse.sy / $.gameScale - $.screen.y;
};

$.mousedowncb = function (e) {
  $.mouse.down = 1;
};

$.mouseupcb = function (e) {
  $.mouse.down = 0;
};

// Touch event handlers para mobile
$.touchstartcb = function (e) {
  e.preventDefault();
  if (e.touches.length > 0) {
    let touch = e.touches[0];
    $.mouse.ax = touch.pageX;
    $.mouse.ay = touch.pageY;
    $.mousescreen();
    $.mouse.down = 1;
  }
};

$.touchmovecb = function (e) {
  e.preventDefault();
  if (e.touches.length > 0) {
    let touch = e.touches[0];
    $.mouse.ax = touch.pageX;
    $.mouse.ay = touch.pageY;
    $.mousescreen();
  }
};

$.touchendcb = function (e) {
  e.preventDefault();
  $.mouse.down = 0;
};

$.keydowncb = function (e) {
  e = e.keyCode ? e.keyCode : e.which;
  if (e === 38 || e === 87) {
    $.keys.state.up = 1;
  }
  if (e === 39 || e === 68) {
    $.keys.state.right = 1;
  }
  if (e === 40 || e === 83) {
    $.keys.state.down = 1;
  }
  if (e === 37 || e === 65) {
    $.keys.state.left = 1;
  }
  if (e === 77) {
    $.keys.state.m = 1;
  }
  if (e === 80) {
    $.keys.state.p = 1;
  }
  if (e === 70) {
    $.keys.state.f = 1;
  }
  if (e === 27) {
    $.keys.state.esc = 1;
  }
  // Disparo especial com Enter
  if (e === 13 && $.state === "play" && $.hero && $.hero.shootNearestEnemy) {
    $.hero.shootNearestEnemy();
  }
  // Soltar bomba com B
  if (e === 66 && $.state === "play" && $.hero && $.hero.dropBomb) {
    $.hero.dropBomb();
  }
  // Ativar escudo com tecla 2 ou E
  if ((e === 50 || e === 69) && $.state === "play" && $.hero && $.hero.activateShield) {
    $.hero.activateShield();
  }
  // Usar cura com tecla C ou 3
  if ((e === 67 || e === 51) && $.state === "play" && $.hero && $.hero.useHeal) {
    $.hero.useHeal();
  }
};

$.keyupcb = function (e) {
  e = e.keyCode ? e.keyCode : e.which;
  if (e === 38 || e === 87) {
    $.keys.state.up = 0;
  }
  if (e === 39 || e === 68) {
    $.keys.state.right = 0;
  }
  if (e === 40 || e === 83) {
    $.keys.state.down = 0;
  }
  if (e === 37 || e === 65) {
    $.keys.state.left = 0;
  }
  if (e === 77) {
    $.keys.state.m = 0;
  }
  if (e === 80) {
    $.keys.state.p = 0;
  }
  if (e === 70) {
    $.keys.state.f = 0;
  }
  if (e === 27) {
    $.keys.state.esc = 0;
  }
};

$.resizecb = function (e) {
  let winWidth = window.innerWidth;
  let winHeight = window.innerHeight;
  let winRatio = winWidth / winHeight;
  if (winRatio > $.cratio) {
    $.gameScale = winHeight / $.ch;
  } else {
    $.gameScale = winWidth / $.cw;
  }
  $.gameScale = $.shouldScale ? $.gameScale : 1;
  $.wrap.style.transform = `scale(${$.gameScale})`;

  window.setTimeout(() => {
    let rect = $.cmg.getBoundingClientRect();
    $.cOffset = {
      left: rect.left,
      top: rect.top,
    };
  }, 0);
};

$.blurcb = function () {
  if ($.state == "play") {
    $.keys.state.up = 0;
    $.keys.state.right = 0;
    $.keys.state.down = 0;
    $.keys.state.left = 0;
    $.setState("pause");
  }
};

$.focuscb = function () {};

$.visibilitychangecb = function () {
  if (document.visibilityState === "visible") {
    $.refreshStaticBackgrounds();
  }
};

$.contextmenucb = function (e) {
  e.preventDefault();
};

$.bindEvents = function () {
  window.addEventListener("mousemove", $.mousemovecb);
  window.addEventListener("mousedown", $.mousedowncb);
  window.addEventListener("mouseup", $.mouseupcb);
  window.addEventListener("keydown", $.keydowncb);
  window.addEventListener("keyup", $.keyupcb);
  window.addEventListener("resize", $.resizecb);
  window.addEventListener("blur", $.blurcb);
  window.addEventListener("focus", $.focuscb);
  document.addEventListener("visibilitychange", $.visibilitychangecb);
  window.addEventListener("contextmenu", $.contextmenucb);
  
  // Adicionar suporte para touch events em mobile
  if ($.isMobile) {
    window.addEventListener("touchstart", $.touchstartcb);
    window.addEventListener("touchmove", $.touchmovecb);
    window.addEventListener("touchend", $.touchendcb);
  }
};

/*==============================================================================
Mobile Controls
==============================================================================*/
$.createMobileControls = function() {
  // Criar joystick virtual
  let joystick = document.createElement('div');
  joystick.id = 'joystick';
  joystick.style.position = 'fixed';
  joystick.style.left = '30px';
  joystick.style.bottom = '30px';
  joystick.style.width = '100px';
  joystick.style.height = '100px';
  joystick.style.background = 'rgba(100,100,100,0.3)';
  joystick.style.borderRadius = '50%';
  joystick.style.zIndex = 1000;
  joystick.style.touchAction = 'none';
  joystick.style.border = '2px solid rgba(255,255,255,0.5)';
  joystick.style.display = 'none'; // Inicialmente escondido
  document.body.appendChild(joystick);

  let stick = document.createElement('div');
  stick.id = 'stick';
  stick.style.position = 'absolute';
  stick.style.left = '35px';
  stick.style.top = '35px';
  stick.style.width = '30px';
  stick.style.height = '30px';
  stick.style.background = '#fff';
  stick.style.borderRadius = '50%';
  stick.style.opacity = 0.8;
  stick.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
  joystick.appendChild(stick);

  // Botões de ação
  let btns = [
    {id:'btn-fire', label:'🔥', right:30, bottom:30, action:()=>{
      if ($.state === "play" && $.hero) {
        $.mouse.down = 1;
        setTimeout(()=>{$.mouse.down = 0;}, 150);
      }
    }},
    {id:'btn-bomb', label:'💣', right:30, bottom:140, action:()=>{
      if ($.state === "play" && $.hero && $.hero.dropBomb) {
        $.hero.dropBomb();
      }
    }},
    {id:'btn-shield', label:'🛡️', right:140, bottom:30, action:()=>{
      if ($.state === "play" && $.hero && $.hero.activateShield) {
        $.hero.activateShield();
      }
    }},
    {id:'btn-heal', label:'❤️', right:140, bottom:140, action:()=>{
      if ($.state === "play" && $.hero && $.hero.useHeal) {
        $.hero.useHeal();
      }
    }},
  ];
  
  btns.forEach(cfg=>{
    let btn = document.createElement('button');
    btn.id = cfg.id;
    btn.innerHTML = cfg.label;
    btn.style.position = 'fixed';
    btn.style.right = cfg.right+'px';
    btn.style.bottom = cfg.bottom+'px';
    btn.style.width = '60px';
    btn.style.height = '60px';
    btn.style.borderRadius = '50%';
    btn.style.fontSize = '1.5em';
    btn.style.opacity = 0.9;
    btn.style.zIndex = 1000;
    btn.style.background = 'rgba(34,34,34,0.8)';
    btn.style.color = '#fff';
    btn.style.border = '2px solid rgba(255,255,255,0.7)';
    btn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
    btn.style.touchAction = 'none';
    btn.style.display = 'none'; // Inicialmente escondido
    btn.ontouchstart = e=>{e.preventDefault(); cfg.action();};
    btn.ontouchend = e=>{e.preventDefault();};
    document.body.appendChild(btn);
  });

  // Joystick touch events
  let dragging = false, startX=0, startY=0;
  joystick.ontouchstart = function(e){
    e.preventDefault();
    dragging = true;
    let t = e.touches[0];
    startX = t.clientX;
    startY = t.clientY;
  };
  joystick.ontouchmove = function(e){
    e.preventDefault();
    if (!dragging) return;
    let t = e.touches[0];
    let dx = t.clientX - startX;
    let dy = t.clientY - startY;
    let max = 40;
    dx = Math.max(-max, Math.min(max, dx));
    dy = Math.max(-max, Math.min(max, dy));
    stick.style.left = (35+dx)+'px';
    stick.style.top = (35+dy)+'px';
    
    // Simular movimento do mouse para direção (só durante o jogo)
    if ($.state === "play" && $.hero) {
      $.mouse.x = $.hero.x + dx*3;
      $.mouse.y = $.hero.y + dy*3;
    }
  };
  joystick.ontouchend = function(e){
    e.preventDefault();
    dragging = false;
    stick.style.left = '35px';
    stick.style.top = '35px';
  };
};

// Função para mostrar/esconder controles mobile
$.toggleMobileControls = function(show) {
  if (!$.isMobile) return;
  
  let joystick = document.getElementById('joystick');
  let btns = ['btn-fire', 'btn-bomb', 'btn-shield', 'btn-heal'];
  
  if (joystick) {
    joystick.style.display = show ? 'block' : 'none';
  }
  
  btns.forEach(id => {
    let btn = document.getElementById(id);
    if (btn) {
      btn.style.display = show ? 'block' : 'none';
    }
  });
};

/*==============================================================================
Miscellaneous
==============================================================================*/
$.clearScreen = function () {
  $.ctxmg.clearRect(0, 0, $.cw, $.ch);
};

$.updateDelta = function () {
  let now = Date.now();
  $.dt = (now - $.lt) / (1000 / 60);
  $.dt = $.dt < 0 ? 0.001 : $.dt;
  $.dt = $.dt > 10 ? 10 : $.dt;
  $.lt = now;
  $.elapsed += $.dt;
};

$.updateScreen = function () {
  let xModify = 0.5;
  let yModify = 0.5;

  if ($.hero.x < $.cw / 2) {
    xModify = $.hero.x / $.cw;
  } else if ($.hero.x > $.ww - $.cw / 2) {
    xModify = 1 - ($.ww - $.hero.x) / $.cw;
  }

  if ($.hero.y < $.ch / 2) {
    yModify = $.hero.y / $.ch;
  } else if ($.hero.y > $.wh - $.ch / 2) {
    yModify = 1 - ($.wh - $.hero.y) / $.ch;
  }

  $.screen.x +=
    ($.cw * xModify - $.hero.x - $.screen.x) * (1 - Math.exp(-0.05 * $.dt));
  $.screen.y +=
    ($.ch * yModify - $.hero.y - $.screen.y) * (1 - Math.exp(-0.05 * $.dt));

  // update rumble levels, keep X and Y changes consistent, apply rumble
  $.rumble.x = 0;
  $.rumble.y = 0;

  if ($.rumble.level > 0) {
    $.rumble.level -= $.rumble.decay * $.dt;
    $.rumble.level = Math.max(0, $.rumble.level);
    $.rumble.x = $.util.rand(-$.rumble.level, $.rumble.level);
    $.rumble.y = $.util.rand(-$.rumble.level, $.rumble.level);
  }

  // animate background canvases
  let bgs = [$.cbg1, $.cbg2, $.cbg3, $.cbg4];
  for (let i = 0; i < bgs.length; i++) {
    let bg = bgs[i];
    bg.style.transform = `translate3d(${
      -((bg.width - $.cw) / 2) - // half the difference from bg to viewport
      ((bg.width - $.cw) / 2) * // half the diff again, modified by a percentage below
        ((-$.screen.x - ($.ww - $.cw) / 2) / (($.ww - $.cw) / 2)) - // viewport offset applied to bg
      $.rumble.x
    }px, ${
      -((bg.height - $.ch) / 2) -
      ((bg.height - $.ch) / 2) *
        ((-$.screen.y - ($.wh - $.ch) / 2) / (($.wh - $.ch) / 2)) -
      $.rumble.y
    }px, 0)`;
  }

  $.mousescreen();
};

$.updateLevel = function () {
  if ($.level.kills >= $.level.killsToLevel) {
    if ($.level.current + 1 < $.levelCount) {
      $.level.current++;
      $.level.kills = 0;
      $.level.killsToLevel = $.definitions.levels[$.level.current].killsToLevel;
      $.level.distribution = $.definitions.levels[$.level.current].distribution;
      $.level.distributionCount = $.level.distribution.length;
    } else {
      $.level.current++;
      $.level.kills = 0;
    }
    $.levelDiffOffset = $.level.current + 1 - $.levelCount;
    $.levelPops.push(
      new $.LevelPop({
        level: $.level.current + 1,
      })
    );
  }
};

$.updatePowerupTimers = function () {
  // HEALTH
  if ($.powerupTimers[0] > 0) {
    if ($.hero.life < 1) {
      $.hero.life += 0.001 * $.dt;
    }
    if ($.hero.life > 1) {
      $.hero.life = 1;
    }
    $.powerupTimers[0] -= $.dt;
    $.powerupTimers[0] = Math.max($.powerupTimers[0], 0);
  }

  // SLOW ENEMIES
  if ($.powerupTimers[1] > 0) {
    $.slow = 1;
    $.powerupTimers[1] -= $.dt;
    $.powerupTimers[1] = Math.max($.powerupTimers[1], 0);
  } else {
    $.slow = 0;
  }

  // FAST SHOT
  if ($.powerupTimers[2] > 0) {
    $.hero.weapon.fireRateTickMax = 2;
    $.hero.weapon.bullet.speed = 14;
    $.powerupTimers[2] -= $.dt;
    $.powerupTimers[2] = Math.max($.powerupTimers[2], 0);
  } else {
    $.hero.weapon.fireRateTickMax = 5;
    $.hero.weapon.bullet.speed = 10;
  }

  // TRIPLE SHOT
  if ($.powerupTimers[3] > 0) {
    $.hero.weapon.count = 3;
    $.powerupTimers[3] -= $.dt;
    $.powerupTimers[3] = Math.max($.powerupTimers[3], 0);
  } else {
    $.hero.weapon.count = 1;
  }

  // PIERCE SHOT
  if ($.powerupTimers[4] > 0) {
    $.hero.weapon.bullet.piercing = 1;
    $.powerupTimers[4] -= $.dt;
    $.powerupTimers[4] = Math.max($.powerupTimers[4], 0);
  } else {
    $.hero.weapon.bullet.piercing = 0;
  }
};

$.spawnPowerup = function (x, y) {
  let maxPowerups = 10;
  let chance = 0.1;
  let totalPowerupsActive = $.powerupTimers.reduce((acc, curr) => {
    return acc + (curr > 0 ? 1 : 0);
  }, 0);
  chance -= totalPowerupsActive * 0.02;

  if ($.powerups.length < maxPowerups && Math.random() < chance) {
    let min = $.hero.life < 0.9 ? 0 : 1;
    let type = Math.floor($.util.rand(min, $.definitions.powerups.length));
    let params = $.definitions.powerups[type];
    params.type = type;
    params.x = x;
    params.y = y;
    $.powerups.push(new $.Powerup(params));
  }
};

/*==============================================================================
States
==============================================================================*/
$.setState = function (state) {
  // handle clean up between states
  $.buttons.length = 0;
  
  // Controlar visibilidade dos controles mobile
  if ($.isMobile) {
    $.toggleMobileControls(state === "play");
  }

  if (state == "menu") {
    $.mouse.down = 0;
    $.mouse.ax = 0;
    $.mouse.ay = 0;

    $.reset();

    let playButton = new $.Button({
      x: $.cw / 2 + 1,
      // y: $.ch / 2 + 26,
      y: $.ch - 174,
      lockedWidth: 299,
      lockedHeight: 49,
      scale: 3,
      title: "PLAY",
      action: function () {
        $.reset();
        $.audio.play("levelup");
        $.setState("play");
      },
    });
    $.buttons.push(playButton);

    let statsButton = new $.Button({
      x: $.cw / 2 + 1,
      y: playButton.ey + 25,
      lockedWidth: 299,
      lockedHeight: 49,
      scale: 3,
      title: "STATS",
      action: function () {
        $.setState("stats");
      },
    });
    $.buttons.push(statsButton);

    let creditsButton = new $.Button({
      x: $.cw / 2 + 1,
      y: statsButton.ey + 26,
      lockedWidth: 299,
      lockedHeight: 49,
      scale: 3,
      title: "CREDITS",
      action: function () {
        $.setState("credits");
      },
    });
    $.buttons.push(creditsButton);
  }

  if (state == "stats") {
    $.mouse.down = 0;

    let clearButton = new $.Button({
      x: $.cw / 2 + 1,
      y: 426,
      lockedWidth: 299,
      lockedHeight: 49,
      scale: 3,
      title: "CLEAR DATA",
      action: function () {
        $.mouse.down = 0;
        if (
          window.confirm(
            "Are you sure you want to clear all locally stored game data? This cannot be undone."
          )
        ) {
          $.clearStorage();
          $.mouse.down = 0;
        }
      },
    });
    $.buttons.push(clearButton);

    let menuButton = new $.Button({
      x: $.cw / 2 + 1,
      y: clearButton.ey + 25,
      lockedWidth: 299,
      lockedHeight: 49,
      scale: 3,
      title: "MENU",
      action: function () {
        $.setState("menu");
      },
    });
    $.buttons.push(menuButton);
  }

  if (state == "credits") {
    $.mouse.down = 0;

    let js13kButton = new $.Button({
      x: $.cw / 2 + 1,
      y: 476,
      lockedWidth: 299,
      lockedHeight: 49,
      scale: 3,
      title: "JS13KGAMES",
      action: function () {
        window.open("http://js13kgames.com", "_blank").focus();
        $.mouse.down = 0;
      },
    });
    $.buttons.push(js13kButton);

    let menuButton = new $.Button({
      x: $.cw / 2 + 1,
      y: js13kButton.ey + 25,
      lockedWidth: 299,
      lockedHeight: 49,
      scale: 3,
      title: "MENU",
      action: function () {
        $.setState("menu");
      },
    });
    $.buttons.push(menuButton);
  }

  if (state == "pause") {
    $.pt = Date.now();
    $.mouse.down = 0;
    $.screenshot = $.ctxmg.getImageData(0, 0, $.cw, $.ch);
    let resumeButton = new $.Button({
      x: $.cw / 2 + 1,
      y: $.ch / 2 + 26,
      lockedWidth: 299,
      lockedHeight: 49,
      scale: 3,
      title: "RESUME",
      action: function () {
        $.lt = Date.now() + 1000;
        $.setState("play");
      },
    });
    $.buttons.push(resumeButton);

    let menuButton = new $.Button({
      x: $.cw / 2 + 1,
      y: resumeButton.ey + 25,
      lockedWidth: 299,
      lockedHeight: 49,
      scale: 3,
      title: "MENU",
      action: function () {
        $.mouse.down = 0;
        if (
          window.confirm(
            "Are you sure you want to end this game and return to the menu?"
          )
        ) {
          $.mousescreen();
          $.setState("menu");
        }
      },
    });
    $.buttons.push(menuButton);
  }

  if (state == "play") {
    $.lt = Date.now();

    if ($.pt) {
      for (let i = 0; i < $.level.distribution.length; i++) {
        $.level.distribution[i].lastSpawn += Date.now() - $.pt;
      }
    }
  }

  if (state == "gameover") {
    $.mouse.down = 0;

    $.screenshot = $.ctxmg.getImageData(0, 0, $.cw, $.ch);
    let resumeButton = new $.Button({
      x: $.cw / 2 + 1,
      y: 426,
      lockedWidth: 299,
      lockedHeight: 49,
      scale: 3,
      title: "PLAY AGAIN",
      action: function () {
        $.reset();
        $.audio.play("levelup");
        $.setState("play");
      },
    });
    $.buttons.push(resumeButton);

    let menuButton = new $.Button({
      x: $.cw / 2 + 1,
      y: resumeButton.ey + 25,
      lockedWidth: 299,
      lockedHeight: 49,
      scale: 3,
      title: "MENU",
      action: function () {
        $.setState("menu");
      },
    });
    $.buttons.push(menuButton);

    $.storage["score"] = Math.max($.storage["score"], $.score);
    $.storage["level"] = Math.max($.storage["level"], $.level.current);
    $.storage["rounds"] += 1;
    $.storage["kills"] += $.kills;
    $.storage["bullets"] += $.bulletsFired;
    $.storage["powerups"] += $.powerupsCollected;
    $.storage["time"] += Math.floor($.elapsed);
    $.updateStorage();
  }

  // set state
  $.state = state;
};

$.setupStates = function () {
  $.states["menu"] = function () {
    $.clearScreen();
    $.updateScreen();

    let stripeRed = "hsla(0, 100%, 60%, 1)";
    let stripeGreen = "hsla(120, 100%, 60%, 1)";
    let stripeBlue = "hsla(210, 100%, 60%, 1)";
    let stripeWidth = 21;
    let set1h = 125;
    let set1y = 0;
    let set2h = 100;
    let set2y = 275;
    let set3h = 25;
    let set3y = $.ch - set3h;

    $.ctxmg.fillStyle = stripeRed;
    $.ctxmg.fillRect($.cw / 2 - 35, 0, stripeWidth, set1h);

    $.ctxmg.fillStyle = stripeGreen;
    $.ctxmg.fillRect($.cw / 2 - 10, 0, stripeWidth, set1h);

    $.ctxmg.fillStyle = stripeBlue;
    $.ctxmg.fillRect($.cw / 2 + 15, 0, stripeWidth, set1h);

    $.ctxmg.fillStyle = stripeRed;
    $.ctxmg.fillRect($.cw / 2 - 35, set2y, stripeWidth, set2h);

    $.ctxmg.fillStyle = stripeGreen;
    $.ctxmg.fillRect($.cw / 2 - 10, set2y, stripeWidth, set2h);

    $.ctxmg.fillStyle = stripeBlue;
    $.ctxmg.fillRect($.cw / 2 + 15, set2y, stripeWidth, set2h);

    $.ctxmg.fillStyle = stripeRed;
    $.ctxmg.fillRect($.cw / 2 - 35, set3y, stripeWidth, set3h);

    $.ctxmg.fillStyle = stripeGreen;
    $.ctxmg.fillRect($.cw / 2 - 10, set3y, stripeWidth, set3h);

    $.ctxmg.fillStyle = stripeBlue;
    $.ctxmg.fillRect($.cw / 2 + 15, set3y, stripeWidth, set3h);

    let i = $.buttons.length;
    while (i--) {
      $.buttons[i].update(i);
    }
    i = $.buttons.length;
    while (i--) {
      $.buttons[i].render(i);
    }

    $.ctxmg.beginPath();
    let title1 = $.text({
      ctx: $.ctxmg,
      x: $.cw / 2,
      y: $.ch / 2 - 48,
      text: "RADIUS\nRAID",
      hspacing: 4,
      vspacing: 4,
      halign: "center",
      valign: "bottom",
      scale: 10,
      snap: 1,
      render: 1,
    });
    $.ctxmg.fillStyle = "#fff";
    $.ctxmg.fill();
  };

  $.states["stats"] = function () {
    $.clearScreen();

    $.ctxmg.beginPath();
    let statsTitle = $.text({
      ctx: $.ctxmg,
      x: $.cw / 2,
      y: 150,
      text: "STATS",
      hspacing: 4,
      vspacing: 1,
      halign: "center",
      valign: "bottom",
      scale: 10,
      snap: 1,
      render: 1,
    });
    $.ctxmg.fillStyle = "#fff";
    $.ctxmg.fill();

    $.ctxmg.beginPath();
    let statKeys = $.text({
      ctx: $.ctxmg,
      x: $.cw / 2 - 10,
      y: statsTitle.ey + 39,
      text: "BEST SCORE\nBEST LEVEL\nROUNDS PLAYED\nENEMIES KILLED\nBULLETS FIRED\nPOWERUPS COLLECTED\nTIME ELAPSED",
      hspacing: 1,
      vspacing: 17,
      halign: "right",
      valign: "top",
      scale: 2,
      snap: 1,
      render: 1,
    });
    $.ctxmg.fillStyle = "hsla(0, 0%, 100%, 0.5)";
    $.ctxmg.fill();

    $.ctxmg.beginPath();
    let statsValues = $.text({
      ctx: $.ctxmg,
      x: $.cw / 2 + 10,
      y: statsTitle.ey + 39,
      text:
        $.util.commas($.storage["score"]) +
        "\n" +
        ($.storage["level"] + 1) +
        "\n" +
        $.util.commas($.storage["rounds"]) +
        "\n" +
        $.util.commas($.storage["kills"]) +
        "\n" +
        $.util.commas($.storage["bullets"]) +
        "\n" +
        $.util.commas($.storage["powerups"]) +
        "\n" +
        $.util.convertTime(($.storage["time"] * (1000 / 60)) / 1000),
      hspacing: 1,
      vspacing: 17,
      halign: "left",
      valign: "top",
      scale: 2,
      snap: 1,
      render: 1,
    });
    $.ctxmg.fillStyle = "#fff";
    $.ctxmg.fill();

    let i = $.buttons.length;
    while (i--) {
      $.buttons[i].render(i);
    }
    i = $.buttons.length;
    while (i--) {
      $.buttons[i].update(i);
    }

    if ($.keys.pressed.esc) {
      $.setState("menu");
    }
  };

  $.states["credits"] = function () {
    $.clearScreen();

    $.ctxmg.beginPath();
    let creditsTitle = $.text({
      ctx: $.ctxmg,
      x: $.cw / 2,
      y: 100,
      text: "CREDITS",
      hspacing: 4,
      vspacing: 1,
      halign: "center",
      valign: "bottom",
      scale: 10,
      snap: 1,
      render: 1,
    });
    $.ctxmg.fillStyle = "#fff";
    $.ctxmg.fill();

    $.ctxmg.beginPath();
    let creditKeys = $.text({
      ctx: $.ctxmg,
      x: $.cw / 2 - 10,
      y: creditsTitle.ey + 49,
      text: "CREATED BY\nINSPIRATION AND SUPPORT\n\nAUDIO PROCESSING\nGAME INSPIRATION AND IDEAS\n\nHTML5 CANVAS REFERENCE\n\nGAME MATH REFERENCE",
      hspacing: 1,
      vspacing: 17,
      halign: "right",
      valign: "top",
      scale: 2,
      snap: 1,
      render: 1,
    });
    $.ctxmg.fillStyle = "hsla(0, 0%, 100%, 0.5)";
    $.ctxmg.fill();

    $.ctxmg.beginPath();
    let creditValues = $.text({
      ctx: $.ctxmg,
      x: $.cw / 2 + 10,
      y: creditsTitle.ey + 49,
      text: "@JACKRUGILE\n@REZONER, @LOKTAR00, @END3R,\n@AUSTINHALLOCK, @CHANDLERPRALL\nJSFXR BY @MARKUSNEUBRAND\nASTEROIDS, CELL WARFARE,\nSPACE PIPS, AND MANY MORE\nNIHILOGIC HTML5\nCANVAS CHEAT SHEET\nBILLY LAMBERTA FOUNDATION\nHTML5 ANIMATION WITH JAVASCRIPT",
      hspacing: 1,
      vspacing: 17,
      halign: "left",
      valign: "top",
      scale: 2,
      snap: 1,
      render: 1,
    });
    $.ctxmg.fillStyle = "#fff";
    $.ctxmg.fill();

    let i = $.buttons.length;
    while (i--) {
      $.buttons[i].render(i);
    }
    i = $.buttons.length;
    while (i--) {
      $.buttons[i].update(i);
    }

    if ($.keys.pressed.esc) {
      $.setState("menu");
    }
  };

  $.states["play"] = function () {
    // Remover chefões extras imediatamente, mas nunca remova o boss com menor vida (o mais danificado)
    let bossIndexes = [];
    let ttovosIndexes = [];
    for (let i = 0; i < $.enemies.length; i++) {
      if ($.enemies[i].isBoss && $.enemies[i].isTtovos) ttovosIndexes.push(i);
      else if ($.enemies[i].isBoss) bossIndexes.push(i);
    }
    // Garante só um Ttovos
    if (ttovosIndexes.length > 1) {
      let minLife = Infinity;
      let keepIndex = ttovosIndexes[0];
      for (let idx of ttovosIndexes) {
        if ($.enemies[idx].life < minLife) {
          minLife = $.enemies[idx].life;
          keepIndex = idx;
        }
      }
      for (let i = ttovosIndexes.length - 1; i >= 0; i--) {
        let idx = ttovosIndexes[i];
        if (idx !== keepIndex) {
          $.enemies.splice(idx, 1);
        }
      }
      $.bossAlive = true;
    } else if (bossIndexes.length > 1) {
      let minLife = Infinity;
      let keepIndex = bossIndexes[0];
      for (let idx of bossIndexes) {
        if ($.enemies[idx].life < minLife) {
          minLife = $.enemies[idx].life;
          keepIndex = idx;
        }
      }
      for (let i = bossIndexes.length - 1; i >= 0; i--) {
        let idx = bossIndexes[i];
        if (idx !== keepIndex) {
          $.enemies.splice(idx, 1);
        }
      }
      $.bossAlive = true;
    } else {
      $.bossAlive = (bossIndexes.length + ttovosIndexes.length) === 1;
    }
    $.updateDelta();
    $.updateScreen();
    $.updateLevel();
    $.updatePowerupTimers();
    // Lógica de spawn do boss Ttovos
    if (!$.bossAlive && $.kills > 0 && $.kills % 1050 === 0) {
      $.bossActive = true;
      $.bossSpawnTimer = 75 * 75;
      let bossDef = Object.assign({}, $.definitions.enemies[$.definitions.enemies.length - 1]);
      bossDef.x = $.ww / 2;
      bossDef.y = $.wh / 2;
      bossDef.start = 'center';
      $.enemies.push(new $.Enemy(bossDef));
    }
    // Lógica de spawn do boss normal
    else if (!$.bossAlive && $.kills > 0 && $.kills % 4988 === 0) {
      $.bossActive = true;
      $.bossSpawnTimer = 75 * 75;
      $.bossAppearances = ($.bossAppearances || 0) + 1;
      let bossDef = Object.assign({}, $.definitions.enemies[$.definitions.enemies.length - 2]);
      bossDef.bossLevel = $.bossAppearances;
      bossDef.life = 230 + ($.bossAppearances-1) * 2000;
      bossDef.bossSmartness = 1 + ($.bossAppearances-1)*0.2;
      bossDef.setup = $.definitions.enemies[$.definitions.enemies.length - 2].setup;
      bossDef.behavior = $.definitions.enemies[$.definitions.enemies.length - 2].behavior;
      bossDef.death = $.definitions.enemies[$.definitions.enemies.length - 2].death;
      bossDef.x = $.ww / 2;
      bossDef.y = $.wh / 2;
      bossDef.start = 'center';
      $.enemies.push(new $.Enemy(bossDef));
    }
    // Pausa o spawn de inimigos comuns enquanto qualquer boss está ativo
    if ($.bossAlive) {
      if ($.bossSpawnTimer > 0) {
        $.bossSpawnTimer--;
      }
    } else {
    $.spawnEnemies();
    }

    // update entities
    let i = $.enemies.length;
    while (i--) {
      $.enemies[i].update(i);
    }
    // Garante que só exista um chefão por vez
    if (window.bossGuard) bossGuard();
    i = $.explosions.length;
    while (i--) {
      $.explosions[i].update(i);
    }
    i = $.powerups.length;
    while (i--) {
      $.powerups[i].update(i);
    }
    i = $.particleEmitters.length;
    while (i--) {
      $.particleEmitters[i].update(i);
    }
    i = $.textPops.length;
    while (i--) {
      $.textPops[i].update(i);
    }
    i = $.levelPops.length;
    while (i--) {
      $.levelPops[i].update(i);
    }
    i = $.bullets.length;
    while (i--) {
      $.bullets[i].update(i);
    }
    $.hero.update();

    // Atualizar bombas no loop do estado play
    if ($.bombs) {
      for (let i = $.bombs.length - 1; i >= 0; i--) {
        let bomb = $.bombs[i];
        if (bomb.smartBomb && !bomb.exploded) {
          // Segue o player
          let dx = $.hero.x - bomb.x;
          let dy = $.hero.y - bomb.y;
          let dist = Math.sqrt(dx*dx + dy*dy);
          if (dist > 2) {
            let speed = 280; 
            // Inteligência: antecipa o movimento do player
            let predictX = $.hero.x + $.hero.vx * 10;
            let predictY = $.hero.y + $.hero.vy * 10;
            let pdx = predictX - bomb.x;
            let pdy = predictY - bomb.y;
            let pdist = Math.sqrt(pdx*pdx + pdy*pdy);
            bomb.x += (pdx / pdist) * speed * ($.dt / 60);
            bomb.y += (pdy / pdist) * speed * ($.dt / 60);
          }
          // Efeito de rastro
          $.particleEmitters.push(
            new $.ParticleEmitter({
              x: bomb.x,
              y: bomb.y,
              count: 1,
              spawnRange: 0,
              friction: 0.85,
              minSpeed: 1,
              maxSpeed: 3,
              minDirection: 0,
              maxDirection: $.tau,
              hue: 120,
              saturation: 100,
              lightness: 60,
              size: 3,
              tickMax: 10,
            })
          );
        }
        bomb.timer -= $.dt / 60;
        if (!bomb.exploded && bomb.timer <= 0) {
          bomb.exploded = true;
          // Eliminar inimigos no raio (corrigido)
          for (let j = $.enemies.length - 1; j >= 0; j--) {
            let enemy = $.enemies[j];
            // Se for bomba do boss, não afeta o boss
            if (bomb.bossBomb && enemy.isBoss) continue;
            if ($.util.distance(bomb.x, bomb.y, enemy.x, enemy.y) <= bomb.radius) {
              enemy.receiveDamage(j, enemy.life + 9999); // garantir morte instantânea
            }
          }
          // Efeito de partículas vermelhas melhorado
          for (let p = 0; p < 120; p++) {
            let angle = Math.random() * $.tau;
            let speed = 8 + Math.random() * 24;
            let size = 3 + Math.random() * 7;
            let life = 20 + Math.random() * 30;
            $.particleEmitters.push(
              new $.ParticleEmitter({
                x: bomb.x,
                y: bomb.y,
                count: 1,
                spawnRange: 0,
                friction: 0.85,
                minSpeed: speed,
                maxSpeed: speed,
                minDirection: angle,
                maxDirection: angle,
                hue: 0,
                saturation: 100,
                lightness: 40 + Math.random() * 30,
                size: size,
                tickMax: life,
              })
            );
          }
          // Efeito de onda circular
          $.particleEmitters.push(
            new $.ParticleEmitter({
              x: bomb.x,
              y: bomb.y,
              count: 40,
              spawnRange: bomb.radius * 0.7,
              friction: 0.95,
              minSpeed: 2,
              maxSpeed: 6,
              minDirection: 0,
              maxDirection: $.tau,
              hue: 0,
              saturation: 100,
              lightness: 60,
              size: 8,
              tickMax: 30,
            })
          );
          $.audio.play("explosion");
          // Dano ao player
          let distToPlayer = $.util.distance(bomb.x, bomb.y, $.hero.x, $.hero.y);
          if (distToPlayer <= bomb.radius) {
            // Se for bomba do boss, dano maior
            if (bomb.bossBomb) {
              if (!$.hero.specials.shieldActive) {
                $.hero.life -= 0.3; // 30% da vida
                //console.log('Dano bomba boss!');
              }
            } else {
              if (!$.hero.specials.shieldActive) {
                $.hero.life -= 0.18; // 18% da vida (ajuste se quiser)
                //console.log('Dano bomba player!');
              }
            }
            if ($.hero.life < 0) $.hero.life = 0;
          }
        }
        // Remover bomba após explodir
        if (bomb.exploded && bomb.timer <= -0.5) {
          $.bombs.splice(i, 1);
        }
      }
    }

    // render entities
    $.clearScreen();
    $.ctxmg.save();
    $.ctxmg.translate($.screen.x - $.rumble.x, $.screen.y - $.rumble.y);
    i = $.enemies.length;
    while (i--) {
      $.enemies[i].render(i);
    }

    $.ctxmg.strokeStyle = `hsla(0, 0%, 0%, 0.75)`;
    $.ctxmg.lineWidth = $.edgeSize * 2;
    $.ctxmg.strokeRect(0, 0, $.ww, $.wh);

    $.ctxmg.strokeStyle = `hsla(0, 0%, 100%, ${
      0.5 + Math.sin($.tick * 0.1) * 0.25
    })`;
    $.ctxmg.lineWidth = 1;
    $.ctxmg.strokeRect(
      $.edgeSize + 0.5,
      $.edgeSize + 0.5,
      $.ww - $.edgeSize * 2 - 1,
      $.wh - $.edgeSize * 2 - 1
    );

    i = $.explosions.length;
    while (i--) {
      $.explosions[i].render(i);
    }
    i = $.powerups.length;
    while (i--) {
      $.powerups[i].render(i);
    }
    i = $.particleEmitters.length;
    while (i--) {
      $.particleEmitters[i].render(i);
    }
    i = $.textPops.length;
    while (i--) {
      $.textPops[i].render(i);
    }
    i = $.bullets.length;
    while (i--) {
      $.bullets[i].render(i);
    }
    $.hero.render();

    // Renderizar bombas (círculo cinza e contorno vermelho ou verde para smartBomb)
    if ($.bombs) {
      for (let i = 0; i < $.bombs.length; i++) {
        let bomb = $.bombs[i];
        if (!bomb.exploded) {
          $.ctxmg.save();
          $.ctxmg.globalAlpha = 0.7;
          if (bomb.smartBomb) {
            $.util.fillCircle($.ctxmg, bomb.x, bomb.y, 16, bomb.color || '#0f0');
            $.util.strokeCircle($.ctxmg, bomb.x, bomb.y, bomb.radius, bomb.color || '#0f0', 3);
          } else {
            $.util.fillCircle($.ctxmg, bomb.x, bomb.y, 16, "#888");
            $.util.strokeCircle($.ctxmg, bomb.x, bomb.y, bomb.radius, "#f00", 2);
          }
          $.ctxmg.globalAlpha = 1;
          $.ctxmg.restore();
        }
      }
    }

    $.ctxmg.restore();
    i = $.levelPops.length;
    while (i--) {
      $.levelPops[i].render(i);
    }
    $.renderInterface();
    $.renderMinimap();
    renderSlotsBar();

    // handle gameover
    if ($.hero.life <= 0) {
      let alpha = ($.gameoverTick / $.gameoverTickMax) * 0.8;
      alpha = Math.min(1, Math.max(0, alpha));
      $.ctxmg.fillStyle = "hsla(0, 100%, 0%, " + alpha + ")";
      $.ctxmg.fillRect(0, 0, $.cw, $.ch);
      if ($.gameoverTick < $.gameoverTickMax) {
        $.gameoverTick += $.dt;
      } else {
        $.setState("gameover");
      }

      if (!$.gameoverExplosion) {
        $.audio.play("death");
        $.rumble.level = 25;
        $.explosions.push(
          new $.Explosion({
            x: $.hero.x,
            y: $.hero.y,
            radius: 100,
            hue: 0,
            saturation: 0,
            tickMax: 120,
          })
        );
        $.particleEmitters.push(
          new $.ParticleEmitter({
            x: $.hero.x,
            y: $.hero.y,
            count: 45,
            spawnRange: 10,
            friction: 0.95,
            minSpeed: 2,
            maxSpeed: 20,
            minDirection: 0,
            maxDirection: $.tau,
            hue: 0,
            saturation: 0,
          })
        );
        for (let i = 0; i < $.powerupTimers.length; i++) {
          $.powerupTimers[i] = 0;
        }
        $.gameoverExplosion = 1;
      }
    }

    // update tick
    $.tick += $.dt;

    // listen for pause
    if ($.keys.pressed.p || $.keys.pressed.esc) {
      $.setState("pause");
    }
  };

  $.states["pause"] = function () {
    $.clearScreen();
    $.ctxmg.putImageData($.screenshot, 0, 0);

    $.ctxmg.fillStyle = "hsla(0, 0%, 0%, 0.4)";
    $.ctxmg.fillRect(0, 0, $.cw, $.ch);

    $.ctxmg.beginPath();
    let pauseText = $.text({
      ctx: $.ctxmg,
      x: $.cw / 2,
      y: $.ch / 2 - 50,
      text: "PAUSED",
      hspacing: 4,
      vspacing: 1,
      halign: "center",
      valign: "bottom",
      scale: 10,
      snap: 1,
      render: 1,
    });
    $.ctxmg.fillStyle = "#fff";
    $.ctxmg.fill();

    let i = $.buttons.length;
    while (i--) {
      $.buttons[i].render(i);
    }
    i = $.buttons.length;
    while (i--) {
      $.buttons[i].update(i);
    }

    if ($.keys.pressed.p) {
      $.setState("play");
    }
  };

  $.states["gameover"] = function () {
    $.clearScreen();
    $.ctxmg.putImageData($.screenshot, 0, 0);

    let i = $.buttons.length;
    while (i--) {
      $.buttons[i].update(i);
    }
    i = $.buttons.length;
    while (i--) {
      $.buttons[i].render(i);
    }

    $.ctxmg.beginPath();
    let gameoverTitle = $.text({
      ctx: $.ctxmg,
      x: $.cw / 2,
      y: 150,
      text: "GAME OVER",
      hspacing: 4,
      vspacing: 1,
      halign: "center",
      valign: "bottom",
      scale: 10,
      snap: 1,
      render: 1,
    });
    $.ctxmg.fillStyle = "hsl(0, 100%, 60%)";
    $.ctxmg.fill();

    $.ctxmg.beginPath();
    let gameoverStatsKeys = $.text({
      ctx: $.ctxmg,
      x: $.cw / 2 - 10,
      y: gameoverTitle.ey + 51,
      text: "SCORE\nLEVEL\nKILLS\nBULLETS\nPOWERUPS\nTIME",
      hspacing: 1,
      vspacing: 17,
      halign: "right",
      valign: "top",
      scale: 2,
      snap: 1,
      render: 1,
    });
    $.ctxmg.fillStyle = "hsla(0, 0%, 100%, 0.5)";
    $.ctxmg.fill();

    $.ctxmg.beginPath();
    let gameoverStatsValues = $.text({
      ctx: $.ctxmg,
      x: $.cw / 2 + 10,
      y: gameoverTitle.ey + 51,
      text:
        $.util.commas($.score) +
        "\n" +
        ($.level.current + 1) +
        "\n" +
        $.util.commas($.kills) +
        "\n" +
        $.util.commas($.bulletsFired) +
        "\n" +
        $.util.commas($.powerupsCollected) +
        "\n" +
        $.util.convertTime(($.elapsed * (1000 / 60)) / 1000),
      hspacing: 1,
      vspacing: 17,
      halign: "left",
      valign: "top",
      scale: 2,
      snap: 1,
      render: 1,
    });
    $.ctxmg.fillStyle = "#fff";
    $.ctxmg.fill();
  };
};

/*==============================================================================
Loop
==============================================================================*/
$.loop = function () {
  window.requestAnimationFrame($.loop);

  // setup the pressed state for all keys
  for (let k in $.keys.state) {
    if ($.keys.state[k] && !$.okeys[k]) {
      $.keys.pressed[k] = 1;
    } else {
      $.keys.pressed[k] = 0;
    }
  }

  // run the current state
  $.states[$.state]();

  // listen for scale
  if ($.keys.pressed.f) {
    $.shouldScale = !$.shouldScale;
    $.resizecb();
  }

  // always listen for mute toggle
  if ($.keys.pressed.m) {
    $.mute = !$.mute;
    Howler.mute($.mute);
    $.storage["mute"] = $.mute;
    $.updateStorage();
  }

  // move current keys into old keys
  $.okeys = {};
  for (let k in $.keys.state) {
    $.okeys[k] = $.keys.state[k];
  }
};

/*==============================================================================
Start Game on Load
==============================================================================*/
window.addEventListener("load", function () {
  document.documentElement.className += " loaded";
  $.init();
});

// Renderizar barra de slots no canto inferior central
function renderSlotsBar() {
  const slotCount = 4;
  const slotSize = 48;
  const slotPadding = 16;
  const borderRadius = 10;
  const totalWidth = slotCount * slotSize + (slotCount - 1) * slotPadding;
  const xStart = $.cw / 2 - totalWidth / 2;
  const y = $.ch - slotSize - 18;
  for (let i = 0; i < slotCount; i++) {
    let x = xStart + i * (slotSize + slotPadding);
    // Fundo do slot (retângulo arredondado)
    $.ctxmg.save();
    $.ctxmg.globalAlpha = 0.85;
    $.ctxmg.beginPath();
    $.ctxmg.moveTo(x + borderRadius, y);
    $.ctxmg.lineTo(x + slotSize - borderRadius, y);
    $.ctxmg.quadraticCurveTo(x + slotSize, y, x + slotSize, y + borderRadius);
    $.ctxmg.lineTo(x + slotSize, y + slotSize - borderRadius);
    $.ctxmg.quadraticCurveTo(x + slotSize, y + slotSize, x + slotSize - borderRadius, y + slotSize);
    $.ctxmg.lineTo(x + borderRadius, y + slotSize);
    $.ctxmg.quadraticCurveTo(x, y + slotSize, x, y + slotSize - borderRadius);
    $.ctxmg.lineTo(x, y + borderRadius);
    $.ctxmg.quadraticCurveTo(x, y, x + borderRadius, y);
    $.ctxmg.closePath();
    $.ctxmg.fillStyle = '#222';
    $.ctxmg.fill();
    $.ctxmg.globalAlpha = 1;
    $.ctxmg.lineWidth = 3;
    $.ctxmg.strokeStyle = '#555';
    $.ctxmg.stroke();
    $.ctxmg.restore();
    // Conteúdo do slot 0: bombas
    if (i === 0) {
      $.ctxmg.save();
      // Ícone da bomba
      $.util.fillCircle($.ctxmg, x + slotSize / 2, y + slotSize / 2, 14, '#888');
      $.util.strokeCircle($.ctxmg, x + slotSize / 2, y + slotSize / 2, 14, '#f00', 2);
      // Número de bombas
      $.ctxmg.font = 'bold 20px Arial';
      $.ctxmg.fillStyle = '#fff';
      $.ctxmg.textAlign = 'center';
      $.ctxmg.textBaseline = 'middle';
      let bombs = ($.hero && $.hero.specials && typeof $.hero.specials.bombCount === 'number') ? $.hero.specials.bombCount : 0;
      $.ctxmg.fillText(bombs, x + slotSize / 2, y + slotSize / 2 + 18);
      $.ctxmg.restore();
    }
    // Conteúdo do slot 1: escudo
    if (i === 1) {
      $.ctxmg.save();
      // Ícone de escudo
      $.util.strokeCircle($.ctxmg, x + slotSize / 2, y + slotSize / 2, 15, '#0ff', 3);
      $.ctxmg.globalAlpha = 0.7;
      $.util.fillCircle($.ctxmg, x + slotSize / 2, y + slotSize / 2, 13, '#0ff');
      $.ctxmg.globalAlpha = 1;
      // Número de escudos
      $.ctxmg.font = 'bold 20px Arial';
      $.ctxmg.fillStyle = '#222';
      $.ctxmg.textAlign = 'center';
      $.ctxmg.textBaseline = 'middle';
      let shields = ($.hero && $.hero.specials && typeof $.hero.specials.shieldCount === 'number') ? $.hero.specials.shieldCount : 0;
      $.ctxmg.fillText(shields, x + slotSize / 2, y + slotSize / 2 + 18);
      $.ctxmg.restore();
    }
    // Conteúdo do slot 2: cura
    if (i === 2) {
      $.ctxmg.save();
      // Ícone de coração (desenho simples)
      $.ctxmg.fillStyle = '#e33';
      $.ctxmg.beginPath();
      let cx = x + slotSize / 2, cy = y + slotSize / 2;
      $.ctxmg.moveTo(cx, cy + 7);
      $.ctxmg.bezierCurveTo(cx - 14, cy - 8, cx - 10, cy - 22, cx, cy - 10);
      $.ctxmg.bezierCurveTo(cx + 10, cy - 22, cx + 14, cy - 8, cx, cy + 7);
      $.ctxmg.closePath();
      $.ctxmg.fill();
      $.ctxmg.strokeStyle = '#fff';
      $.ctxmg.lineWidth = 2;
      $.ctxmg.stroke();
      // Número de curas
      $.ctxmg.font = 'bold 20px Arial';
      $.ctxmg.fillStyle = '#fff';
      $.ctxmg.textAlign = 'center';
      $.ctxmg.textBaseline = 'middle';
      let heals = ($.hero && $.hero.specials && typeof $.hero.specials.healCount === 'number') ? $.hero.specials.healCount : 0;
      $.ctxmg.fillText(heals, x + slotSize / 2, y + slotSize / 2 + 18);
      $.ctxmg.restore();
    }
    // Slot 3 vazio
  }
}
