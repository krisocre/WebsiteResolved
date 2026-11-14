(() => {
  'use strict';
  const upfrontFee = 50;
  const successFee = 125;
  const money = value => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
  const quantityInputs = [...document.querySelectorAll('.quantity-control input')];
  let reviewCount = 1;
  let removedCount = 1;
  const outcomeInput = document.getElementById('removed-count');

  function setOutcome(value) {
    const number = Number(value);
    removedCount = Math.min(reviewCount, Math.max(0, Number.isFinite(number) ? Math.round(number) : removedCount));
    outcomeInput.max = reviewCount;
    outcomeInput.value = removedCount;
    const label = removedCount + ' of ' + reviewCount + ' removed';
    outcomeInput.setAttribute('aria-valuetext', label);
    document.getElementById('removed-label').textContent = label;
    document.querySelectorAll('[data-removed-count]').forEach(element => { element.textContent = removedCount; });
    const calculator = document.querySelector('.estimate-card');
    calculator.querySelector('[data-estimate="success"]').textContent = money(successFee * removedCount);
    calculator.querySelector('[data-estimate="total"]').textContent = money(upfrontFee * reviewCount + successFee * removedCount);
  }

  function setQuantity(value) {
    const number = Number(value);
    const wasAllRemoved = removedCount === reviewCount;
    reviewCount = Math.min(50, Math.max(1, Number.isFinite(number) ? Math.round(number) : reviewCount));
    quantityInputs.forEach(input => { input.value = reviewCount; });
    document.querySelectorAll('[data-review-count]').forEach(element => { element.textContent = reviewCount; });
    const amounts = { upfront: upfrontFee * reviewCount, success: successFee * reviewCount, total: (upfrontFee + successFee) * reviewCount };
    document.querySelectorAll('[data-estimate]').forEach(element => { element.textContent = money(amounts[element.dataset.estimate]); });
    document.querySelector('[data-preview="review_count"]').textContent = reviewCount;
    document.querySelectorAll('[data-step]').forEach(button => { button.disabled = Number(button.dataset.step) < 0 ? reviewCount === 1 : reviewCount === 50; });
    setOutcome(wasAllRemoved ? reviewCount : Math.min(removedCount, reviewCount));
  }

  quantityInputs.forEach(input => {
    input.addEventListener('input', () => {
      if (input.value !== '' && input.checkValidity()) setQuantity(input.value);
    });
    input.addEventListener('change', () => setQuantity(input.value || reviewCount));
  });
  document.querySelectorAll('[data-step]').forEach(button => button.addEventListener('click', () => setQuantity(reviewCount + Number(button.dataset.step))));
  outcomeInput.addEventListener('input', () => setOutcome(outcomeInput.value));
  setQuantity(1);

  const concernTabs = [...document.querySelectorAll('.concern-tabs [role="tab"]')];
  function selectConcern(tab, focus = false) {
    concernTabs.forEach(button => {
      const selected = button === tab;
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
      document.getElementById(button.getAttribute('aria-controls')).hidden = !selected;
    });
    if (focus) tab.focus();
  }
  concernTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectConcern(tab));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % concernTabs.length;
      else if (event.key === 'ArrowLeft') next = (index - 1 + concernTabs.length) % concernTabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = concernTabs.length - 1;
      else return;
      event.preventDefault();
      selectConcern(concernTabs[next], true);
    });
  });

  const form = document.getElementById('assessment-form');
  const preview = document.getElementById('request-preview');
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    setQuantity(form.elements.review_count.value);
    const data = new FormData(form);
    preview.querySelectorAll('[data-preview]').forEach(element => {
      const value = data.get(element.dataset.preview);
      element.textContent = typeof value === 'string' && value.trim() ? value.trim() : 'To be shared later';
      if (element.closest('[data-preview-row]')) element.closest('[data-preview-row]').hidden = !String(value || '').trim();
    });
    form.hidden = true;
    preview.hidden = false;
    document.getElementById('preview-title').focus({ preventScroll: true });
    preview.scrollIntoView({ block: 'start', behavior: 'auto' });
  });
  document.getElementById('edit-request').addEventListener('click', () => {
    preview.hidden = true;
    form.hidden = false;
    form.elements.full_name.focus({ preventScroll: true });
    form.scrollIntoView({ block: 'start', behavior: 'auto' });
  });
  // This homepage is a local design preview. No endpoint, tracking or storage.
  form.querySelector('[type="submit"]').disabled = false;
})();
