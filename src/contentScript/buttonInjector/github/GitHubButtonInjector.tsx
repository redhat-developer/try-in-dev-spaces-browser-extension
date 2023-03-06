/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/

import ReactDOM from "react-dom/client";
import {
    Endpoint,
    getActiveEndpoint,
    getEndpoints,
} from "../../../preferences/preferences";
import { ButtonInjector } from "../ButtonInjector";
import { getProjectURL } from "../util";
import { Button } from "./Button";

export class GitHubButtonInjector implements ButtonInjector {
    private static BUTTON_ID = "try-in-web-ide-btn";
    private static GITHUB_ELEMENT = ".file-navigation";

    private root: ReactDOM.Root | undefined;

    /**
     * @returns true if current page is a GitHub page to inject the button to
     */
    public static matches(): boolean {
        const actionBar = document.querySelector(
            GitHubButtonInjector.GITHUB_ELEMENT
        );
        
        if (!actionBar) {
            return false;
        }

        return this.codeBtnExists(actionBar);
    }

    private static codeBtnExists(element: Element): boolean {
        const btnList = element.getElementsByClassName("btn-primary btn");
        for (const btn of btnList) {
            if ((btn as HTMLElement).innerText.indexOf("Code") > -1) {
                return true;
            }
        }
        return false;
    }

    public async inject() {
        await this._inject();

        // GitHub uses Turbo to load the project repo's `Code`, `Issues`, `Pull requests`,
        // `Actions`, etc. pages. In case the user clicks from a non-Code page to the Code
        // page, try to inject button.
        document.addEventListener("turbo:load", () => {
            if (GitHubButtonInjector.matches()) {
                this._inject();
            } else if (this.root) {
                this.root.unmount();
                this.root = undefined;
            }
        });
    }

    private async _inject() {
        if (document.getElementById(GitHubButtonInjector.BUTTON_ID)) {
            return;
        }

        const { ghElement, endpoints, projectURL } = await this.prepare();

        const rootElement = document.createElement("div");
        rootElement.id = GitHubButtonInjector.BUTTON_ID;
        this.root = ReactDOM.createRoot(rootElement);
        this.root.render(<Button endpoints={endpoints} projectURL={projectURL} />);
        ghElement.appendChild(rootElement);
    }

    private async prepare(): Promise<{
        ghElement: Element;
        projectURL: string;
        endpoints: Endpoint[];
    }> {
        const ghElement = document.querySelector(
            GitHubButtonInjector.GITHUB_ELEMENT
        );
        if (!ghElement) {
            throw new Error(
                `Could find element (${GitHubButtonInjector.GITHUB_ELEMENT}) to inject button into.`
            );
        }

        const projectURL = getProjectURL();
        if (!projectURL) {
            throw new Error("Could not detect project URL.");
        }

        const endpoints = await getEndpoints();
        this.setActiveEndpointToFront(endpoints);

        return { ghElement, endpoints, projectURL };
    }

    private setActiveEndpointToFront(endpoints: Endpoint[]) {
        const active = getActiveEndpoint(endpoints);
        endpoints.splice(
            endpoints.findIndex((e) => e.active),
            1
        );
        endpoints.unshift(active);
    }
}
