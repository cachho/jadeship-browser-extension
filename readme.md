# RepArchive Browser Extension

todo: add details for users

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