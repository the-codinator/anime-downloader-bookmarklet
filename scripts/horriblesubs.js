function horriblesubs() {

  function triggerShowMore() {
    const moreButton = document.querySelector('.more-button');
    if (moreButton) {
      debugLog('Clicking "Show More" button');
      moreButton.click();         /* Load more results */
    }
    return moreButton;
  }

  function loadAllEpisodes(callback) {
    const recursive = setInterval(() => {
      if (!triggerShowMore()) {
        clearInterval(recursive);
        debugLog('Loaded all episodes');
        callback();
      }
    }, SHOW_MORE_DELAY);
  }

  function getEpisodeMagnetLinks() {
    const divs = Array.from(document.querySelectorAll('.rls-info-container')); /* Get all episode divs (as Array) */
    debugLog('Queried all episode divs', divs);
    const hrefs = divs
        .map(x => x.querySelector('.link-' + xQuality))      /* Get specified xQuality div */
        .map(x => x.querySelector('.x-magnet-link'))         /* Get magnet link span */
        .map(x => x.querySelector('a'))                      /* Get link element */
        .map(x => x.href);                                   /* Get href */
    debugLog('Loaded all magnet hrefs', hrefs);
    if (xStart === 0 && xEnd === -1) {
      debugLog('No custom start/end, returning all magnet hrefs');
      return hrefs;
    }
    const ids = divs.map(x => parseInt(x.id));               /* Get episode number */
    debugLog('Loaded all episode numbers');
    const filteredHrefs = ids
        .map((x, i) => ({id: x, magnet: hrefs[i]}))
        .filter(({id, _}) => id >= xStart && (id <= xEnd || xEnd === -1))
        .map(({_, magnet}) => magnet);
    debugLog('Filtered episode list');
    return filteredHrefs;
  }

  function findAndOpenEpisodes() {
    const magnets = getEpisodeMagnetLinks();
    debugLog('Opening magnets', magnets);
    if (magnets && magnets instanceof Array && magnets.length > 0) {
      infoLog(`Episode Count: ${magnets.length}`);
      slowPageOpener(magnets)
    } else {
      infoLog('Magnets value', magnets);
      throw Error('No magnets found to open');
    }
  }

  loadAllEpisodes(findAndOpenEpisodes);
}
