import { decorateIcons } from '../../scripts/lib-franklin.js';

function getCurrentSlideIndex($block) {
  return [...$block.querySelectorAll('ul > li')].findIndex(($child) => $child.getAttribute('active') === 'true');
}

function updateSlide(nextIndex, $block) {
  const $slidesContainer = $block.querySelector('ul');

  const currentIndex = getCurrentSlideIndex($slidesContainer);

  $slidesContainer.children[currentIndex].removeAttribute('active');
  $slidesContainer.children[nextIndex].setAttribute('active', true);
  $slidesContainer.style.transform = `translateX(-${nextIndex * 450}px)`;
}

export default function decorate($block) {
  const $slidesContainer = $block.querySelector('ul');
  $slidesContainer.children[0].setAttribute('active', true);

  const numChildren = $slidesContainer.children.length;

  const $controlsContainer = document.createElement('div');
  $controlsContainer.classList.add('controls-container');
  $controlsContainer.innerHTML = `
    <button name="prev" aria-label="Previous Slide" class="control-button"><span class="icon icon-chevron-left" /></button>
    <button name="next" aria-label="Next Slide" class="control-button"><span class="icon icon-chevron-right" /></button>
  `;
  $block.append($controlsContainer);
  decorateIcons($controlsContainer);

  const nextButton = $controlsContainer.querySelector('button[name="next"]');
  const prevButton = $controlsContainer.querySelector('button[name="prev"]');

  nextButton.addEventListener('click', () => {
    const currentIndex = getCurrentSlideIndex($slidesContainer);
    updateSlide((currentIndex + 1) % numChildren, $block);
  });

  prevButton.addEventListener('click', () => {
    const currentIndex = getCurrentSlideIndex($slidesContainer);
    updateSlide((((currentIndex - 1) % numChildren) + numChildren) % numChildren, $block);
  });
}
