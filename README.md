# Try in Dev Spaces Browser Extension
[![Contribute](https://www.eclipse.org/che/contribute.svg)](https://workspaces.openshift.com#https://github.com/redhat-developer/try-in-dev-spaces-browser-extension)

This web extension adds a `Dev Spaces` button on every GitHub repository page that starts a new workspace based on the current repository.

![GitHub button example](./images/readme/github-button-example.png)

By default, the new workspace is created on the [Eclipse Che® hosted by Red Hat instance](https://developers.redhat.com/developer-sandbox/ide).

Additional Dev Spaces (and upstream Eclipse Che®) instances can configured from the extension's options.

## Extension permissions

 - Requires `storage` permissions to lerverage the [Storage API](https://developer.chrome.com/docs/extensions/reference/storage/) to allow your options to be saved locally and synced across devices.

 - Access to your data on github.com. This is required to determine the factory url for the button, and for injecting the button element into the webpage.

## Building and running locally

The extension can be built for both Chromium based browsers and for Firefox/Safari.
There are two builds because the two platforms have different manifest V3 definitions.

1. Download dependencies.
```
$ yarn
```

2. Run the build.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
To build for Chromium-based browsers:
```
$ yarn build
```
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
To build for Firefox or Safari:
```
$ yarn build:sf
```
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
Once complete, the built extension will be located in either `dist/chromium` or `dist/safari-firefox`.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
For development, run `yarn watch` or `yarn watch:sf` to watch the source files to recompile on changes.

3. Sideload the extension located under the `dist` folder into your web browser.
For instructions for different web browsers, refer to [CONTRIBUTING.md](./CONTRIBUTING.md).

## Running and sideloading the production build

#### Chromium-based browsers (Google Chrome, Microsoft Edge, Brave, etc.)
```
yarn build:prod
```
The built location is located in `dist/chromium`.

#### For Safari and Firefox
```
# the built extension is located in dist/safari-firefox
yarn build:prod-sf
```
The built location is located in `dist/safari-firefox`.

#### Sideloading the extension into the web browser
Refer to [CONTRIBUTING.md](./CONTRIBUTING.md).

## Running tests
```
$ yarn test
```
