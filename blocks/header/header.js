import { readBlockConfig, decorateIcons } from '../../scripts/lib-franklin.js';

function setActiveLink(navSections, activeSection) {
  // Make first link selected if none are selected
  if (activeSection === '' && navSections) {
    [...navSections.querySelectorAll(':scope > ul > li')]?.[0].classList.add('selected');
  }

  if (navSections && activeSection !== '') {
    navSections.querySelectorAll(':scope > ul > li > a').forEach((navSection) => {
      navSection.parentElement.classList.remove('selected');
      if (new URL(navSection.href).hash === activeSection) navSection.parentElement.classList.add('selected');
    });
  }
}

function collectNavSections($sectionsContainer) {
  const anchors = [...document.querySelectorAll('.opn-anchor')].map((anchor) => [anchor.dataset.label, anchor.id]);

  if (!anchors.length) {
    return;
  }

  $sectionsContainer.innerHTML = `
    <ul>
        ${anchors.map(([text, anchor]) => `<li><a href="#${anchor}">${text}</a></li>`).join('\n')}
    </ul>
  `;

  [...$sectionsContainer.querySelectorAll(':scope > ul > li > a')].forEach((aTag) => {
    aTag.addEventListener('click', () => setActiveLink($sectionsContainer, new URL(aTag.href).hash));
  });
}

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */

export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';

  // fetch nav content
  const navPath = cfg.nav || '/nav';
  const resp = await fetch(`${navPath}.plain.html`);
  if (resp.ok) {
    const html = await resp.text();

    // decorate nav DOM
    const nav = document.createElement('nav');
    nav.innerHTML = html;
    decorateIcons(nav);

    const classes = ['brand', 'sections', 'tools'];
    classes.forEach((e, j) => {
      const section = nav.children[j];
      if (section) section.classList.add(`nav-${e}`);
    });

    const navSections = [...nav.children][1];
    collectNavSections(navSections);
    setActiveLink(navSections, window.location.hash);

    // add region selector to tools
    const regionSelector = document.createElement('div');
    regionSelector.innerHTML = `
      <button class="region-selector"><span><span class="icon icon-grid" /></span><span>CAMBIA AREA</span></button>
    `;
    nav.querySelector('.nav-tools').append(regionSelector);

    // hamburger for mobile
    const hamburger = document.createElement('div');
    hamburger.classList.add('nav-hamburger');
    hamburger.innerHTML = '<div class="nav-hamburger-icon"></div>';
    hamburger.addEventListener('click', () => {
      const expanded = nav.getAttribute('aria-expanded') === 'true';
      document.body.style.overflowY = expanded ? '' : 'hidden';
      nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    });
    nav.prepend(hamburger);
    nav.setAttribute('aria-expanded', 'false');
    decorateIcons(nav);
    block.append(nav);
  }
}
