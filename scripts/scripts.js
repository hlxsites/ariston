import {
  sampleRUM,
  buildBlock,
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForLCP,
  loadBlocks,
  loadCSS,
  createOptimizedPicture,
  readBlockConfig,
  toClassName,
} from './lib-franklin.js';

const LCP_BLOCKS = ['hero', 'carousel']; // add your LCP blocks to the list

window.hlx.RUM_GENERATION = 'project-1'; // add your RUM generation information here

function buildHeroBlock(main) {
  // Collect h1, two paragraphs and photo
  const h1 = main.querySelector('h1');
  const picture = main.querySelector('picture');
  const img = picture.querySelector('img');
  const optimizedPicture = createOptimizedPicture(img.src, img.alt, true, [{ width: 670 }]);

  const paragraphs = Array.from(h1.parentElement.querySelectorAll('p')).filter((e) => e !== picture.parentElement);
  // eslint-disable-next-line no-bitwise
  if (h1 && picture && (h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING)) {
    const section = document.createElement('div');
    section.append(buildBlock('hero', [[{ elems: [paragraphs[0], h1, paragraphs[1], ...paragraphs.slice(2)] }, optimizedPicture]]));
    main.prepend(section);
  }
}

function buildCarouselBlock(main) {
  [...main.querySelectorAll(':scope > div')].forEach((section) => {
    const sectionMeta = section.querySelector('.section-metadata');

    if (sectionMeta) {
      const meta = readBlockConfig(sectionMeta);
      if (meta.style?.includes('Carousel')) {
        const block = buildBlock('carousel', [[section.querySelector('ul')]]);
        if (meta.style?.includes('carousel-teaser-cards')) {
          block.classList.add('teasers');
        }
        section.append(block);
      }
    }
  });
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    buildHeroBlock(main);
    buildCarouselBlock(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

function decorateOnPageNavigationAnchros(main) {
  [...main.querySelectorAll('em')]
    .filter((em) => em.innerText.charAt(0) === '('
      && em.innerText.charCodeAt(1) === 9875
      && em.innerText.charAt(em.innerText.length - 1) === ')')
    .forEach((em) => {
      const text = em.innerText.substring(2, em.innerText.length - 1).trim();
      const id = toClassName(text);
      const existingAnchor = document.getElementById(id);
      if (existingAnchor) {
        // delete the id if there is a conflict with another auto generated id
        delete existingAnchor.id;
      }
      const anchor = document.createElement('div');
      anchor.id = id;
      anchor.classList.add('opn-anchor');
      anchor.dataset.label = text;
      const up = em.parentElement;
      if (up.tagName === 'P' && up.children.length === 1) {
        up.replaceWith(anchor);
      } else {
        em.replaceWith(anchor);
      }
    });
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  // hopefully forward compatible button decoration
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
  decorateOnPageNavigationAnchros(main);
}

/**
 * loads everything needed to get to LCP.
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    await waitForLCP(LCP_BLOCKS);
  }
}

/**
 * Adds the favicon.
 * @param {string} href The favicon URL
 */
export function addFavIcon(href) {
  const link = document.createElement('link');
  link.rel = 'icon';
  link.href = href;
  const existingLink = document.querySelector('head link[rel="icon"]');
  if (existingLink) {
    existingLink.parentElement.replaceChild(link, existingLink);
  } else {
    document.getElementsByTagName('head')[0].appendChild(link);
  }
}

/**
 * loads everything that doesn't need to be delayed.
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  await loadBlocks(main);

  const { hash } = window.location;
  const element = hash ? main.querySelector(hash) : false;
  if (hash && element) element.scrollIntoView();

  loadHeader(doc.querySelector('header'));
  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  addFavIcon(`${window.hlx.codeBasePath}/icons/favicon.png`);
  sampleRUM('lazy');
  sampleRUM.observe(main.querySelectorAll('div[data-block-name]'));
  sampleRUM.observe(main.querySelectorAll('picture > img'));
}

/**
 * loads everything that happens a lot later, without impacting
 * the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();
