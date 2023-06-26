/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/

import { Endpoint } from "../../preferences/preferences";

export function getProjectURL(): string {
    return window.location.href;
}

export function getFactoryURL(projectURL: string, endpoint: Endpoint) {
    return endpoint.url + "/f?url=" + projectURL;
}

export function getHostName(endpoint: Endpoint) {
    const url = new URL(endpoint.url);
    return url.hostname;
}
