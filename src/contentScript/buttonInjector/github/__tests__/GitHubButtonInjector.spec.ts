/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/

import ReactDOM from "react-dom/client";
import { GitHubButtonInjector } from "../GitHubButtonInjector";
import { getEndpoints } from "../../../../preferences/preferences";

const preferencesMock = require("../../../../preferences/preferences");

jest.mock("../../../../preferences/preferences");

jest.mock("../../util", () => ({
    ...jest.requireActual("../../util"),
    getProjectURL: jest.fn(() => {
        return "https://github.com/redhat-developer/try-in-web-ide-browser-extension";
    }),
}));

describe("Test GitHubButtonInjector.matches()", () => {

    afterEach(() => {
        jest.clearAllMocks();
        preferencesMock.reset();
    });

    it("should return true if div has 'Code' button", async () => {
        preferencesMock.setEndpoints([
            { url: "https://url-1.com", active: true, readonly: true },
        ]);

        jest.spyOn(document, "querySelector").mockImplementation(
            (_: string) => {
                const div = document.createElement("div");
                div.className = "file-navigation";
                const codeBtn = document.createElement("summary");
                codeBtn.className = "Button--primary Button--medium Button";
                codeBtn.setAttribute("aria-expanded", "false");
                codeBtn.innerText = "Code";
                div.appendChild(codeBtn);
                return div;
            }
        );
        expect(GitHubButtonInjector.matches()).toBe(true);
    });

    it("should return false if div has 'Code' button but missing aria-expanded attribute", async () => {
        preferencesMock.setEndpoints([
            { url: "https://url-1.com", active: true, readonly: true },
        ]);

        jest.spyOn(document, "querySelector").mockImplementation(
            (_: string) => {
                const div = document.createElement("div");
                div.className = "file-navigation";
                const codeBtn = document.createElement("summary");
                codeBtn.className = "Button--primary Button--medium Button";
                codeBtn.innerText = "Code";
                div.appendChild(codeBtn);
                return div;
            }
        );
        expect(GitHubButtonInjector.matches()).toBe(true);
    });


    it("should return false if div does not have 'Code' button", async () => {
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
        expect(GitHubButtonInjector.matches()).toBe(false);
    });

    it("should return false if div not found", async () => {
        preferencesMock.setEndpoints([
            { url: "https://url-1.com", active: true, readonly: true },
        ]);

        jest.spyOn(document, "querySelector").mockImplementation(
            (_: string) => {
                return null;
            }
        );
        expect(GitHubButtonInjector.matches()).toBe(false);
    });
});

describe("Inject button on GitHub project repo page", () => {
    let githubService: GitHubButtonInjector;

    beforeEach(() => {
        githubService = new GitHubButtonInjector();
    });

    afterEach(() => {
        jest.clearAllMocks();
        preferencesMock.reset();
    });

    it("should inject react element in .file-navigation div", async () => {
        preferencesMock.setEndpoints([
            { url: "https://url-1.com", active: true, readonly: true },
        ]);

        const fileNavigationDiv = document.createElement('div');
        const summary = document.createElement('summary');
        summary.innerText = 'Code';
        fileNavigationDiv.appendChild(summary);

        const appendChildMock = jest.spyOn(fileNavigationDiv, "appendChild")

        jest.spyOn(document, "querySelector").mockImplementation(
            (query: string) => {
                if (query === ".file-navigation") {
                    return fileNavigationDiv as any;
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
        
        const endpoints = await getEndpoints();
        await githubService.inject(endpoints);

        expect(createRootSpy).toBeCalledTimes(1);
        expect(mockRoot.render).toBeCalledTimes(1);
        expect(appendChildMock).toBeCalledTimes(1);
    });

    it("should inject react element in .bWpuBf div", async () => {
        preferencesMock.setEndpoints([
            { url: "https://url-1.com", active: true, readonly: true },
        ]);

        const bWpuBfDiv = document.createElement('div');
        const summary = document.createElement('button');
        summary.innerText = 'Code';
        bWpuBfDiv.appendChild(summary);

        const appendChildMock = jest.spyOn(bWpuBfDiv, "appendChild")

        jest.spyOn(document, "querySelector").mockImplementation(
            (query: string) => {
                if (query === ".bWpuBf") {
                    return bWpuBfDiv as any;
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
        
        const endpoints = await getEndpoints();
        await githubService.inject(endpoints);

        expect(createRootSpy).toBeCalledTimes(1);
        expect(mockRoot.render).toBeCalledTimes(1);
        expect(appendChildMock).toBeCalledTimes(1);
    });
});
