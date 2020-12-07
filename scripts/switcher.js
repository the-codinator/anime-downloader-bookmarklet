function switcher() {
  const site = window.location.host;
  if (site.includes('horriblesubs')) {
    horriblesubs();
  } else if (site.includes('subsplease')) {
    subsplease();
  } else if (site.includes('erai-raws')) {
    erairaws();
  } else {
    console.error('Unsupported site for anime downloader');
  }
}
