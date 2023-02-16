/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/

import { Endpoint, getEndpoints } from "../../../preferences/preferences";
import { ButtonInjector } from "../ButtonInjector";
import { getFactoryUrl, getHostName, getProjectURL } from "../util";
import { createPopper } from "@popperjs/core";
import "./github.css";
import { OPEN_OPTIONS } from '../../../backgroundScript/backgroundScript';

export class GitHubButtonInjector implements ButtonInjector {
    private static BUTTON_ID = "try-in-web-ide-btn";

    /**
     * @returns true if current page is a GitHub page to inject the button to
     */
    public static matches(): boolean {
        const actionBar = document.querySelector(".file-navigation");
        return !!actionBar;
    }

    public async inject() {
        await this._inject();

        // GitHub uses Turbo to load the project repo's `Code`, `Issues`, `Pull requests`,
        // `Actions`, etc. pages. In case the user clicks from a non-Code page to the Code
        // page, try to inject button.
        document.addEventListener("turbo:load", () => {
            if (GitHubButtonInjector.matches()) {
                this._inject();
            }
        });
    }

    private async _inject() {
        if (document.getElementById(GitHubButtonInjector.BUTTON_ID)) {
            return;
        }

        const actionBar = document.querySelector(".file-navigation");
        const project = getProjectURL();
        const endpoints = await getEndpoints();
        this.injectButtonDropdown(actionBar, project, endpoints);
    }

    /**
     * @param element the DOM element to inject the button into
     * @param projectUrl the project url
     * @param endpoints the configured Dev Spaces endpoints
     */
    private injectButtonDropdown(
        element: Element,
        projectUrl: string,
        endpoints: Endpoint[]
    ) {
        const btnGroup = document.createElement("div");
        btnGroup.className = "gh-btn-group ml-2";
        btnGroup.id = GitHubButtonInjector.BUTTON_ID;

        const btn = document.createElement("a");
        btn.className = "gh-btn btn-primary";
        const activeEndpoint = endpoints.find((endpoint) => endpoint.active);
        btn.href = activeEndpoint.url + "/#" + projectUrl;
        btn.target = "_blank";
        btn.title = "Open the project on " + activeEndpoint.url;
        btn.appendChild(document.createTextNode("Dev Spaces"));
        btnGroup.appendChild(btn);

        const dropdownBtn = document.createElement("button");
        dropdownBtn.type = "button";
        dropdownBtn.className =
            "gh-btn btn-primary gh-dropdown-toggle gh-dropdown-toggle-split";
        btnGroup.appendChild(dropdownBtn);

        const dropdownContent = document.createElement("ul");
        dropdownContent.className = "gh-dropdown-menu";

        this.setActiveEndpointToFront(endpoints);
        endpoints.forEach((e) => {
            dropdownContent.appendChild(
                this.createEndpiontListItem(projectUrl, e)
            );
        });
        dropdownContent.appendChild(
            this.createDivider()
        );

        dropdownContent.appendChild(this.createConfigureItem());

        btnGroup.appendChild(dropdownContent);
        element.appendChild(btnGroup);

        this.setUpDropdown(dropdownBtn, dropdownContent);
    }

    private setActiveEndpointToFront(endpoints: Endpoint[]) {
        const active = endpoints.find(e => e.active);
        if (!active) {
            throw new Error('No endpoint is selected in the extension options.')
        }
        endpoints.splice(endpoints.findIndex(e => e.active), 1);
        endpoints.unshift(active);
    }

    private createEndpiontListItem(projectUrl: string, endpoint: Endpoint) {
        const li = document.createElement("li");
        const a = document.createElement("a");

        li.className = "gh-list-item";
        a.className = "gh-dropdown-item";
        a.href = getFactoryUrl(projectUrl, endpoint);
        a.target = "_blank";
        a.title = "Open the project on " + endpoint.url;
        const hostname = getHostName(endpoint);
        a.appendChild(document.createTextNode(`Open with ${hostname}`));

        if (endpoint.active) {
            const pill = document.createElement("div");
            pill.className = "gh-pill-badge";
            pill.appendChild(document.createTextNode("Default"));
            a.appendChild(pill);
        }

        li.append(a);
        return li;
    }

    private createDivider() {
        const li = document.createElement("li");
        const hr = document.createElement("hr");
        hr.className = "gh-dropdown-divider";
        li.appendChild(hr);
        return li;
    }

    private createConfigureItem() {
        const li = document.createElement("li");
        li.className = "gh-list-item";
        const a = document.createElement("a");
        a.className = "gh-dropdown-item";
        a.appendChild(document.createTextNode("Configure"));
        a.onclick = () => {
            chrome.runtime.sendMessage({action: OPEN_OPTIONS});
        }
        li.appendChild(a);
        return li;
    }

    private setUpDropdown(btn: Element, content: HTMLElement) {
        const popperInstance = createPopper(btn, content, {
            placement: "bottom-end",
            modifiers: [
                {
                    name: "offset",
                    options: {
                        offset: [0, 2],
                    },
                },
            ],
        });

        document.body.addEventListener("click", (event) => {
            if (event.target instanceof Element) {
                if (btn.contains(event.target)) {
                    if (content.hasAttribute("data-show")) {
                        content.removeAttribute("data-show");
                    } else {
                        content.setAttribute("data-show", "");
                        popperInstance.update();
                    }
                } else {
                    content.removeAttribute("data-show");
                }
            }
        });
    }
}
