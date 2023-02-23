/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/

export interface Endpoint {
    url: string;
    active: boolean;
    readonly: boolean;
}

const DEFAULT_ENDPOINTS: Endpoint[] = [
    { url: "https://workspaces.openshift.com", active: true, readonly: true },
];

export async function getEndpoints(): Promise<Endpoint[]> {
    const res = await chrome.storage.sync.get({
        endpoints: DEFAULT_ENDPOINTS,
    });
    return res.endpoints;
}

export function getDefaultEndpoint(endpoints: Endpoint[]): Endpoint {
    const active = endpoints.find((e) => e.active);
    if (!active) {
        throw new Error("No endpoint is selected in the extension options.");
    }
    return active;
}
