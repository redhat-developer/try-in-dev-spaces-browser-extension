/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/

import { GitServiceFactory } from '../gitServices/GitServiceFactory';

try {
    GitServiceFactory.getGitService()?.injectButton();
} catch(e) {
    const message = e instanceof Error ? e.message : e;
    console.log(`try-in-web-ide-browser-extension error: ${message}`);
}
