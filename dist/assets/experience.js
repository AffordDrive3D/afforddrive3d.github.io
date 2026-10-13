(() => {
  const demo = document.querySelector('[data-demo]');
  const steps = [...demo.querySelectorAll('[data-step-button]')];
  const play = demo.querySelector('[data-demo-play]');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const text = [
    ['RGB-only: appearance without explicit driving affordances.', 'DriveVLA-W0 learns from future RGB appearance, but this example shows its trajectory colliding with the lead vehicle. The comparison on the right stays visible so you can directly see the planning difference.'],
    ['AffordDrive3D: spatial structure + motion-relevant regions.', 'In addition to future RGB, our training predicts future depth, drivable area, and collision-critical regions. These auxiliary signals provide action-relevant spatial supervision; in this example the planned trajectory stops safely behind the lead vehicle.']
  ];
  let step = 1, timer = null, playing = false, interacted = false;
  function renderStep(next) {
    step = next; demo.dataset.step = String(step);
    steps.forEach((button, i) => { button.setAttribute('aria-selected', String(i === step)); button.tabIndex = i === step ? 0 : -1; });
    demo.querySelector('[role="tabpanel"]').setAttribute('aria-labelledby', steps[step].id);
    demo.querySelector('[data-demo-title]').textContent = text[step][0];
    demo.querySelector('[data-demo-copy]').textContent = text[step][1];
    demo.querySelectorAll('.added-signal').forEach(el => el.setAttribute('aria-hidden', String(step < 1)));
    // Keep both real planning outcomes visible at every stage for direct comparison.
    demo.querySelector('.added-plan').removeAttribute('aria-hidden');
  }
  function stop() { clearTimeout(timer); timer = null; playing = false; play.textContent = step === 1 ? 'Replay' : 'Play'; }
  function advance() {
    timer = setTimeout(() => { if (!playing) return; renderStep(step + 1); if (step === 1) stop(); else advance(); }, 3800);
  }
  function start(restart = false) { stop(); if (restart || step === 1) renderStep(0); playing = true; play.textContent = 'Pause'; advance(); }
  steps.forEach((button, i) => button.addEventListener('click', () => { interacted = true; stop(); renderStep(i); play.textContent = i === 1 ? 'Replay' : 'Play'; }));
  play.addEventListener('click', () => { interacted = true; if (playing) stop(); else start(); });
  if (!reduced.matches && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting) && !interacted) { interacted = true; start(true); observer.disconnect(); }
    }, {threshold: .3});
    observer.observe(demo);
  }
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
  reduced.addEventListener('change', () => { if (reduced.matches) { stop(); renderStep(1); } });
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
