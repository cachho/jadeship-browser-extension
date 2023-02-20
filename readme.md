# RepArchive Browser Extension

Summary: **My Agent Extension - automatically convert all links on reddit to your favorite agent and enrich the page with online information, sales statistics and QC pictures. Works with all shopping agents and the Weidian, Taobao and 1688 marketplaces.**

---

This extension serves two main purposes to upgrade the quality of life for reddit users on Taobao, Weidian and 1688 related subreddits.

1. It rewrites all links  to your preferred shopping agent. (This includes shopping agent links and direct links to taobao.com and weidian.com.)

2. It enriches the page with extra information about the product and it's sales ranking from reparchive.com.

This leaves you with a seamless shopping experience, where you don't have to worry about the agents that others use. This extension turns the experience into a "click and buy" experience - like it should be.

Some other features:
- shows you if quality control (QC) pics are available on qc.photos 
- handles shortened links
- countless display options
- freedom to opt out of all online features and the affiliates program.

Safety & Privacy:
- the source code is open source, so anyone can review it and contribute
- minimalist approach, only 40kb.
- the extension is only active on required sites, the URLs are matched very carefully.
- you can opt out of all online interactions and run the extension offline
- no user data is collected (with each request you do technically expose your IP, among other information).

## Development

This extension uses one codebase for firefox and chromium browsers.

Before you do anything else, clone the repository. Install the dependencies with `npm install`.

### Codebase

This project is written in typescript.

Virtually all dependencies are for the developer experience and code maintainability.

> current state: this project has gotten more ambitious than I initially anticipated. All the maintenance packages have been added after the majority of the code has been written. It's also my first browser extension. That's why some parts might be unconventional.

### Testing in the browser

For testing on chromium and firefox you need to compile the typescript files. For this purpose you should have the typescript compiler installed globally (`npm install -g typescript`).

If you change anything, you have to reload the extension in the browser. Because chrome can load unpacked files, it's quicker and recommended for developing, however both browsers must remain compatible.

#### Chromium
Chromium allows you to use use an unpacked folder, so running `npm run dev` or `tsc` is enough. The project is setup in a way, where you can go to `chrome://extensions/`, and load the root folder with `manifest.json` inside, it automatically points to the tsc-compiled files from inside `build/`. If you want to make sure everything works with the packaged zip, drag `dist/chromium.zip` into the `chrome://extensions/` window.

#### Firefox
The extension needs to be packed as a zip. To do so run `npm run build`. It can then be found at `dist/firefox.zip`. Again, if you change anything you have to run the build script again.

In Firefox, to test it in the browser, you have to load the zipped extension (`dist/firefox.zip`) as a temporary addon. This can be done at `about:debugging#/runtime/this-firefox`.


## To do / future developments

There's no reason this should only work on reddit. I tried google sheets, but it seems very hard to modify the html there. If you have any other site this could work with, please open an issue.

## Bugs / Issues / Support
The following site can be used to quickly report bugs: https://reparchive.com/report?service=Browser+Extension

It's even better if you open an issue here on github, so we can methodically fix the issue.

## Disclaimer
Not affiliated with reddit.com, weidian.com, taobao.com, tmall.com, 1688.com, pandabuy.com, wegobuy.com, superbuy.com, cssbuy.com or sugargoo.com. We do not represent those websites or companies.