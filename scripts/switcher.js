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
