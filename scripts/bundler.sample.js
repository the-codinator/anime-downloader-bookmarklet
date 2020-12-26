(function downloader() {
  /* core.js */
  /**
   * Available params
   * xQuality = '480p' | '720p' | '1080p' (default)
   * xStart = smallest episode number to include (default = 1)
   * xEnd = biggest episode number to include (default = -1)
   * xDebug = enable debug logging (default = false)
   */

  const startTs = Date.now();
  const xDebug = (typeof window.xDebug === 'boolean' && window.xDebug) || false;                           /* Debug Flag */
  const xQuality = (['480p', '720p', '1080p'].includes(window.xQuality) && window.xQuality) || '1080p';    /* Video Resolution */
  const xStart = (typeof window.xStart === 'number' && window.xStart) || 1;                                /* Start Episode */
  const xEnd = (typeof window.xEnd === 'number' && window.xEnd) || -1;                                     /* End Episode */

  const SHOW_MORE_DELAY = 3000;
  const SLOW_OPEN_DELAY = 666;

  const debugLog = (msg, arg) => xDebug ? infoLog(msg, arg) : '';
  const infoLog = (msg, arg) => {
    const fullMsg = `[Codi] [${Date.now() - startTs}] ${msg}`;
    if (typeof arg !== 'undefined') {
      console.log(fullMsg, arg);
    } else {
      console.log(fullMsg);
    }
  };

  infoLog('Script init', {startTs, xDebug, xQuality, xStart, xEnd});

  /* Some browsers block opening a huge number of tabs in quick succession */
  function slowPageOpener(magnets) {
    debugLog('Starting slowPageOpener. Count:', magnets.length);
    let i = 0;
    const recursive = window.setInterval(() => {
      window.open(magnets[i++], '_blank');
      if (i >= magnets.length) {
        window.clearInterval(recursive);
        infoLog('Script complete!');
      }
    }, SLOW_OPEN_DELAY);
  }

  /* include horriblesubs.js */
  function horriblesubs() {

    function triggerShowMore() {
      const moreButton = document.querySelector('.more-button');
      if (moreButton) {
        debugLog('Clicking "Show More" button');
        moreButton.click(); /* Load more results */
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

    function getEpisodeMagnetLinks() {
      const divs = Array.from(document.querySelectorAll('.rls-info-container')); /* Get all episode divs (as Array) */
      debugLog('Queried all episode divs', divs);
      const hrefs = divs
        .map(x => x.querySelector('.link-' + xQuality)) /* Get specified xQuality div */
        .map(x => x.querySelector('.x-magnet-link')) /* Get magnet link span */
        .map(x => x.querySelector('a')) /* Get link element */
        .map(x => x.href); /* Get href */
      debugLog('Loaded all magnet hrefs', hrefs);
      if (xStart === 0 && xEnd === -1) {
        debugLog('No custom start/end, returning all magnet hrefs');
        return hrefs;
      }
      const ids = divs.map(x => parseInt(x.id)); /* Get episode number */
      debugLog('Loaded all episode numbers');
      const filteredHrefs = ids
        .map((x, i) => ({
          id: x,
          magnet: hrefs[i],
        }))
        .filter(({
          id,
          _,
        }) => id >= xStart && (id <= xEnd || xEnd === -1))
        .map(({
          _,
          magnet,
        }) => magnet);
      debugLog('Filtered episode list');
      return filteredHrefs;
    }

    function findAndOpenEpisodes() {
      const magnets = getEpisodeMagnetLinks();
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

  /* include subsplease.js */
  function subsplease() {

    function getEpisodes() {
      const nodes = document.querySelector('#show-release-table').querySelectorAll('.show-release-item');
      const data = Array.from(nodes) /* Get each episode */
        .map(x => {
          const text = x.querySelector('.episode-title').innerText; /* Get title */
          const episode = parseInt(text.match(/^.* (\d+)$/)[1]); /* Get episode number */
          const linksElement = x.querySelectorAll('.links'); /* Get links element */
          const links = Array.from(linksElement).find(a => a.innerText.includes(xQuality));
          const href = links.nextSibling.href; /* Get href for the right quality */
          return {
            episode,
            href,
          };
        });
      data.sort((a, b) => a.episode - b.episode); /* Fix the order (coz its usually descending order) */
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

    findAndOpenEpisodes();
  }

  /* include erairaws.js */
  function erairaws() {

    function triggerShowMore() {
      const moreButton = document.querySelector('.load_more');
      if (moreButton) {
        debugLog('Clicking "Show More" button');
        moreButton.click(); /* Load more results */
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
          return {
            episode,
            href,
          };
        });
      data.sort((a, b) => a.episode - b.episode); /* Fix the order (coz its usually descending order) */
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

  /* include switcher.js */
  function switcher() {
    const site = window.location.host;
    if (site.includes('horriblesubs')) {
      infoLog('Detected HorribleSubs');
      horriblesubs();
    } else if (site.includes('subsplease')) {
      infoLog('Detected SubsPlease');
      subsplease();
    } else if (site.includes('erai-raws')) {
      infoLog('Detected Erai Raws');
      erairaws();
    } else {
      throw new Error('Unsupported site for anime downloader');
    }
  }

  switcher();
})();
