function erairaws() {

  function triggerShowMore() {
    const moreButton = document.querySelector('.load_more');
    if (moreButton) {
      debugLog('Clicking "Show More" button');
      moreButton.click();    /* Load more results */
    }
    return moreButton;
  }

  function loadAllEpisodes(callback) {
    const recursive = window.setInterval(() => {
      if (!triggerShowMore()) {
        window.clearInterval(recursive);
        debugLog('Loaded all episodes');
        callback();
      }
    }, SHOW_MORE_DELAY);
  }

  function getEpisodes() {
    const nodes = document.querySelector('.show-episodes').querySelectorAll('article');
    const data = Array.from(nodes)
      .map(x => {
        const episode = parseInt(x.querySelector('font').lastElementChild.querySelector('font').innerText);
        const releaseLinks = x.querySelectorAll('.release-links');
        const div = Array.from(releaseLinks).find(a => a.querySelector('i').innerText.includes(xQuality));
        const links = div.querySelectorAll('a');
        const href = Array.from(links).find(a => a.href.includes('magnet')).href;
        return {episode, href};
      });
    data.sort((a, b) => a.episode - b.episode);                   /* Fix the order (coz its usually descending order) */
    debugLog('Loaded all magnet hrefs', data);

    if (xStart === 0 && xEnd === -1) {
      debugLog('No custom start/end, returning all magnet hrefs');
      return data.map(x => x.href);
    }
    const filteredData = data.filter(x => x.episode >= xStart && (x.episode <= xEnd || xEnd === -1)).map(x => x.href);
    debugLog('Filtered episode list');
    return filteredData;
  }

  function findAndOpenEpisodes() {
    const magnets = getEpisodes();
    debugLog('Opening magnets', magnets);
    if (magnets && magnets instanceof Array && magnets.length > 0) {
      infoLog(`Episode Count: ${magnets.length}`);
      slowPageOpener(magnets);
    } else {
      infoLog('Magnets value', magnets);
      throw Error('No magnets found to open');
    }
  }

  loadAllEpisodes(findAndOpenEpisodes);
}
