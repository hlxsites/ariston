import { createOptimizedPicture } from '../../scripts/lib-franklin.js';

const cardImgSize = (() => {
  const viewportWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  if (viewportWidth >= 1024) {
    return 237; // 2 col, img about 41%
  }
  if (viewportWidth >= 992) {
    return 466; // 2 col, img 100%
  }
  return 925; // 1 col, img 100%
})();

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.innerHTML = row.innerHTML;
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: cardImgSize }])));
  block.textContent = '';
  block.append(ul);
}
