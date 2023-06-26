/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/

export interface Endpoint {
    url: string;
    active: boolean;
    readonly: boolean;
}

const DEFAULT_ENDPOINT: Endpoint = { url: "https://workspaces.openshift.com", active: true, readonly: true };

export async function getEndpoints(): Promise<Endpoint[]> {
    const storedEndpoints = (await chrome.storage.sync.get({
        endpoints: [],
    })).endpoints;

    const removedDefault = storedEndpoints.filter(e => e.url !== DEFAULT_ENDPOINT.url);
    const activeExists = !!removedDefault.find((e) => e.active);
    const defaultCopy = {...DEFAULT_ENDPOINT, active: !activeExists};
    return [defaultCopy].concat(storedEndpoints);
}

export function saveEndpoints(endpoints: Endpoint[]): Promise<void> {
    const removedDefault = endpoints.filter(e => e.url !== DEFAULT_ENDPOINT.url);
    return chrome.storage.sync.set({ endpoints: removedDefault });
}

export function getActiveEndpoint(endpoints: Endpoint[]): Endpoint {
    const active = endpoints.find((e) => e.active);
    if (!active) {
        throw new Error("No endpoint is selected in the extension options.");
    }
    return active;
}

export async function getGitDomains(): Promise<string[]> {
    const storedDomains = (await chrome.storage.sync.get({
        gitDomains: [],
    })).gitDomains;

    return storedDomains;
}

export function saveGitDomains(domains: string[]): Promise<void> {
    return chrome.storage.sync.set({ gitDomains: domains });
}
