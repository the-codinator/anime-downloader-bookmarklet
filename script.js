/**
 * Available params
 * hsQuality = '480p' | '720p' | '1080p' (default)
 * hsStart = smallest episode number to include (default = 1)
 * hsEnd = biggest episode number to include (default = -1)
 * hsDebug = enable debug logging (default = false)
 */

(function codinatorHorribleSubsDownloader() {

  /* Prepare vars */
  const startTs = Date.now();
  const hsDebug = (typeof window.hsDebug === 'boolean' && window.hsDebug) || false;                           /* Debug Flag */
  const hsQuality = (['480p', '720p', '1080p'].includes(window.hsQuality) && window.hsQuality) || '1080p';    /* Video Resolution */
  const hsStart = (typeof window.hsStart === 'number' && window.hsStart) || 1;                                /* Start Episode */
  const hsEnd = (typeof window.hsEnd === 'number' && window.hsEnd) || -1;                                     /* End Episode */

  const SHOW_MORE_DELAY = 3000;
  const SLOW_OPEN_DELAY = 666;

  const debugLog = (msg, arg) => hsDebug ? infoLog(msg, arg) : '';
  const infoLog = (msg, arg) => {
    const fullMsg = `[Codi] [${Date.now() - startTs}] ${msg}`;
    if (arg) {
      console.log(fullMsg, arg);
    } else {
      console.log(fullMsg);
    }
  };

  infoLog('Script init', {startTs, hsDebug, hsQuality, hsStart, hsEnd});

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
        .map(x => x.querySelector('.link-' + hsQuality))     /* Get specified hsQuality div */
        .map(x => x.querySelector('.hs-magnet-link'))        /* Get magnet link span */
        .map(x => x.querySelector('a'))                      /* Get link element */
        .map(x => x.href);                                            /* Get href */
    debugLog('Loaded all magnet hrefs', hrefs);
    if (hsStart === 0 && hsEnd === -1) {
      debugLog('No custom start/end, returning all magnet hrefs');
      return hrefs;
    }
    const ids = divs.map(x => parseInt(x.id));                        /* Get episode number */
    debugLog('Loaded all episode numbers');
    const filteredHrefs = ids
        .map((x, i) => ({id: x, magnet: hrefs[i]}))
        .filter(({id, _}) => id >= hsStart && (id <= hsEnd || hsEnd === -1))
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

  /* Some browsers block opening a huge number of tabs in quick succession */
  function slowPageOpener(magnets) {
    let i = 0;
    const recursive = window.setInterval(() => {
      window.open(magnets[i++], '_blank');
      if (i >= magnets.length) {
        clearInterval(recursive);
        infoLog('Script complete');
      }
    }, SLOW_OPEN_DELAY);
  }

  loadAllEpisodes(findAndOpenEpisodes);
})();
