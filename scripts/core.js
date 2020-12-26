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
