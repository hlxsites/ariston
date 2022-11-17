import { readBlockConfig, decorateIcons } from '../../scripts/lib-franklin.js';

/**
 * loads and decorates the footer
 * @param {Element} block The header block element
 */

export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';

  const footerPath = cfg.footer || '/footer';
  const resp = await fetch(`${footerPath}.plain.html`);
  const html = await resp.text();
  const footer = document.createElement('div');
  footer.innerHTML = html;

  const classes = ['copyright', 'links', 'social'];
  classes.forEach((e, j) => {
    const section = footer.children[j];
    if (section) section.classList.add(`footer-${e}`);
  });

  const hr = document.createElement('hr');
  footer.insertBefore(hr, footer.querySelector('.footer-copyright'));

  await decorateIcons(footer);
  block.append(footer);
}
