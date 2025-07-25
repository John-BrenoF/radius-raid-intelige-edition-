/*==============================================================================
Definitions
==============================================================================*/
$.definitions = {};

/*==============================================================================
Enemies
==============================================================================*/
$.definitions.enemies = [
  {
    // Enemy 0 - horizontal / vertical
    value: 5,
    speed: 1.5,
    life: 1,
    radius: 15,
    hue: 180,
    lockBounds: 1,
    setup: function () {
      if (this.start == "top") {
        this.direction = $.pi / 2;
      } else if (this.start == "right") {
        this.direction = -$.pi;
      } else if (this.start == "bottom") {
        this.direction = -$.pi / 2;
      } else {
        this.direction = 0;
      }
    },
    behavior: function () {
      let speed = this.speed;
      if ($.slow) {
        speed = this.speed / $.slowEnemyDivider;
      }

      this.vx = Math.cos(this.direction) * speed;
      this.vy = Math.sin(this.direction) * speed;
    },
  },
  {
    // Enemy 1 - diagonal
    value: 10,
    speed: 1.5,
    life: 2,
    radius: 15,
    hue: 120,
    lockBounds: 1,
    setup: function () {
      let rand = Math.floor($.util.rand(0, 2));
      if (this.start == "top") {
        this.direction = rand ? $.pi / 2 + $.pi / 4 : $.pi / 2 - $.pi / 4;
      } else if (this.start == "right") {
        this.direction = rand ? -$.pi + $.pi / 4 : -$.pi - $.pi / 4;
      } else if (this.start == "bottom") {
        this.direction = rand ? -$.pi / 2 + $.pi / 4 : -$.pi / 2 - $.pi / 4;
      } else {
        this.direction = rand ? $.pi / 4 : -$.pi / 4;
      }
    },
    behavior: function () {
      let speed = this.speed;
      if ($.slow) {
        speed = this.speed / $.slowEnemyDivider;
      }

      this.vx = Math.cos(this.direction) * speed;
      this.vy = Math.sin(this.direction) * speed;
    },
  },
  {
    // Enemy 2 - move directly hero
    value: 15,
    speed: 1.5,
    life: 2,
    radius: 20,
    hue: 330,
    behavior: function () {
      let speed = this.speed;
      if ($.slow) {
        speed = this.speed / $.slowEnemyDivider;
      }

      let dx = $.hero.x - this.x;
      let dy = $.hero.y - this.y;
      let direction = Math.atan2(dy, dx);
      this.vx = Math.cos(direction) * speed;
      this.vy = Math.sin(direction) * speed;
    },
  },
  {
    // Enemy 3 - splitter
    value: 20,
    speed: 0.5,
    life: 3,
    radius: 50,
    hue: 210,
    canSpawn: 1,
    behavior: function () {
      let speed = this.speed;
      if ($.slow) {
        speed = this.speed / $.slowEnemyDivider;
      }

      let dx = $.hero.x - this.x;
      let dy = $.hero.y - this.y;
      let direction = Math.atan2(dy, dx);
      this.vx = Math.cos(direction) * speed;
      this.vy = Math.sin(direction) * speed;
    },
    death: function () {
      if (this.canSpawn) {
        for (let i = 0; i < 4; i++) {
          let enemy = $.spawnEnemy(this.type);
          enemy.radius = 20;
          enemy.canSpawn = 0;
          enemy.speed = 1;
          enemy.life = 1;
          enemy.value = 5;
          enemy.x = this.x;
          enemy.y = this.y;
          if (i == 0) {
            enemy.x -= 45;
          } else if (i == 1) {
            enemy.x += 45;
          } else if (i == 2) {
            enemy.y -= 45;
          } else {
            enemy.y += 45;
          }
          $.enemies.push(enemy);
        }
      }
    },
  },
  {
    // Enemy 4 - wanderer
    value: 25,
    speed: 2,
    life: 4,
    radius: 20,
    hue: 30,
    lockBounds: 1,
    setup: function () {
      if (this.start == "top") {
        this.direction = $.pi / 2;
      } else if (this.start == "right") {
        this.direction = -$.pi;
      } else if (this.start == "bottom") {
        this.direction = -$.pi / 2;
      } else {
        this.direction = 0;
      }
    },
    behavior: function () {
      let speed = this.speed * $.util.rand(1, 2);
      if ($.slow) {
        speed = this.speed / $.slowEnemyDivider;
      }

      this.direction += $.util.rand(-0.15 * $.dt, 0.15 * $.dt);
      this.vx = Math.cos(this.direction) * speed;
      this.vy = Math.sin(this.direction) * speed;
    },
  },
  {
    // Enemy 5 - stealth, hard to see - move directly hero
    value: 30,
    speed: 1,
    life: 3,
    radius: 20,
    hue: 0,
    saturation: 0,
    lightness: 30,
    behavior: function () {
      let speed = this.speed;
      if ($.slow) {
        speed = this.speed / $.slowEnemyDivider;
      }

      let dx = $.hero.x - this.x;
      let dy = $.hero.y - this.y;
      let direction = Math.atan2(dy, dx);
      this.vx = Math.cos(direction) * speed;
      this.vy = Math.sin(direction) * speed;
    },
  },
  {
    // Enemy 6 - big strong slow fatty
    value: 35,
    speed: 0.25,
    life: 8,
    radius: 80,
    hue: 150,
    behavior: function () {
      let speed = this.speed;
      if ($.slow) {
        speed = this.speed / $.slowEnemyDivider;
      }

      let dx = $.hero.x - this.x;
      let dy = $.hero.y - this.y;
      let direction = Math.atan2(dy, dx);
      this.vx = Math.cos(direction) * speed;
      this.vy = Math.sin(direction) * speed;
    },
  },
  {
    // Enemy 7 - small weak speedy
    value: 40,
    speed: 2.5,
    life: 2,
    radius: 15,
    hue: 300,
    behavior: function () {
      let speed = this.speed;
      if ($.slow) {
        speed = this.speed / $.slowEnemyDivider;
      }

      let dx = $.hero.x - this.x;
      let dy = $.hero.y - this.y;
      let direction = Math.atan2(dy, dx);
      direction = direction + Math.cos($.tick / 50) * 1;
      this.vx = Math.cos(direction) * speed;
      this.vy = Math.sin(direction) * speed;
    },
  },
  {
    // Enemy 8 - strong grower, move to hero
    value: 45,
    speed: 1.5,
    growth: 0.1,
    life: 6,
    radius: 20,
    hue: 0,
    saturation: 0,
    lightness: 100,
    behavior: function () {
      let speed = this.speed;
      let growth = this.growth;
      if ($.slow) {
        speed = this.speed / $.slowEnemyDivider;
        growth = this.growth / $.slowEnemyDivider;
      }

      let dx = $.hero.x - this.x;
      let dy = $.hero.y - this.y;
      let direction = Math.atan2(dy, dx);

      if (Math.sqrt(dx * dx + dy * dy) > 200) {
        this.vx = Math.cos(direction) * speed;
        this.vy = Math.sin(direction) * speed;
        this.fillStyle =
          "hsla(" +
          this.hue +
          ", " +
          this.saturation +
          "%, " +
          this.lightness +
          "%, 0.1)";
        this.strokeStyle =
          "hsla(" +
          this.hue +
          ", " +
          this.saturation +
          "%, " +
          this.lightness +
          "%, 1)";
      } else {
        this.vx += $.util.rand(-0.25 * $.dt, 0.25 * $.dt);
        this.vy += $.util.rand(-0.25 * $.dt, 0.25 * $.dt);
        this.radius += growth * $.dt;
        let hue = $.util.rand(0, 360);
        let lightness = $.util.rand(50, 80);
        this.fillStyle = "hsla(" + hue + ", 100%, " + lightness + "%, 0.2)";
        this.strokeStyle = "hsla(" + hue + ", 100%, " + lightness + "%, 1)";
      }
    },
  },
  {
    // Enemy 9 - circle around hero
    value: 50,
    speed: 0.5,
    angleSpeed: 0.015,
    life: 3,
    radius: 20,
    hue: 60,
    setup: function () {
      let dx = this.x - $.hero.x;
      let dy = this.y - $.hero.y;
      this.angle = Math.atan2(dy, dx);
      this.distance = Math.sqrt(dx * dx + dy * dy);
      if (Math.random() > 0.5) {
        this.angleSpeed = -this.angleSpeed;
      }
    },
    behavior: function () {
      let speed = this.speed;
      let angleSpeed = this.angleSpeed;
      if ($.slow) {
        speed = this.speed / $.slowEnemyDivider;
        angleSpeed = this.angleSpeed / $.slowEnemyDivider;
      }

      this.distance -= speed * $.dt;
      this.angle += angleSpeed * $.dt;

      this.vx = ($.hero.x + Math.cos(this.angle) * this.distance - this.x) / 50;
      this.vy = ($.hero.y + Math.sin(this.angle) * this.distance - this.y) / 50;
    },
  },
  {
    // Enemy 10 - spawner
    value: 55,
    speed: 1,
    life: 4,
    radius: 45,
    hue: 0,
    canSpawn: 1,
    spawnTick: 0,
    spawnTickMax: 250,
    behavior: function () {
      let speed = this.speed;
      if ($.slow) {
        speed = this.speed / $.slowEnemyDivider;
      }

      let dx = $.hero.x - this.x;
      let dy = $.hero.y - this.y;
      let direction = Math.atan2(dy, dx);
      direction = direction + Math.cos($.tick / 50) * 1;
      this.vx = Math.cos(direction) * speed;
      this.vy = Math.sin(direction) * speed;

      if (this.canSpawn) {
        if (this.spawnTick < this.spawnTickMax) {
          this.spawnTick += $.dt;
        } else {
          this.spawnTick = this.spawnTick - this.spawnTickMax + $.dt;
          let enemy = $.spawnEnemy(this.type);
          enemy.radius = 20;
          enemy.canSpawn = 0;
          enemy.speed = 3;
          enemy.life = 1;
          enemy.value = 30;
          enemy.x = this.x;
          enemy.y = this.y;
          $.enemies.push(enemy);
        }
      }
    },
  },
  {
    // Enemy 11 - random location strong tower
    value: 60,
    speed: 1.5,
    life: 10,
    radius: 30,
    hue: 90,
    setup: function () {
      this.xTarget = $.util.rand(50, $.ww - 50);
      this.yTarget = $.util.rand(50, $.wh - 50);
    },
    behavior: function () {
      let speed = this.speed;
      if ($.slow) {
        speed = this.speed / $.slowEnemyDivider;
      }
      let dx = this.xTarget - this.x;
      let dy = this.yTarget - this.y;
      let direction = Math.atan2(dy, dx);
      if (Math.sqrt(dx * dx + dy * dy) > this.speed) {
        this.vx = Math.cos(direction) * speed;
        this.vy = Math.sin(direction) * speed;
      } else {
        this.vx = 0;
        this.vy = 0;
      }
    },
  },
  {
    // Enemy 12 - speedy random direction, no homing
    value: 65,
    speed: 6,
    life: 2,
    radius: 5,
    hue: 0,
    lockBounds: 1,
    setup: function () {
      this.radius = $.util.rand(15, 35);
      this.speed = $.util.rand(3, 8);
      if (Math.random() > 0.5) {
        if (this.start == "top") {
          this.direction = $.pi / 2;
        } else if (this.start == "right") {
          this.direction = -$.pi;
        } else if (this.start == "bottom") {
          this.direction = -$.pi / 2;
        } else {
          this.direction = 0;
        }
      } else {
        let rand = Math.floor($.util.rand(0, 2));
        if (this.start == "top") {
          this.direction = rand ? $.pi / 2 + $.pi / 4 : $.pi / 2 - $.pi / 4;
        } else if (this.start == "right") {
          this.direction = rand ? -$.pi + $.pi / 4 : -$.pi - $.pi / 4;
        } else if (this.start == "bottom") {
          this.direction = rand ? -$.pi / 2 + $.pi / 4 : -$.pi / 2 - $.pi / 4;
        } else {
          this.direction = rand ? $.pi / 4 : -$.pi / 4;
        }
      }
    },
    behavior: function () {
      let speed = this.speed;
      if ($.slow) {
        speed = this.speed / $.slowEnemyDivider;
      }
      this.vx = Math.cos(this.direction) * speed;
      this.vy = Math.sin(this.direction) * speed;
      this.hue += 10;
      this.lightness = 50;
      this.fillStyle =
        "hsla(" + this.hue + ", 100%, " + this.lightness + "%, 0.2)";
      this.strokeStyle =
        "hsla(" + this.hue + ", 100%, " + this.lightness + "%, 1)";
    },
  },
  {
    // Boss - Chefão
    value: 8000, // pontos ao morrer
    speed: 1.2, // mais rápido
    life: 430, // vida inicial
    radius: 90,
    hue: 320, // rosa neon
    saturation: 100,
    lightness: 60,
    isBoss: true,
    bossLevel: 1, // aumenta a cada aparição
    setup: function () {
      this.shotsTaken = 0;
      this.bossAttack1000 = false;
      this.bossAttack1420 = false;
      this.bossAttackTimer = 0;
      this.bossBombTimer = 0;
      this.bossSmartness = 1 + (this.bossLevel-1)*0.2;
      this.bossLifeMax = this.life;
    },
    behavior: function () {
      // Boss persegue o player, mas fica mais "esperto" a cada aparição
      let dx = $.hero.x - this.x;
      let dy = $.hero.y - this.y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      let direction = Math.atan2(dy, dx);
      let speed = this.speed * this.bossSmartness * 1.15; // mais agressivo
      if (dist > 100) {
        this.vx = Math.cos(direction) * speed;
        this.vy = Math.sin(direction) * speed;
      } else {
        this.vx = 0;
        this.vy = 0;
      }
      // Dispara projéteis no player constantemente
      this.bossProjectileTick = (this.bossProjectileTick || 0) + 1;
      if (this.bossProjectileTick % 30 === 0) { // a cada meio segundo
        $.enemyProjectiles = $.enemyProjectiles || [];
        $.enemyProjectiles.push({
          x: this.x,
          y: this.y,
          direction: Math.atan2($.hero.y - this.y, $.hero.x - this.x),
          speed: 14 + Math.random()*3,
          color: '#ff33cc',
          damage: 0.18, // 18% da vida
        });
      }
      // Ataque especial ao levar 1000 disparos
      if (this.shotsTaken >= 120 && !this.bossAttack1000) {
        this.bossAttack1000 = true;
        this.bossAttackTimer = 0;
      }
      if (this.bossAttack1000 && this.bossAttackTimer < 60) {
        this.bossAttackTimer++;
        if (this.bossAttackTimer % 6 === 0) { // mais frequente
          $.enemyProjectiles = $.enemyProjectiles || [];
          $.enemyProjectiles.push({
            x: this.x,
            y: this.y,
            direction: Math.atan2($.hero.y - this.y, $.hero.x - this.x),
            speed: 16 + Math.random()*4,
            color: '#ff33cc',
            damage: 0.3,
          });
        }
      }
      // Ataque especial ao levar a quantidade mínima de disparos
      if (this.shotsTaken >= 159) {
        this.bossAttack1420 = true;
        // Sempre atacar enquanto vivo
        this.bossBombTimer = (this.bossBombTimer || 0) + 1;
        if (this.bossBombTimer % 12 === 0) {
          // Solta bomba ao redor do player
          let angle = Math.random() * Math.PI * 2;
          let dist = 60 + Math.random() * 60;
          $.bombs = $.bombs || [];
          let isSmart = (this.bossBombTimer % (12*30) === 0); // 1 a cada 19 bombas
          $.bombs.push({
            x: $.hero.x + Math.cos(angle) * dist,
            y: $.hero.y + Math.sin(angle) * dist,
            timer: isSmart ? 8 : 2,
            radius: 30,
            exploded: false,
            bossBomb: true,
            smartBomb: isSmart,
            color: isSmart ? '#0f0' : undefined // verde para bomba inteligente
          });
        }
      }
    },
    death: function () {
      // Ao morrer, aumenta dificuldade do próximo boss
      this.bossLevel++;
      this.life = 2010 + this.bossLevel * 2000;
      this.bossSmartness = 1 + (this.bossLevel-1)*0.2;
    }
  },
  {
    // Boss Ttovos
    value: 9970, // pontos ao morrer
    speed: 1.7,
    life: 500,
    radius: 100,
    hue: 0, // cor mutante
    saturation: 100,
    lightness: 60,
    isBoss: true,
    isTtovos: true,
    bossLevel: 1,
    setup: function () {
      this.shotsTaken = 0;
      this.colorTick = 0;
      this.mineTimer = 0;
      this.bombTimer = 0;
      this.smartBombTimer = 0;
      this.explosiveShotTimer = 0;
      this.bossLifeMax = this.life;
      this.teleportCount = 0;
      this.teleportCooldown = 0;
    },
    behavior: function () {
      // Cor mutante
      this.colorTick = (this.colorTick || 0) + 1;
      this.hue = (this.colorTick * 2) % 360;
      this.fillStyle = 'hsl(' + this.hue + ',100%,60%)';
      this.strokeStyle = 'hsl(' + ((this.hue+60)%360) + ',100%,80%)';
      // Animação própria: pulsar
      this.radius = 100 + Math.sin($.tick * 0.2) * 10;
      // Movimento: persegue o player
      let dx = $.hero.x - this.x;
      let dy = $.hero.y - this.y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      let direction = Math.atan2(dy, dx);
      let speed = this.speed * 1.2;
      if (dist > 120) {
        this.vx = Math.cos(direction) * speed;
        this.vy = Math.sin(direction) * speed;
      } else {
        this.vx = 0;
        this.vy = 0;
      }
      // Bombas normais
      this.bombTimer = (this.bombTimer || 0) + 1;
      if (this.bombTimer % 40 === 0) {
        let angle = Math.random() * Math.PI * 2;
        let dist = 80 + Math.random() * 80;
        $.bombs = $.bombs || [];
        $.bombs.push({
          x: $.hero.x + Math.cos(angle) * dist,
          y: $.hero.y + Math.sin(angle) * dist,
          timer: 2,
          radius: 40,
          exploded: false,
          bossBomb: true,
          color: '#f0f',
        });
      }
      // Bombas inteligentes
      this.smartBombTimer = (this.smartBombTimer || 0) + 1;
      if (this.smartBombTimer % 120 === 0) {
        let angle = Math.random() * Math.PI * 2;
        let dist = 100 + Math.random() * 60;
        $.bombs = $.bombs || [];
        $.bombs.push({
          x: $.hero.x + Math.cos(angle) * dist,
          y: $.hero.y + Math.sin(angle) * dist,
          timer: 6,
          radius: 27,
          exploded: false,
          bossBomb: true,
          smartBomb: true,
          color: '#0f0',
        });
      }
      // Bombas minas (41% de chance)
      this.mineTimer = (this.mineTimer || 0) + 1;
      if (this.mineTimer % 60 === 0 && Math.random() < 0.61) {
        let angle = Math.random() * Math.PI * 2;
        let dist = 120 + Math.random() * 100;
        $.bombs = $.bombs || [];
        $.bombs.push({
          x: $.hero.x + Math.cos(angle) * dist,
          y: $.hero.y + Math.sin(angle) * dist,
          timer: 7,
          radius: 24,
          exploded: false,
          bossBomb: true,
          mineBomb: true,
          color: '#09f', // azul sólida
        });
      }
      // Disparos explosivos (corrigido para garantir execução)
      this.explosiveShotTimer = (this.explosiveShotTimer || 0) + 1;
      if (this.explosiveShotTimer % 30 === 0) {
        $.enemyProjectiles = $.enemyProjectiles || [];
        $.enemyProjectiles.push({
          x: this.x,
          y: this.y,
          direction: Math.atan2($.hero.y - this.y, $.hero.x - this.x),
          speed: 18 + Math.random()*4,
          color: '#ff6600',
          damage: 0.22,
          explosive: true,
          explosiveRadius: 10,
        });
      }
      // Atualizar cooldown de teleporte
      this.teleportCooldown = (this.teleportCooldown || 0) - ($.dt / 60);
      if (this.teleportCooldown < 0) this.teleportCooldown = 0;
      if (this.teleportCooldown === 0) this.teleportCount = 0;
      // Habilidade de teleporte com 8% de chance, até 3 vezes por minuto
      if (this.teleportCount < 3 && Math.random() < 0.08) {
        // Teleporta para posição aleatória próxima do player
        let angle = Math.random() * Math.PI * 2;
        let dist = 120 + Math.random() * 120;
        this.x = $.hero.x + Math.cos(angle) * dist;
        this.y = $.hero.y + Math.sin(angle) * dist;
        this.teleportCount++;
        this.teleportCooldown = 20; // 20 ciclos (aprox 1/3 de minuto, ajusta se necessário)
      }
    },
    death: function () {
      // Ao morrer, pode dar recompensa especial
      $.hero.specials.healCount = Math.min($.hero.specials.healCount + 4, 4);
    }
  },
];

