# JadeShip.com Extension

Short summary: **Automatically convert all links on reddit and yupoo to your favorite shopping agent; enrich the page with online information and QC pics.**

Summary: **My Agent Extension - automatically convert all links on reddit and yupoo to your favorite agent; enrich the page with online information, sales statistics and QC pictures. Works with all shopping agents and the Weidian, Taobao and 1688 marketplaces.**

> Formerly known as "My Agent Extension by RepArchive" 

---

This extension serves two main purposes to upgrade the quality of life for reddit users on Taobao, Weidian and 1688 related subreddits, and yupoo.com.

It rewrites all links to your preferred shopping agent. (This includes shopping agent links and direct links to taobao.com and weidian.com.)

It enriches the page with extra information about the product and it's sales ranking from www.jadeship.com.

This leaves you with a seamless shopping experience, where you don't have to worry about the agents that others use. This extension turns the experience into a "click and buy" experience - like it should be.

Some other features:
- convert links on reddit.com and yupoo.com
- shows you if quality control (QC) pics are available on finds.ly
- convert from any agent or marketplace to any agent or no agent (if you prefer)
- handles shortened links (pandabuy.page.link, pandabuy.app.link, weidian.info, l.acbuy.com, etc.)
- countless display options
- freedom to opt out of all online features and the affiliates program.

Support shopping agents: Support for the biggest list of shopping agents any tool has to offer, from classics such as Superbuy, Cssbuy and Sugargoo, to neo-agents such as AllChinaBuy, Hoobuy and Mulebuy.
Support for legacy agents: supports for defunct agents is kept so that you can convert those old links, for instance Pandabuy, Hagobuy and Wegobuy.
Supported marketplaces/platforms: weidian.com, taobao.com, 1688.com, tmall.com
Supported pages: Reddit, Yupoo, all shopping agents.

Safety & Privacy:
- the source code is open source, so anyone can review it and contribute
- minimalist approach, only ~0.2mb in size.
- the extension is only active on required sites, the URLs are matched very carefully.
- you can opt out of all online interactions and run the extension offline
- no user data is collected (with each request you do technically expose your IP, among other information).

This is a free and open source project, available at: https://github.com/cachho/jadeship-browser-extension

## Installation for Users

You can install the extension from the Chrome Web Store or Firefox Browser Add-Ons.

- Chrome Web Store: https://chrome.google.com/webstore/detail/my-agent-extension-by-rep/gnpcmjhhhobmpeeekcfmficdfgnmncim?hl=en&authuser=0
- Firefox Browser Add-Ons: https://addons.mozilla.org/en-US/firefox/addon/jadeship-extension/

### Side Loading


Alternatively, to use pre-release versions you can clone the repository and build from source (`npm install` and `npm run build` commands are all you need). Then install the zip files.

If you don't want to build from source, you can check this repo's releases page to directly download the zip files, ready for installation.

## Development

This extension uses one codebase for firefox and chromium browsers.

Before you do anything else, clone the repository. Install the dependencies with `npm install`.

### Codebase

This project is written in typescript.

Virtually all dependencies are for the developer experience and code maintainability.

> current state: this project has gotten more ambitious than I initially anticipated. All the maintenance packages have been added after the majority of the code has been written. It's also my first browser extension. That's why some parts might be unconventional.

### Testing in the browser

For testing on chromium and firefox you need to compile the typescript files. For this purpose you should have the typescript compiler installed globally (`npm install -g typescript`).

Webpack allows for hot reloads by running `npm run watch`.

If you change anything, you always have to reload the extension in the browser. Because chrome can load unpacked files, it's quicker and recommended for developing, however both browsers must remain compatible.

**Test Suite:** There is a subreddit that's specifically built to put all links that this extension has to work with in front of you: https://www.reddit.com/r/RADev/?f=flair_name%3A%22Test%22

#### Chromium
Chromium allows you to use use an unpacked folder, so running `npm run dev` or `npm run watch` is enough. The project is setup in a way, where you can go to `chrome://extensions/`, and load the root folder with `manifest.json` inside, it automatically points to the tsc-compiled files from inside `build/`. If you want to make sure everything works with the packaged zip, drag `dist/chromium.zip` into the `chrome://extensions/` window.

#### Firefox
The extension needs to be packed as a zip. To do so run `npm run build`. It can then be found at `dist/firefox.zip`. Again, if you change anything you have to run the build script again.

In Firefox, to test it in the browser, you have to load the zipped extension (`dist/firefox.zip`) as a temporary addon. This can be done at `about:debugging#/runtime/this-firefox`.


## To do / future developments

There's no reason this should only work on reddit. We can expand beyond that. However, for reasons of security, trust and performance, wildcard permissions for every site have to be avoided. That means that every site this extension is supposed to work on has to be defined in the manifest. If you have any other site this could work with, please open an issue.

I tried google sheets, but it seems very hard to modify the html there.

## Bugs / Issues / Support
The following site can be used to quickly report bugs: https://www.jadeship.com/report?service=Browser+Extension

It's even better if you open an issue here on github, so we can methodically fix the issue.

## Disclaimer
Not affiliated with reddit.com, weidian.com, taobao.com, tmall.com, 1688.com, or any of the agent pages listed in the manifest. We do not represent those websites or companies.
