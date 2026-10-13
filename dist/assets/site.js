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
      kicker: 'What matters for action',
      title: 'Temporal affordance forecasting',
      copy: 'Affordance tokens forecast <strong>drivable areas</strong> and <strong>collision-critical regions</strong> across the current and future scene, explicitly modeling how <strong>action-relevant space</strong> evolves over time.'
    },
    rgb: {
      kicker: 'How the scene may evolve',
      title: 'Future RGB world modeling',
      copy: '<strong>RGB world tokens</strong> condition a video diffusion model to predict <strong>future scene appearance</strong> in latent space. The denoised future latent also provides <strong>future-scene context</strong> for geometry prediction.'
    },
    geometry: {
      kicker: 'What the future geometry looks like',
      title: 'RGB-conditioned geometry',
      copy: 'The geometry branch uses the <strong>denoised RGB latent</strong> as future-scene context, allowing it to recover the <strong>3D structure</strong> associated with the same <strong>predicted visual evolution</strong>.'
    },
    action: {
      kicker: 'What the ego should do',
      title: 'Diffusion trajectory generation',
      copy: '<strong>Action-token states</strong> condition a diffusion transformer trained with <strong>flow matching</strong> to generate the future ego trajectory. During inference, <strong>only the action branch</strong> is required.'
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
      branchExplorer.dataset.activeBranch = key;
      panel.setAttribute('aria-labelledby', tab.id);
      branchExplorer.querySelector('[data-branch-kicker]').textContent = data.kicker;
      branchExplorer.querySelector('[data-branch-title]').textContent = data.title;
      branchExplorer.querySelector('[data-branch-copy]').innerHTML = data.copy;
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

})();
