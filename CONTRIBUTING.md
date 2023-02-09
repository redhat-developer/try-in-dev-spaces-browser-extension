# Sideloading the extension to different browsers

After building the extension, sideload the extension located in the `dist` folder.

## Chromium based browsers (Google Chrome, Microsoft Edge, Brave, etc.)
1. Open the extensions page by visiting `chrome://extensions`, `edge://extensions`, `brave://extensions`, etc.
2. Enable `Developer mode`.
3. Click `Load unpacked` and provide the location to the `dist` folder.
4. Upon loading the extension, the `Unrecognized manifest key 'browser_specfic_settings` warning can be ignored.
5. In the extension's `Permissions` tab, provide the permissions to access data for `https://github.com`.

## Firefox version
1. Open the `about:debugging` page.
2. Navigate to `This Firefox`.
3. Click `Load Temporary Add-on` then select any file in the `dist` folder.
4. Open the `about:addons` page.
5. Under the extensions `Permissions` tab, provide permissions for the extension to access data on `https://github.com`.

![Step 5](./images/firefox/step-5.png)

## Safari version
To sideload the extension on Safari, Xcode is required.

1. Open the terminal and run the following to create and open an Xcode project for the web extension:
```
xcrun safari-web-extension-converter /path/to/dist/folder
```
2. In the Xcode project, set the build target to `Try in Web IDE (macOS)` and start the build by pressing ▶.

![Step 2](./images/safari/step-2.png)

3. After the build, press `Quit and Open Safari Settings...` on the following window.

![Step 3](./images/safari/step-3.png)

4. In the Safari settings, navigate to `Advanced` and check `Show Develop menu in menu bar`.

![Step 4](./images/safari/step-4.png)

5. In the Develop menu, enable `Allow Unsigned Extensions`.

![Step 5](./images/safari/step-5.png)

6. Enable the `Try in Web IDE` extension from the Safari settings.

![Step 6](./images/safari/step-6.png)

7. When prompted by the extension, allow access to `github.com`.

![Step 7](./images/safari/step-7.png)
