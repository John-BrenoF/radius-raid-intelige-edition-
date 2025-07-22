/*==============================================================================
Init
==============================================================================*/
$.Hero = function () {
  this.x = $.ww / 2;
  this.y = $.wh / 2;
  this.vx = 0;
  this.vy = 0;
  this.vmax = 4;
  this.vmax = 6;
  this.direction = 0;
  this.accel = 0.75;
  this.radius = 10;
  this.life = 1;
  this.particleEmitterTickMax = 1;
  this.particleEmitterTick = this.particleEmitterTickMax;
  this.particleEmitterSpeedTickMax = 1;
  this.particleEmitterSpeedTick = this.particleEmitterSpeedTickMax;
  this.takingDamage = 0;
  this.takingDamageAudioTickMax = 8;
  this.takingDamageAudioTick = this.takingDamageAudioTickMax;
  this.fillStyle = "#fff";
  this.weapon = {
    fireRateTickMax: 5,
    fireRateTick: 5,
    spread: 0.3,
    count: 1,
    bullet: {
      size: 15,
      lineWidth: 2,
      damage: 1,
      speed: 10,
      piercing: 0,
      color: {
        hue: 0,
        saturation: 0,
        lightness: 100,
        value: "hsl(0, 0%, 100%)",
      },
    },
    fireFlag: 0,
  };
  this.specials = {
    homingUnlocked: false,
    dualUnlocked: false,
    explosiveUnlocked: false,
    explosiveActive: false,
    explosiveTimer: 0,
    explosiveCooldown: 0,
    shotCounter: 0,
    dualCounter: 0, // para controlar disparo duplo
    shootNearestCooldown: 0, // cooldown do disparo especial
    bombCount: 5, // bombas disponíveis
    bombCooldown: 0, // cooldown global das bombas
    bombUsed: 0, // bombas usadas no ciclo
    shieldCount: 0, // escudos disponíveis
    shieldCooldown: 0, // cooldown para ganhar novo escudo
    shieldActive: false, // escudo está ativo
    shieldTimer: 0, // tempo restante do escudo ativo
    healCount: 4, // curas disponíveis por partida
  };
};

