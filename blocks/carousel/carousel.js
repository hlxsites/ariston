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

function decorateTeaserItems($slidesContainer) {
  [...$slidesContainer.children].forEach(($child) => {
    const aTag = $child.querySelector('a');
    if (aTag) {
      const newATag = aTag.cloneNode();
      const wrapperDiv = document.createElement('div');
      aTag.remove();
      wrapperDiv.innerHTML = $child.innerHTML;
      newATag.append(wrapperDiv);
      newATag.prepend(wrapperDiv.querySelector('picture'));
      $child.innerHTML = '';
      $child.append(newATag);

      $child.querySelector('br ~ br')?.remove();
    }
  });
}

export default function decorate($block) {
  const $slidesContainer = $block.querySelector('ul');
  $slidesContainer.children[0].setAttribute('active', true);

  const numChildren = $slidesContainer.children.length;

  if ($block.classList.contains('teasers')) {
    decorateTeaserItems($slidesContainer);
  }

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
