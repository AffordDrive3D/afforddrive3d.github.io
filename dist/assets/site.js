(() => {
  const header = document.querySelector('[data-header]');
  const menuButton = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-menu]');

  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 24);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  menuButton?.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!open));
    menu?.classList.toggle('is-open', !open);
  });

  menu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    menu.classList.remove('is-open');
    menuButton?.setAttribute('aria-expanded', 'false');
  }));

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px' });
    revealItems.forEach((item) => {
      if (item.getBoundingClientRect().top < window.innerHeight * 0.95) {
        item.classList.add('is-visible');
      } else {
        revealObserver.observe(item);
      }
    });
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  const branchData = {
    affordance: {
      kicker: 'What matters for motion',
      title: 'Temporal affordance forecasting',
      copy: 'Affordance tokens predict drivable-area and collision-critical maps for the current frame and eight future timestamps, linking spatial prediction directly to ego motion.',
      facts: ['27 tokens', '2 dense maps', '0–4 s horizon']
    },
    rgb: {
      kicker: 'How the scene may evolve',
      title: 'Future RGB world modeling',
      copy: 'RGB world tokens condition a video diffusion model that forecasts future visual appearance in latent space. Its denoised future latent also becomes the scene context for geometry prediction.',
      facts: ['64 tokens', 'video diffusion', 'shared future context']
    },
    geometry: {
      kicker: 'Where the future is',
      title: 'RGB-conditioned geometry',
      copy: 'Geometry tokens are fused with denoised RGB latents so the branch can recover 3D structure for the same predicted future. Stop-gradient isolates geometry supervision from the RGB generator.',
      facts: ['64 tokens', 'future depth', 'RGB-aligned']
    },
    action: {
      kicker: 'What the ego should do',
      title: 'Diffusion trajectory generation',
      copy: 'Action-token states condition a diffusion transformer trained with flow matching to generate the future ego trajectory. At inference time, this is the only branch that needs to run.',
      facts: ['8 tokens', 'flow matching', 'inference branch']
    }
  };

  const branchExplorer = document.querySelector('[data-branch-explorer]');
  branchExplorer?.querySelectorAll('[data-branch]').forEach((tab) => {
    tab.addEventListener('click', () => {
      const key = tab.dataset.branch;
      const data = branchData[key];
      if (!data) return;
      branchExplorer.querySelectorAll('[data-branch]').forEach((button) => button.setAttribute('aria-selected', String(button === tab)));
      const panel = branchExplorer.querySelector('#branch-panel');
      panel.setAttribute('aria-labelledby', tab.id);
      branchExplorer.querySelector('[data-branch-kicker]').textContent = data.kicker;
      branchExplorer.querySelector('[data-branch-title]').textContent = data.title;
      branchExplorer.querySelector('[data-branch-copy]').textContent = data.copy;
      branchExplorer.querySelector('[data-branch-facts]').innerHTML = data.facts.map((fact) => `<span>${fact}</span>`).join('');
    });
  });

  const dialog = document.querySelector('[data-lightbox-dialog]');
  const dialogImage = dialog?.querySelector('img');
  const dialogCaption = dialog?.querySelector('p');
  document.querySelectorAll('[data-lightbox]').forEach((button) => button.addEventListener('click', () => {
    if (!dialog || !dialogImage || !dialogCaption) return;
    const sourceImage = button.querySelector('img');
    dialogImage.src = button.dataset.lightbox;
    dialogImage.alt = sourceImage?.alt || 'Expanded paper figure';
    dialogImage.style.maxWidth = sourceImage?.naturalWidth ? `${sourceImage.naturalWidth}px` : '100%';
    dialogCaption.textContent = button.dataset.caption || '';
    document.body.classList.add('lightbox-open');
    dialog.showModal();
  }));
  const closeDialog = () => {
    dialog?.close();
    document.body.classList.remove('lightbox-open');
  };
  dialog?.querySelector('[data-lightbox-close]')?.addEventListener('click', closeDialog);
  dialog?.addEventListener('click', (event) => {
    if (event.target === dialog) closeDialog();
  });
  dialog?.addEventListener('close', () => document.body.classList.remove('lightbox-open'));

  const copyButton = document.querySelector('[data-copy-citation]');
  const copyStatus = document.querySelector('[data-copy-status]');
  copyButton?.addEventListener('click', async () => {
    const citation = document.querySelector('#bibtex')?.textContent || '';
    try {
      await navigator.clipboard.writeText(citation);
      copyButton.textContent = 'Copied';
      if (copyStatus) copyStatus.textContent = 'Copied to clipboard';
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(document.querySelector('#bibtex'));
      selection.removeAllRanges();
      selection.addRange(range);
      copyButton.textContent = 'Selected';
      if (copyStatus) copyStatus.textContent = 'Press Ctrl/Cmd + C';
    }
    window.setTimeout(() => {
      copyButton.textContent = 'Copy BibTeX';
      if (copyStatus) copyStatus.textContent = 'Ready to copy';
    }, 2200);
  });
})();