/*==============================================================================
Update
==============================================================================*/
$.Hero.prototype.update = function () {
  if (this.life <= 0) {
    return;
  }

  // HABILIDADES ESPECIAIS
  // Desbloqueio
  if (!this.specials.homingUnlocked && $.kills >= 80) {
    this.specials.homingUnlocked = true;
  }
  if (!this.specials.dualUnlocked && $.kills >= 110) {
    this.specials.dualUnlocked = true;
  }
  if (!this.specials.explosiveUnlocked && $.level.current + 1 >= 20) {
    this.specials.explosiveUnlocked = true;
  }
  // Controle do modo explosivo (mais nerf: 3s a cada 30s)
  if (this.specials.explosiveUnlocked) {
    if (this.specials.explosiveActive) {
      this.specials.explosiveTimer -= $.dt / 60;
      if (this.specials.explosiveTimer <= 0) {
        this.specials.explosiveActive = false;
        this.specials.explosiveCooldown = 30;
      }
    } else {
      this.specials.explosiveCooldown -= $.dt / 60;
      if (this.specials.explosiveCooldown <= 0) {
        this.specials.explosiveActive = true;
        this.specials.explosiveTimer = 3;
      }
    }
    if (this.specials.explosiveCooldown < 0) this.specials.explosiveCooldown = 0;
    if (this.specials.explosiveTimer < 0) this.specials.explosiveTimer = 0;
  }

  /*==============================================================================
  Movimento automático para o mouse
  ==============================================================================*/
  let dx = $.mouse.x - this.x;
  let dy = $.mouse.y - this.y;
  let dist = Math.sqrt(dx * dx + dy * dy);
  let angle = Math.atan2(dy, dx);
  let stopRadius = this.radius * 0.8 + 2; // raio para parar próximo do mouse

  if (dist > stopRadius) {
    // acelera em direção ao mouse
    this.vx += Math.cos(angle) * this.accel * $.dt;
    this.vy += Math.sin(angle) * this.accel * $.dt;
    // limita a velocidade máxima
    let v = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (v > this.vmax) {
      this.vx = (this.vx / v) * this.vmax;
      this.vy = (this.vy / v) * this.vmax;
    }
  } else {
    // desacelera até parar
    this.vx += (0 - this.vx) * (1 - Math.exp(-0.2 * $.dt));
    this.vy += (0 - this.vy) * (1 - Math.exp(-0.2 * $.dt));
    // se estiver bem devagar, zera
    if (Math.abs(this.vx) < 0.05) this.vx = 0;
    if (Math.abs(this.vy) < 0.05) this.vy = 0;
  }

  this.x += this.vx * $.dt;
  this.y += this.vy * $.dt;

  /*==============================================================================
  Lock Bounds
  ==============================================================================*/
  let buffer = 5;
  if (this.x >= $.ww - this.radius - $.edgeSize - buffer) {
    this.x = $.ww - this.radius - $.edgeSize - buffer;
    this.vx = 0;
  }
  if (this.x <= this.radius + $.edgeSize + buffer) {
    this.x = this.radius + $.edgeSize + buffer;
    this.vx = 0;
  }
  if (this.y >= $.wh - this.radius - $.edgeSize - buffer) {
    this.y = $.wh - this.radius - $.edgeSize - buffer;
    this.vy = 0;
  }
  if (this.y <= this.radius + $.edgeSize + buffer) {
    this.y = this.radius + $.edgeSize + buffer;
    this.vy = 0;
  }

  /*==============================================================================
  Update Direction
  ==============================================================================*/
  this.direction = angle;
  if ($.mouse.down) {
    this.vx += (0 - this.vx) * (1 - Math.exp(-0.15 * $.dt));
    this.vy += (0 - this.vy) * (1 - Math.exp(-0.15 * $.dt));
  }

  if (this.particleEmitterSpeedTick < this.particleEmitterSpeedTickMax) {
    this.particleEmitterSpeedTick += $.dt;
  }

  if (!$.mouse.down && (Math.abs(this.vx) > 1 || Math.abs(this.vy) > 1)) {
    let dir = Math.atan2(this.vy, this.vx) + $.pi;
    let max = Math.max(Math.abs(this.vx), Math.abs(this.vy));
    if (this.particleEmitterSpeedTick >= this.particleEmitterSpeedTickMax) {
      this.particleEmitterSpeedTick = 0;
      $.particleEmitters.push(
        new $.ParticleEmitter({
          x: this.x + Math.cos(dir) * this.radius * 2,
          y: this.y + Math.sin(dir) * this.radius * 2,
          count: 2,
          spawnRange: this.radius * 1.25,
          friction: 0.7,
          minSpeed: max * 1,
          maxSpeed: max * 2,
          minDirection: dir - 0.1,
          maxDirection: dir + 0.1,
          hue: 0,
          saturation: 0,
        })
      );
    }
  }

  /*==============================================================================
  Fire Weapon
  ==============================================================================*/
  if (this.weapon.fireRateTick < this.weapon.fireRateTickMax) {
    this.weapon.fireRateTick += $.dt;
  } else {
    if ($.mouse.down) {
      if ($.powerupTimers[2] > 0) {
        $.audio.play("shoot").rate(1 + Math.sin($.tick * 0.4) * 0.3);
      } else {
        $.audio.play("shoot").rate(1 + Math.sin($.tick * 0.2) * 0.3);
      }

      if (
        $.powerupTimers[2] > 0 ||
        $.powerupTimers[3] > 0 ||
        $.powerupTimers[4] > 0
      ) {
        if ($.powerupTimers[2] > 0) {
          $.audio.play("shootAlt").rate(1 + Math.sin($.tick * 0.2) * 0.3);
        } else {
          $.audio.play("shootAlt").rate(1 + Math.sin($.tick * 0.1) * 0.3);
        }
      }

      this.weapon.fireRateTick =
        this.weapon.fireRateTick - this.weapon.fireRateTickMax + $.dt;

      this.weapon.fireFlag = 6;

      let spreadStart = 0;
      let spreadStep = 0;

      if (this.weapon.count > 1) {
        spreadStart = -this.weapon.spread / 2;
        spreadStep = this.weapon.spread / (this.weapon.count - 1);
      }

      let gunX = this.x + Math.cos(this.direction) * this.radius;
      let gunY = this.y + Math.sin(this.direction) * this.radius;

      // --- CONTROLE DE TIROS ESPECIAIS ---
      // Mais nerf dual: só dispara duplo a cada 5 disparos
      let totalShots = 1;
      let isDual = false;
      if (this.specials.dualUnlocked) {
        if (this.specials.dualCounter === 0) {
          totalShots = 2;
          isDual = true;
        }
        this.specials.dualCounter = (this.specials.dualCounter + 1) % 5;
      }
      for (let shot = 0; shot < totalShots; shot++) {
        let baseDir = this.direction + (shot === 1 ? Math.PI : 0);
      for (let i = 0; i < this.weapon.count; i++) {
        $.bulletsFired++;
        let color = this.weapon.bullet.color;
        if (
          $.powerupTimers[2] > 0 ||
          $.powerupTimers[3] > 0 ||
          $.powerupTimers[4] > 0
        ) {
          let colors = [];
          if ($.powerupTimers[2] > 0) {
            colors.push({
              hue: $.definitions.powerups[2].hue,
              saturation: $.definitions.powerups[2].saturation,
              lightness: $.definitions.powerups[2].lightness,
              value:
                "hsl(" +
                $.definitions.powerups[2].hue +
                ", " +
                $.definitions.powerups[2].saturation +
                "%, " +
                $.definitions.powerups[2].lightness +
                "%)",
            });
          }
          if ($.powerupTimers[3] > 0) {
            colors.push({
              hue: $.definitions.powerups[3].hue,
              saturation: $.definitions.powerups[3].saturation,
              lightness: $.definitions.powerups[3].lightness,
              value:
                "hsl(" +
                $.definitions.powerups[3].hue +
                ", " +
                $.definitions.powerups[3].saturation +
                "%, " +
                $.definitions.powerups[3].lightness +
                "%)",
            });
          }
          if ($.powerupTimers[4] > 0) {
            colors.push({
              hue: $.definitions.powerups[4].hue,
              saturation: $.definitions.powerups[4].saturation,
              lightness: $.definitions.powerups[4].lightness,
              value:
                "hsl(" +
                $.definitions.powerups[4].hue +
                ", " +
                $.definitions.powerups[4].saturation +
                "%, " +
                $.definitions.powerups[4].lightness +
                "%)",
            });
          }
          color = colors[Math.floor($.util.rand(0, colors.length))];
        }
          // --- LÓGICA DE TIRO INTELIGENTE (mais nerf: só 1 de 20) ---
          let isHoming = false;
          let homingStrength = 0.04;
          if (this.specials.homingUnlocked) {
            this.specials.shotCounter = (this.specials.shotCounter + 1) % 20;
            if (this.specials.shotCounter < 1) isHoming = true;
          }
          // --- LÓGICA DE TIRO EXPLOSIVO (mais nerf: flag e raio menor) ---
          let isExplosive = this.specials.explosiveActive;
          let explosiveRadius = 14; // ainda menor
          // --- Mais nerf dual: tiro extra tem dano reduzido para 50% ---
          let bulletDamage = this.weapon.bullet.damage;
          if (isDual && shot === 1) bulletDamage *= 0.5;
        $.bullets.push(
          new $.Bullet({
            x: gunX,
            y: gunY,
            speed: this.weapon.bullet.speed,
              direction: baseDir + spreadStart + i * spreadStep,
              damage: bulletDamage,
            size: this.weapon.bullet.size,
            lineWidth: this.weapon.bullet.lineWidth,
            strokeStyle: color.value,
            hue: color.hue,
            saturation: color.saturation,
            lightness: color.lightness,
            piercing: this.weapon.bullet.piercing,
              isHoming: isHoming,
              isExplosive: isExplosive,
              homingStrength: homingStrength,
              explosiveRadius: explosiveRadius,
          })
        );
        }
      }
    }
  }

  /*==============================================================================
  Check Collisions
  ==============================================================================*/
  this.takingDamage = 0;
  let ei = $.enemies.length;
  while (ei--) {
    let enemy = $.enemies[ei];
    if (
      enemy.inView &&
      $.util.distance(this.x, this.y, enemy.x, enemy.y) <=
        this.radius + enemy.radius
    ) {
      if (!this.specials.shieldActive) {
      this.takingDamage = 1;
      }
      break;
    }
  }

  if (this.particleEmitterTick < this.particleEmitterTickMax) {
    this.particleEmitterTick += $.dt;
  }

  if (this.takingDamageAudioTick < this.takingDamageAudioTickMax) {
    this.takingDamageAudioTick += $.dt;
  }

  if (this.takingDamage) {
    $.rumble.level = 4;

    this.life -= 0.0075 * $.dt;

    if (this.particleEmitterTick >= this.particleEmitterTickMax) {
      this.particleEmitterTick = 0;

      $.particleEmitters.push(
        new $.ParticleEmitter({
          x: this.x,
          y: this.y,
          count: 2,
          spawnRange: 0,
          friction: 0.85,
          minSpeed: 2,
          maxSpeed: 15,
          minDirection: 0,
          maxDirection: $.tau,
          hue: 0,
          saturation: 0,
        })
      );
    }

    if (this.takingDamageAudioTick >= this.takingDamageAudioTickMax) {
      this.takingDamageAudioTick = 0;
      $.audio.play("takingDamage").rate($.util.rand(0.8, 1.2));
    }
  }

  // Atualizar cooldown do disparo especial
  if (this.specials.shootNearestCooldown > 0) {
    this.specials.shootNearestCooldown -= $.dt / 60;
    if (this.specials.shootNearestCooldown < 0) this.specials.shootNearestCooldown = 0;
  }
  // Atualizar cooldown das bombas
  if (this.specials.bombCooldown > 0) {
    this.specials.bombCooldown -= $.dt / 60;
    if (this.specials.bombCooldown <= 0) {
      this.specials.bombCooldown = 0;
      this.specials.bombCount = 5;
      this.specials.bombUsed = 0;
    }
  }
  // Atualizar escudo: ganha 1 a cada 30s, máximo 1
  if (!this.specials.shieldActive && this.specials.shieldCount < 1) {
    this.specials.shieldCooldown -= $.dt / 60;
    if (this.specials.shieldCooldown <= 0) {
      this.specials.shieldCount = 1;
      this.specials.shieldCooldown = 30;
    }
  }
  // Atualizar escudo ativo
  if (this.specials.shieldActive) {
    this.specials.shieldTimer -= $.dt / 60;
    if (this.specials.shieldTimer <= 0) {
      this.specials.shieldActive = false;
      this.specials.shieldTimer = 0;
    }
  }
};

