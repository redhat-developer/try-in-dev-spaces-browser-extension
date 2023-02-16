# Try in Dev Spaces Browser Extension

This web extension adds a `Dev Spaces` button on every GitHub repository page that starts a new workspace based on the current repository.

![GitHub button example](./images/readme/github-button-example.png)

By default, the new workspace is created on the [Eclipse Che® hosted by Red Hat instance](https://developers.redhat.com/developer-sandbox/ide).

Additional Dev Spaces (and upstream Eclipse Che®) instances can configured from the extension's options.

## Extension permissions

 - Requires `storage` permissions to lerverage the [Storage API](https://developer.chrome.com/docs/extensions/reference/storage/) to allow your options to be saved locally and synced across devices.

 - Access to your data on github.com. This is required to determine the factory url for the button, and for injecting the button element into the webpage.

## Quick start

1. Download dependencies and build the extension. The built extension will be located in the generated `dist` folder.
```
$ yarn && yarn build
```
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
For development, run `yarn watch` to watch the source files to recompile on changes.

2. Sideload the extension located in the `dist` folder into your web browser.
For instructions for different web browsers, refer to [CONTRIBUTING.md](./CONTRIBUTING.md).

## Running tests
```
$ yarn test
```
