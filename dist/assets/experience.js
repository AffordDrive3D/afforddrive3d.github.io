(() => {
  const demo = document.querySelector('[data-demo]');
  const steps = [...demo.querySelectorAll('[data-step-button]')];
  const text = [
    ['RGB-only', 'RGB-based world-action models predict how the scene will look in <strong>future frames</strong>. <strong>Geometry</strong> and regions relevant to ego motion are not modeled explicitly.', 'Predicting future scene appearance'],
    ['AffordDrive3D', 'AffordDrive3D predicts <strong>future geometry</strong> to model evolving spatial structure and <strong>driving affordances</strong> to identify regions critical to ego motion. Together, these signals make future world modeling explicitly <strong>action-relevant</strong> for trajectory planning.', 'Future geometry and driving affordances']
  ];
  let step = 1;
  function renderStep(next) {
    step = next; demo.dataset.step = String(step);
    steps.forEach((button, i) => { button.setAttribute('aria-selected', String(i === step)); button.tabIndex = i === step ? 0 : -1; });
    demo.querySelector('[role="tabpanel"]').setAttribute('aria-labelledby', steps[step].id);
    demo.querySelector('[data-demo-label]').textContent = text[step][0];
    demo.querySelector('[data-demo-copy]').innerHTML = text[step][1];
    demo.querySelector('[data-demo-title]').textContent = text[step][2];
    demo.querySelectorAll('.added-signal').forEach(el => el.setAttribute('aria-hidden', String(step < 1)));
    demo.querySelector('.added-plan').setAttribute('aria-hidden', String(step < 1));
  }
  steps.forEach((button, i) => button.addEventListener('click', () => renderStep(i)));
  renderStep(1);

  // Keyboard navigation follows the selected tab within each independent group.
  document.querySelectorAll('[role="tablist"]').forEach(list => {
    const tabs = [...list.querySelectorAll('[role="tab"]')];
    tabs.forEach(tab => {
      tab.tabIndex = tab.getAttribute('aria-selected') === 'true' ? 0 : -1;
      tab.addEventListener('click', () => tabs.forEach(t => t.tabIndex = t === tab ? 0 : -1));
      tab.addEventListener('keydown', event => {
        const index = tabs.indexOf(tab); let next;
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = tabs.length - 1;
        if (next !== undefined) { event.preventDefault(); tabs[next].click(); tabs[next].focus(); }
      });
    });
  });
})();
