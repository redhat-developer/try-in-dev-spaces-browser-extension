/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/

import { Endpoint } from '../preferences';

export function getProjectURL() {
    const meta = window.document.querySelector('meta[property="og:url"]');
    return meta ? meta.getAttribute('content') : undefined;
}

export function getFactoryUrl(projectUrl: string, endpoint: Endpoint) {
    return endpoint.url + '/#' + projectUrl;
}

export function getHostName(endpoint: Endpoint) {
    const url = new URL(endpoint.url);
    return url.hostname;
}