/*==============================================================================
Levels
==============================================================================*/
$.definitions.levels = [];
let base = 20;
for (let i = 0; i < $.definitions.enemies.length; i++) {
  let distribution = [];
  for (let di = 0; di < i + 1; di++) {
    let value = di == i ? Math.floor((i + 1) * base * 0.75) : (i + 1) * base;
    value = i == 0 ? base : value;
    distribution.push({
      time: value,
      lastSpawn: Date.now(),
    });
  }
  $.definitions.levels.push({
    killsToLevel: 5 + (i + 1) * 7,
    distribution: distribution,
  });
}

/*==============================================================================
Powerups
==============================================================================*/
$.definitions.powerups = [
  {
    title: "HEALTH PACK",
    hue: 60,
    saturation: 100,
    lightness: 60,
  },
  {
    title: "SLOW ENEMIES",
    hue: 170,
    saturation: 100,
    lightness: 60,
  },
  {
    title: "FAST SHOT",
    hue: 120,
    saturation: 100,
    lightness: 60,
  },
  {
    title: "TRIPLE SHOT",
    hue: 210,
    saturation: 100,
    lightness: 60,
  },
  {
    title: "PIERCE SHOT",
    hue: 0,
    saturation: 100,
    lightness: 60,
  },
];

/*==============================================================================
Letters
==============================================================================*/
// prettier-ignore
$.definitions.letters = {
  '1': [
     [  , ,  1,  , 0 ],
     [  , 1, 1,  , 0 ],
     [  ,  , 1,  , 0 ],
     [  ,  , 1,  , 0 ],
     [ 1, 1, 1, 1, 1 ]
     ],
  '2': [
     [ 1, 1, 1, 1, 0 ],
     [  ,  ,  ,  , 1 ],
     [  , 1, 1, 1, 0 ],
     [ 1,  ,  ,  , 0 ],
     [ 1, 1, 1, 1, 1 ]
     ],
  '3': [
     [ 1, 1, 1, 1, 0 ],
     [  ,  ,  ,  , 1 ],
     [  , 1, 1, 1, 1 ],
     [  ,  ,  ,  , 1 ],
     [ 1, 1, 1, 1, 0 ]
     ],
  '4': [
     [ 1,  ,  , 1, 0 ],
     [ 1,  ,  , 1, 0 ],
     [ 1, 1, 1, 1, 1 ],
     [  ,  ,  , 1, 0 ],
     [  ,  ,  , 1, 0 ]
     ],
  '5': [
     [ 1, 1, 1, 1, 1 ],
     [ 1,  ,  ,  , 0 ],
     [ 1, 1, 1, 1, 0 ],
     [  ,  ,  ,  , 1 ],
     [ 1, 1, 1, 1, 0 ]
     ],
  '6': [
     [  , 1, 1, 1, 0 ],
     [ 1,  ,  ,  , 0 ],
     [ 1, 1, 1, 1, 0 ],
     [ 1,  ,  ,  , 1 ],
     [  , 1, 1, 1, 0 ]
     ],
  '7': [
     [ 1, 1, 1, 1, 1 ],
     [  ,  ,  ,  , 1 ],
     [  ,  ,  , 1, 0 ],
     [  ,  , 1,  , 0 ],
     [  ,  , 1,  , 0 ]
     ],
  '8': [
     [  , 1, 1, 1, 0 ],
     [ 1,  ,  ,  , 1 ],
     [  , 1, 1, 1, 0 ],
     [ 1,  ,  ,  , 1 ],
     [  , 1, 1, 1, 0 ]
     ],
  '9': [
     [  , 1, 1, 1, 0 ],
     [ 1,  ,  ,  , 1 ],
     [  , 1, 1, 1, 1 ],
     [  ,  ,  ,  , 1 ],
     [  , 1, 1, 1, 0 ]
     ],
  '0': [
     [  , 1, 1, 1, 0 ],
     [ 1,  ,  ,  , 1 ],
     [ 1,  ,  ,  , 1 ],
     [ 1,  ,  ,  , 1 ],
     [  , 1, 1, 1, 0 ]
     ],
  'A': [
     [ 1, 1, 1, 1, 1 ],
     [ 1,  ,  ,  , 1 ],
     [ 1, 1, 1, 1, 1 ],
     [ 1,  ,  ,  , 1 ],
     [ 1,  ,  ,  , 1 ]
     ],
  'B': [
     [ 1, 1, 1, 1, 0 ],
     [ 1,  ,  , 1, 0 ],
     [ 1, 1, 1, 1, 1 ],
     [ 1,  ,  ,  , 1 ],
     [ 1, 1, 1, 1, 1 ]
     ],
  'C': [
     [ 1, 1, 1, 1, 1 ],
     [ 1,  ,  ,  , 0 ],
     [ 1,  ,  ,  , 0 ],
     [ 1,  ,  ,  , 0 ],
     [ 1, 1, 1, 1, 1 ]
     ],
  'D': [
     [ 1, 1, 1,  , 0 ],
     [ 1,  ,  , 1, 0 ],
     [ 1,  ,  ,  , 1 ],
     [ 1,  ,  ,  , 1 ],
     [ 1, 1, 1, 1, 1 ]
     ],
  'E': [
     [ 1, 1, 1, 1, 1 ],
     [ 1,  ,  ,  , 0 ],
     [ 1, 1, 1,  , 0 ],
     [ 1,  ,  ,  , 0 ],
     [ 1, 1, 1, 1, 1 ]
     ],
  'F': [
     [ 1, 1, 1, 1, 1 ],
     [ 1,  ,  ,  , 0 ],
     [ 1, 1, 1,  , 0 ],
     [ 1,  ,  ,  , 0 ],
     [ 1,  ,  ,  , 0 ]
     ],
  'G': [
     [ 1, 1, 1, 1, 1 ],
     [ 1,  ,  ,  , 0 ],
     [ 1,  , 1, 1, 1 ],
     [ 1,  ,  ,  , 1 ],
     [ 1, 1, 1, 1, 1 ]
     ],
  'H': [
     [ 1,  ,  ,  , 1 ],
     [ 1,  ,  ,  , 1 ],
     [ 1, 1, 1, 1, 1 ],
     [ 1,  ,  ,  , 1 ],
     [ 1,  ,  ,  , 1 ]
     ],
  'I': [
     [ 1, 1, 1, 1, 1 ],
     [  ,  , 1,  , 0 ],
     [  ,  , 1,  , 0 ],
     [  ,  , 1,  , 0 ],
     [ 1, 1, 1, 1, 1 ]
     ],
  'J': [
     [  ,  ,  ,  , 1 ],
     [  ,  ,  ,  , 1 ],
     [  ,  ,  ,  , 1 ],
     [ 1,  ,  ,  , 1 ],
     [ 1, 1, 1, 1, 1 ]
     ],
  'K': [
     [ 1,  ,  , 1, 0 ],
     [ 1,  , 1,  , 0 ],
     [ 1, 1, 1,  , 0 ],
     [ 1,  ,  , 1, 0 ],
     [ 1,  ,  ,  , 1 ]
     ],
  'L': [
     [ 1,  ,  ,  , 0 ],
     [ 1,  ,  ,  , 0 ],
     [ 1,  ,  ,  , 0 ],
     [ 1,  ,  ,  , 0 ],
     [ 1, 1, 1, 1, 1 ]
     ],
  'M': [
     [ 1,  ,  ,  , 1 ],
     [ 1, 1,  , 1, 1 ],
     [ 1,  , 1,  , 1 ],
     [ 1,  ,  ,  , 1 ],
     [ 1,  ,  ,  , 1 ]
     ],
  'N': [
     [ 1,  ,  ,  , 1 ],
     [ 1, 1,  ,  , 1 ],
     [ 1,  , 1,  , 1 ],
     [ 1,  ,  , 1, 1 ],
     [ 1,  ,  ,  , 1 ]
     ],
  'O': [
     [ 1, 1, 1, 1, 1 ],
     [ 1,  ,  ,  , 1 ],
     [ 1,  ,  ,  , 1 ],
     [ 1,  ,  ,  , 1 ],
     [ 1, 1, 1, 1, 1 ]
     ],
  'P': [
     [ 1, 1, 1, 1, 1 ],
     [ 1,  ,  ,  , 1 ],
     [ 1, 1, 1, 1, 1 ],
     [ 1,  ,  ,  , 0 ],
     [ 1,  ,  ,  , 0 ]
     ],
  'Q': [
     [ 1, 1, 1, 1, 0 ],
     [ 1,  ,  , 1, 0 ],
     [ 1,  ,  , 1, 0 ],
     [ 1,  ,  , 1, 0 ],
     [ 1, 1, 1, 1, 1 ]
     ],
  'R': [
     [ 1, 1, 1, 1, 1 ],
     [ 1,  ,  ,  , 1 ],
     [ 1, 1, 1, 1, 1 ],
     [ 1,  ,  , 1, 0 ],
     [ 1,  ,  ,  , 1 ]
     ],
  'S': [
     [ 1, 1, 1, 1, 1 ],
     [ 1,  ,  ,  , 0 ],
     [ 1, 1, 1, 1, 1 ],
     [  ,  ,  ,  , 1 ],
     [ 1, 1, 1, 1, 1 ]
     ],
  'T': [
     [ 1, 1, 1, 1, 1 ],
     [  ,  , 1,  , 0 ],
     [  ,  , 1,  , 0 ],
     [  ,  , 1,  , 0 ],
     [  ,  , 1,  , 0 ]
     ],
  'U': [
     [ 1,  ,  ,  , 1 ],
     [ 1,  ,  ,  , 1 ],
     [ 1,  ,  ,  , 1 ],
     [ 1,  ,  ,  , 1 ],
     [ 1, 1, 1, 1, 1 ]
     ],
  'V': [
     [ 1,  ,  ,  , 1 ],
     [ 1,  ,  ,  , 1 ],
     [ 1,  ,  ,  , 1 ],
     [  , 1,  , 1, 0 ],
     [  ,  , 1,  , 0 ]
     ],
  'W': [
     [ 1,  ,  ,  , 1 ],
     [ 1,  ,  ,  , 1 ],
     [ 1,  , 1,  , 1 ],
     [ 1, 1,  , 1, 1 ],
     [ 1,  ,  ,  , 1 ]
     ],
  'X': [
     [ 1,  ,  ,  , 1 ],
     [  , 1,  , 1, 0 ],
     [  ,  , 1,  , 0 ],
     [  , 1,  , 1, 0 ],
     [ 1,  ,  ,  , 1 ]
     ],
  'Y': [
     [ 1,  ,  ,  , 1 ],
     [ 1,  ,  ,  , 1 ],
     [ 1, 1, 1, 1, 1 ],
     [  ,  , 1,  , 0 ],
     [  ,  , 1,  , 0 ]
     ],
  'Z': [
     [ 1, 1, 1, 1, 1 ],
     [  ,  ,  , 1, 0 ],
     [  ,  , 1,  , 0 ],
     [  , 1,  ,  , 0 ],
     [ 1, 1, 1, 1, 1 ]
     ],
  ' ': [
     [  ,  ,  ,  , 0 ],
     [  ,  ,  ,  , 0 ],
     [  ,  ,  ,  , 0 ],
     [  ,  ,  ,  , 0 ],
     [  ,  ,  ,  , 0 ]
     ],
  ',': [
     [  ,  ,  ,  , 0 ],
     [  ,  ,  ,  , 0 ],
     [  ,  ,  ,  , 0 ],
     [  ,  , 1,  , 0 ],
     [  ,  , 1,  , 0 ]
     ],
  '+': [
     [  ,  ,  ,  , 0 ],
     [  ,  , 1,  , 0 ],
     [  , 1, 1, 1, 0 ],
     [  ,  , 1,  , 0 ],
     [  ,  ,  ,  , 0 ]
     ],
  '/': [
     [  ,  ,  ,  , 1 ],
     [  ,  ,  , 1, 0 ],
     [  ,  , 1,  , 0 ],
     [  , 1,  ,  , 0 ],
     [ 1,  ,  ,  , 0 ]
     ],
  ':': [
     [  ,  ,  ,  , 0 ],
     [  ,  , 1,  , 0 ],
     [  ,  ,  ,  , 0 ],
     [  ,  , 1,  , 0 ],
     [  ,  ,  ,  , 0 ]
     ],
  '@': [
     [  1, 1, 1, 1, 1 ],
     [   ,  ,  ,  , 1 ],
     [  1, 1, 1,  , 1 ],
     [  1,  , 1,  , 1 ],
     [  1, 1, 1, 1, 1 ]
  ],
  '{': [
     [ 1, 1, 1, 1, 1 ],
     [  , 1, 1, 1, 1 ],
     [  ,  , 1, 1, 1 ],
     [  ,  ,  , 1, 1 ],
     [  ,  ,  ,  , 1 ]
     ],
  '}': [
     [  1, 1, 1, 1, 1 ],
     [  1, 1, 1, 1, 0 ],
     [  1, 1, 1,  , 0 ],
     [  1, 1,  ,  , 0 ],
     [  1,  ,  ,  , 0 ]
  ]
};
