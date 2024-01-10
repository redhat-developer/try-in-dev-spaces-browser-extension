# CHANGELOG

## v1.1.1
- [Support new GitHub UI #81](https://github.com/redhat-developer/try-in-dev-spaces-browser-extension/pull/81)
    - Adds the "Dev Spaces" button in the new GitHub UI.

## v1.1.0
- [Support for GitHub enterprise hostnames #72
](https://github.com/redhat-developer/try-in-dev-spaces-browser-extension/issues/72)
    - GitHub Enterprise support is now available. To configure the extension to work with GitHub Enterprise:
        1. Open the extension options page. On Chrome, this can be done by visiting "chrome://extensions", clicking "Details" for the extension and clicking "Extension options".
        2. Click on the "GitHub Enterprise domains" tab.
        3. Enter your GitHub Enterprise domain (ex. https://github.example.com).
        4. Accept the permission prompt after it appears on the top right of the browser. The permission is required to allow the extension to insert the "Dev Spaces" button within the GitHub webpage.
        5. Navigate to a GitHub project within your GitHub Enterprise instance to see the new "Dev Spaces" button.
