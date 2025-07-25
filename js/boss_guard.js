// boss_guard.js
// Garante que só exista um chefão no mapa por vez
window.bossGuard = function() {
  if (!window.$ || !$.enemies) return;
  let bossCount = 0;
  for (let i = $.enemies.length - 1; i >= 0; i--) {
    let enemy = $.enemies[i];
    if (enemy.isBoss) {
      bossCount++;
      if (bossCount > 1) {
        // Elimina chefões extras
        $.enemies.splice(i, 1);
      }
    }
  }
}; 