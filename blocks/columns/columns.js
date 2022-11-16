export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  if (block.matches('.schema')) {
    const secondaryLink = block.querySelector('.button-container a:nth-child(2)');
    secondaryLink.insertAdjacentHTML('beforeend', `
      <svg width="14" height="10" viewBox="0 0 14 10" fill="#FFFFFF" xmlns="http://www.w3.org/2000/svg">
        <use href="/styles/icons.svg#arrow-right"></use>
      </svg>
    `);
  }
}
