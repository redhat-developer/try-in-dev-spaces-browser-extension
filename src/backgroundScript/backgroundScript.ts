/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/

export const OPEN_OPTIONS = "openOptionsPage";

chrome.runtime.onMessage.addListener((message) => {
    switch (message.action) {
        case OPEN_OPTIONS:
            chrome.runtime.openOptionsPage();
            break;
        default:
            break;
    }
});
