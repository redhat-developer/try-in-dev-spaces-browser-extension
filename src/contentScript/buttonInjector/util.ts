/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/

import { Endpoint } from "../../preferences/preferences";

export function getProjectURL(): string {
    const meta = document.querySelector('meta[property="og:url"]');
    const projectURL = meta.getAttribute("content");
    if (!projectURL) {
        throw new Error(
            `Could not detect project URL for '${window.location.href}'.`
        );
    }
    return projectURL;
}

export function getFactoryURL(projectURL: string, endpoint: Endpoint) {
    return endpoint.url + "/#" + projectURL;
}

export function getHostName(endpoint: Endpoint) {
    const url = new URL(endpoint.url);
    return url.hostname;
}