/*==============================================================================
Render
==============================================================================*/
$.Hero.prototype.render = function () {
  if (this.life > 0) {
    let fillStyle = this.fillStyle;

    if (this.takingDamage) {
      fillStyle = "hsla(0, 0%, " + $.util.rand(0, 100) + "%, 1)";
      $.ctxmg.fillStyle = "hsla(0, 100%, 50%, " + $.util.rand(0.05, 0.2) + ")";
      $.ctxmg.fillRect(-$.screen.x, -$.screen.y, $.cw, $.ch);
    } else if (this.weapon.fireFlag > 0) {
      this.weapon.fireFlag -= $.dt;
      if (
        $.powerupTimers[2] > 0 ||
        $.powerupTimers[3] > 0 ||
        $.powerupTimers[4] > 0
      ) {
        fillStyle =
          "hsla(" + $.tick * 30 + ", 100%, " + $.util.rand(50, 80) + "%, 1)";
      } else {
        fillStyle =
          "hsla(" +
          $.util.rand(0, 360) +
          ", 100%, " +
          $.util.rand(20, 80) +
          "%, 1)";
      }
    }

    $.ctxmg.save();
    $.ctxmg.translate(this.x, this.y);
    $.ctxmg.rotate(this.direction - $.pi / 4);
    $.ctxmg.fillStyle = fillStyle;
    $.ctxmg.fillRect(0, 0, this.radius, this.radius);
    $.ctxmg.restore();

    $.ctxmg.save();
    $.ctxmg.translate(this.x, this.y);
    $.ctxmg.rotate(this.direction - $.pi / 4 + $.tau / 3);
    $.ctxmg.fillStyle = fillStyle;
    $.ctxmg.fillRect(0, 0, this.radius, this.radius);
    $.ctxmg.restore();

    $.ctxmg.save();
    $.ctxmg.translate(this.x, this.y);
    $.ctxmg.rotate(this.direction - $.pi / 4 - $.tau / 3);
    $.ctxmg.fillStyle = fillStyle;
    $.ctxmg.fillRect(0, 0, this.radius, this.radius);
    $.ctxmg.restore();

    $.util.fillCircle($.ctxmg, this.x, this.y, this.radius - 3, fillStyle);

    // Efeito visual de escudo ativo
    if (this.specials && this.specials.shieldActive) {
      $.ctxmg.save();
      $.ctxmg.globalAlpha = 0.35 + 0.15 * Math.sin($.tick * 0.5);
      $.util.strokeCircle($.ctxmg, this.x, this.y, this.radius + 12, '#0ff', 6);
      $.ctxmg.globalAlpha = 1;
      $.ctxmg.restore();
    }

    if ($.mouse.down) {
      let sinMult = $.powerupTimers[2] > 0 ? 0.8 : 0.2;
      let spread = $.powerupTimers[3] > 0 ? $.pi / 6 : $.pi / 12;
      let radiusMult = $.powerupTimers[4] > 0 ? 3 : 2;
      let lineWidthMult = $.powerupTimers[4] > 0 ? 3 : 1;

      $.ctxmg.beginPath();
      $.ctxmg.arc(
        this.x,
        this.y,
        this.radius * 2 + Math.sin($.tick * sinMult) * radiusMult,
        this.direction - spread,
        this.direction + spread,
        false
      );
      $.ctxmg.lineWidth = 2 * lineWidthMult;
      $.ctxmg.strokeStyle =
        "hsla(" +
        $.util.rand(0, 359) +
        ", 100%, " +
        $.util.rand(20, 80) +
        "%, 1)";
      $.ctxmg.stroke();
    }
  }
};

