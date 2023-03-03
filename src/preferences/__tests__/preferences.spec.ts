/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/

import { chrome } from "jest-chrome";
import { Endpoint, getEndpoints, saveEndpoints } from "../preferences";

const defaultEndpoint: Endpoint = {
    url: "https://workspaces.openshift.com",
    active: true,
    readonly: true,
};

afterEach(() => {
    jest.clearAllMocks();
});

describe("Test getEndpoints()", () => {
    it("should contain default endpoint, no stored endpoints", async () => {
        chrome.storage.sync.get.mockImplementation(() => {
            return { endpoints: [] };
        });
        const endpoints: Endpoint[] = await getEndpoints();

        expect(endpoints).toEqual([defaultEndpoint]);
    });

    it("should contain default endpoint at the front with a stored inactive endpoint", async () => {
        const storedEndpoints: Endpoint[] = [
            { url: "https://url-1.com", active: false, readonly: false },
        ];
        chrome.storage.sync.get.mockImplementation(() => {
            return { endpoints: storedEndpoints };
        });
        const endpoints: Endpoint[] = await getEndpoints();

        expect(endpoints).toEqual([defaultEndpoint, ...storedEndpoints]);
    });

    it("should contain default endpoint at the front with a stored active endpoint", async () => {
        const storedEndpoints: Endpoint[] = [
            { url: "https://url-1.com", active: true, readonly: false },
        ];
        chrome.storage.sync.get.mockImplementation(() => {
            return { endpoints: storedEndpoints };
        });
        const endpoints: Endpoint[] = await getEndpoints();

        expect(endpoints).toEqual([
            { ...defaultEndpoint, active: false },
            ...storedEndpoints,
        ]);
    });

    it("should contain default endpoint at the front with many endpoints", async () => {
        const storedEndpoints: Endpoint[] = [
            { url: "https://url-1.com", active: false, readonly: false },
            { url: "https://url-2.com", active: false, readonly: false },
            { url: "https://url-3.com", active: true, readonly: false },
            { url: "https://url-4.com", active: false, readonly: false },
        ];
        chrome.storage.sync.get.mockImplementation(() => {
            return { endpoints: storedEndpoints };
        });
        const endpoints: Endpoint[] = await getEndpoints();

        expect(endpoints).toEqual([
            {
                url: "https://workspaces.openshift.com",
                active: false,
                readonly: true,
            },
            ...storedEndpoints,
        ]);
    });
});

describe("Test saveEndpoints()", () => {
    let savedEndpoints;
    beforeEach(() => {
        chrome.storage.sync.set.mockImplementation((data) => {
            savedEndpoints = data.endpoints;
        });
    });

    it("should not save the default endpoint", async () => {
        const inputEndpoints: Endpoint[] = [defaultEndpoint];
        await saveEndpoints(inputEndpoints);
        expect(savedEndpoints).toEqual([]);
    });

    it("should save the non-default endpoint", async () => {
        const inputEndpoints: Endpoint[] = [
            defaultEndpoint,
            { url: "https://url-1.com", active: false, readonly: false },
        ];
        await saveEndpoints(inputEndpoints);
        expect(savedEndpoints).toEqual([
            {
                url: "https://url-1.com",
                active: false,
                readonly: false,
            },
        ]);
    });

    it("should save the non-default endpoints", async () => {
        const inputEndpoints: Endpoint[] = [
            defaultEndpoint,
            { url: "https://url-1.com", active: false, readonly: false },
            { url: "https://url-2.com", active: false, readonly: false },
            { url: "https://url-3.com", active: false, readonly: false },
            { url: "https://url-4.com", active: false, readonly: false },
        ];
        await saveEndpoints(inputEndpoints);
        expect(savedEndpoints).toEqual([
            { url: "https://url-1.com", active: false, readonly: false },
            { url: "https://url-2.com", active: false, readonly: false },
            { url: "https://url-3.com", active: false, readonly: false },
            { url: "https://url-4.com", active: false, readonly: false },
        ]);
    });
});
