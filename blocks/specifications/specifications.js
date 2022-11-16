export default function decorate(block) {
  // Collect all headers and create tabs
  const tabs = Array.from(block.querySelectorAll('h3')).map((t) => t.textContent);

  // Collect specifications
  const specifications = {};
  tabs.forEach((tab) => {
    specifications[tab] = document.createElement('div');
  });

  let currentSpec = null;
  Array.from(block.querySelectorAll(':scope > div')).forEach((row) => {
    if (row.childElementCount === 1) {
      currentSpec = row.textContent.trim();
      return;
    }
    const key = row.children[0].textContent.trim();
    const value = row.children[1].textContent.trim();
    specifications[currentSpec].appendChild(document.createRange().createContextualFragment(`<div class="specification"><span>${key}</span> ${value}</div>`));
  });

  // Assemble tabs
  block.textContent = '';
  block.append(document.createRange().createContextualFragment(`
    <div class="tabs">
      ${tabs.map((tab, index) => `<input type="radio" id="tab-${index}" name="tabs" ${index === 0 ? 'checked="checked"' : ''} />`).join('')}
      <div class="tabs-switcher">
        ${tabs.map((tab, index) => `<label for="tab-${index}">${tab}</label>`).join('')}
      </div>
      ${tabs.map((tab, index) => `<div class="tab-content" id="tab-${index}-content">${specifications[tab].innerHTML}</div>`).join('')}
    </div>
  `));
}
