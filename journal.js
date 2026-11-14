(() => {
  'use strict';
  const count = document.getElementById('model-size');
  if (!count) return;
  function update() {
    const before = Number(count.value);
    const points = Math.round(before * 4.4) - 1;
    const after = before - 1;
    document.getElementById('model-mean').textContent = (points / after).toFixed(4);
    const displayed = Math.floor((20 * points + after) / (2 * after)) / 10;
    document.getElementById('model-display').textContent = '4.4 → ' + displayed.toFixed(1);
  }
  count.addEventListener('change', update);
  update();
})();