// Adicionar função para disparo especial no inimigo mais próximo
$.Hero.prototype.shootNearestEnemy = function () {
  if (this.specials.shootNearestCooldown > 0) return;
  let nearest = $.util.getNearestEnemy(this.x, this.y);
  if (!nearest) return;
  let dx = nearest.x - this.x;
  let dy = nearest.y - this.y;
  let dir = Math.atan2(dy, dx);
  let gunX = this.x + Math.cos(dir) * this.radius;
  let gunY = this.y + Math.sin(dir) * this.radius;
  let color = this.weapon.bullet.color;
  $.bulletsFired++;
  // Dois disparos com pequeno ângulo de separação
  let spread = 0.12; // ~7 graus
  for (let j = -1; j <= 1; j += 2) {
    $.bullets.push(
      new $.Bullet({
        x: gunX,
        y: gunY,
        speed: this.weapon.bullet.speed,
        direction: dir + j * spread,
        damage: this.weapon.bullet.damage,
        size: this.weapon.bullet.size,
        lineWidth: this.weapon.bullet.lineWidth,
        strokeStyle: color.value,
        hue: color.hue,
        saturation: color.saturation,
        lightness: color.lightness,
        piercing: this.weapon.bullet.piercing,
        isHoming: false,
        isExplosive: false,
        homingStrength: 0,
        explosiveRadius: 0,
      })
    );
  }
  $.audio.play("shoot");
  this.specials.shootNearestCooldown = 0.2; // 0.2 segundos de cooldown
};

// Função para soltar bomba
$.Hero.prototype.dropBomb = function () {
  if (this.specials.bombCount <= 0 || this.specials.bombCooldown > 0) return;
  this.specials.bombCount--;
  this.specials.bombUsed++;
  if (this.specials.bombUsed >= 5) {
    this.specials.bombCooldown = 20; // 20 segundos de recarga para 5 bombas
  }
  // Criar bomba que explode em 3 segundos
  $.bombs = $.bombs || [];
  $.bombs.push({
    x: this.x,
    y: this.y,
    timer: 3, // segundos
    radius: 130,
    exploded: false,
  });
};

// Função para ativar escudo
$.Hero.prototype.activateShield = function () {
  if (this.specials.shieldCount > 0 && !this.specials.shieldActive) {
    this.specials.shieldActive = true;
    this.specials.shieldTimer = 10;
    this.specials.shieldCount = 0;
  }
};

// Função para usar cura
$.Hero.prototype.useHeal = function () {
  if (this.specials.healCount > 0 && this.life > 0 && this.life < 1) {
    this.life += 0.15;
    if (this.life > 1) this.life = 1;
    this.specials.healCount--;
  }
};
