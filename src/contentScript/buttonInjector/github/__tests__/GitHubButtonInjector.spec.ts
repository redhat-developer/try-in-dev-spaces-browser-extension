/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/

import { waitFor } from '@testing-library/react';
import ReactDOM from "react-dom/client";
import { GitHubButtonInjector } from "../GitHubButtonInjector";

const preferencesMock = require("../../../../preferences/preferences");

jest.mock("../../../../preferences/preferences");

jest.mock("../../util", () => ({
    ...jest.requireActual("../../util"),
    getProjectURL: jest.fn(() => {
        return "https://github.com/redhat-developer/try-in-web-ide-browser-extension";
    }),
}));

describe("Inject button on GitHub project repo page", () => {
    let githubService: GitHubButtonInjector;

    beforeEach(() => {
        githubService = new GitHubButtonInjector();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should inject react element", async () => {
        preferencesMock.setEndpoints([
            { url: "https://url-1.com", active: true, readonly: true },
        ]);

        const mockDiv = {
            appendChild: jest.fn(),
        };

        jest.spyOn(document, "querySelector").mockImplementation(
            (query: string) => {
                if (query === ".file-navigation") {
                    return mockDiv as any;
                }
            }
        );

        const mockRoot = {
            render: jest.fn(),
        };

        const createRootSpy = jest
            .spyOn(ReactDOM, "createRoot")
            .mockImplementation((_: any) => {
                return mockRoot as any;
            });

        await githubService.inject();

        expect(createRootSpy).toBeCalledTimes(1);
        expect(mockRoot.render).toBeCalledTimes(1);
        expect(mockDiv.appendChild).toBeCalledTimes(1);
    });

    it("should try to inject button on turbo:load", async () => {
        preferencesMock.setEndpoints([
            { url: "https://url-1.com", active: true, readonly: true },
        ]);

        jest.spyOn(document, "querySelector").mockImplementation(
            (_: string) => {
                const div = document.createElement("div");
                div.className = "file-navigation";
                return div;
            }
        );

        const mockRoot = {
            render: jest.fn(),
        };
        jest.spyOn(ReactDOM, "createRoot").mockImplementation((_: any) => {
            return mockRoot as any;
        });

        const addEventListenerSpy = jest.spyOn(document, "addEventListener");
        addEventListenerSpy.mockImplementationOnce(
            (event: string, callback) => {
                // call the event listener function right away
                (callback as EventListener)(new Event(event));
            }
        );

        await githubService.inject();

        expect(document.addEventListener).toBeCalledWith(
            "turbo:load",
            expect.any(Function)
        );

        // In this case render is called twice, once on
        // the initial injection, and another when injection happens
        // due to 'turbo:load' event.
        await waitFor(() => {
            expect(mockRoot.render).toBeCalledTimes(2)
        });
    });
});
