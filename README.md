# anime-downloader-bookmarklet

Quick downloader bookmarklet for popular anime torrent sites

## Bookmarklet

Hosted [here](https://the-codinator.github.io/anime-downloader-bookmarklet/index.html)

## Raw Script

See `scripts` folder for JS code to quick download from various sites. `core.js` is the common code required by all downloaders.

You can create the bookmarklet manually or by using some online tools like [this](https://mrcoles.com/bookmarklet/).
Note: this has a dumb bug when concatenating lines - it does not check for line comments `//`,
hence everything after that line becomes part of the comment coz line breaks are removed.
As a workaround, only use block comments `/* ... */` in the code.

## Customizable Parameters

Directly set values for the following variables in the browser console

- xQuality = '480p' | '720p' | '1080p' (default = '1080p')
- xStart = smallest episode number to include (default = 1)
- xEnd = biggest episode number to include (default = -1 (latest))
- xDebug = enable debug logging (default = false)
