# 🚀 Radius Raid

Radius Raid é um shoot 'em up espacial onde você deve destruir inimigos implacáveis antes que eles destruam você. O jogo conta com 13 tipos de inimigos, 5 powerups, fundos com parallax, efeitos sonoros retrô e estatísticas salvas localmente.

[🎮 **Jogar Radius Raid**](https://jackrugile.com/radius-raid/)

> 🏆 **1º Lugar no [js13kGames 2013](https://2013.js13kgames.com/#winners)!**

---

## 🎮 Controles Rápidos

- **Mover:** WASD / Setas
- **Atirar & Mirar:** Mouse
- **Bomba:** B
- **Escudo:** 2 ou E
- **Cura:** 3 ou C
- **Pausar:** P / Esc
- **Mudo:** M
-**disparo açltenativo:** Enter

---

## ✨ Novidades e Modificações Pessoais

> Este projeto é baseado no código original do Radius Raid, mas **modifiquei e expanda** o jogo com várias novidades e melhorias:

- 🖱️ **Movimentação automática para o mouse**
- 🧠 **Habilidades desbloqueáveis** (tiros inteligentes, duplos, explosivos)
- 💣 **Bomba**: até 5 por ciclo, explode após 3s, elimina inimigos em grande raio
- 🛡️ **Escudo**: proteção total por 10s, disponível a cada 30s
- ❤️ **Cura**: recupera 15% da vida, até 4 usos por partida
- 🎒 **Barra de slots de itens**: bombas, escudo e cura sempre visíveis
- 💥 **Efeitos visuais aprimorados**: partículas, explosões, feedback visual
- ⚖️ **Balanceamento**: habilidades especiais ajustadas para manter o desafio



## 👨‍💻 Créditos Originais

**Criado por:** [@jackrugile](https://twitter.com/jackrugile)

**Inspiração e Suporte:** [@rezoner](https://twitter.com/rezoner), [@loktar00](https://twitter.com/loktar00), [@end3r](https://twitter.com/end3r), [@austinhallock](https://twitter.com/austinhallock), [@chandlerprall](https://twitter.com/chandlerprall)

**Processamento de Áudio:** [JSFXR](https://github.com/mneubrand/jsfxr) por [@markusneubrand](https://neubrand.org/)

**Referências e Inspirações:**
- [Asteroids](<https://en.wikipedia.org/wiki/Asteroids_(video_game)>)
- [Cell Warfare](http://armorgames.com/play/3204/cell-warfare)
- [Space Pips](http://armorgames.com/play/3097/space-pips)
- [HTML5 Canvas Cheat Sheet](https://simon.html5.org/dump/html5-canvas-cheat-sheet.html)
- Billy Lamberta - [Foundation HTML5 Animation with JavaScript](http://lamberta.github.io/html5-animation/)

---

## 🛠️ Principais Blocos de Código Modificados

### js/hero.js
```js
// Sistema de habilidades especiais, bombas, escudo e cura
this.specials = {
  // ...
  bombCount: 5,
  bombCooldown: 0,
  shieldCount: 0,
  shieldCooldown: 0,
  shieldActive: false,
  shieldTimer: 0,
  healCount: 4,
  // ...
};

// Função para soltar bomba
$.Hero.prototype.dropBomb = function () { /* ... */ };

// Função para ativar escudo
$.Hero.prototype.activateShield = function () { /* ... */ };

// Função para usar cura
$.Hero.prototype.useHeal = function () { /* ... */ };

// Efeito visual de escudo ativo
if (this.specials && this.specials.shieldActive) {
  $.ctxmg.save();
  $.ctxmg.globalAlpha = 0.35 + 0.15 * Math.sin($.tick * 0.5);
  $.util.strokeCircle($.ctxmg, this.x, this.y, this.radius + 12, '#0ff', 6);
  $.ctxmg.globalAlpha = 1;
  $.ctxmg.restore();
}
```

### js/game.js
```js
// Barra de slots de itens
function renderSlotsBar() { /* ... */ }

// Atalhos de teclado para itens
if (e === 66) $.hero.dropBomb(); // Bomba
if (e === 50 || e === 69) $.hero.activateShield(); // Escudo (2 ou E)
if (e === 67 || e === 51) $.hero.useHeal(); // Cura (C ou 3)

// Atualização e renderização de bombas
if ($.bombs) { /* ... */ }
```

### Outros arquivos
- **js/bullet.js**: suporte a tiros inteligentes, explosivos e balanceamento.
- **js/util.js**: utilitário para encontrar inimigo mais próximo.

---

## 🎬 Gameplay

<video src="video/gameplay.mp4" controls width="600"></video>
