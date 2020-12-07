function subsplease() {
  
  function getEpisodes() {
    const nodes = document.querySelector('#show-release-table').querySelectorAll('.show-release-item');
    const data = Array.from(nodes)                                /* Get each episode */
      .map(x => {
        const text = x.querySelector('.episode-title').innerText; /* Get title */
        const episode = parseInt(text.match(/^.* (\d+)$/)[1]);    /* Get episode number */
        const linksElement = x.querySelectorAll('.links')         /* Get links element */
        const links = Array.from(linksElement).find(a => a.innerText.includes(xQuality));
        const href = links.nextSibling.href;                      /* Get href for the right quality */
        return { episode, href };
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
      slowPageOpener(magnets)
    } else {
      infoLog('Magnets value', magnets);
      throw Error('No magnets found to open');
    }
  }

  findAndOpenEpisodes();
}
