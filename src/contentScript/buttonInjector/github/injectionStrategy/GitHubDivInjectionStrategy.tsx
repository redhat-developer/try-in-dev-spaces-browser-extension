/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/

import ReactDOM from "react-dom/client";

import { Endpoint } from "../../../../preferences/preferences";
import { GitHubButtonInjector } from "../GitHubButtonInjector";
import { Button } from "../Button";
import { getProjectURL } from "../../util";

export interface GitHubDiv {
    divClassSelector?: string;
    div?: HTMLElement;
}

/**
 * Injects the 'Dev Spaces' button into a div specified by divClassSelector
 */
export class GitHubDivInjectionStrategy {

    private githubDiv: GitHubDiv;
    private additionalBtnClasses: string[];

    constructor(githubDiv: GitHubDiv, additionalBtnClasses: string[]) {
        this.githubDiv = githubDiv;
        this.additionalBtnClasses = additionalBtnClasses;
    }

    /**
     * Injects the 'Dev Spaces' button into the file-navigation div.
     * @param endpoints array of Dev Spaces endpoints
     */
    public async inject(endpoints: Endpoint[]): Promise<void> {

        const ghElement = this.githubDiv.div ? this.githubDiv.div : document.querySelector(this.githubDiv.divClassSelector);
        if (!ghElement && this.githubDiv.divClassSelector) {
            throw new Error(
                `Could find element (${this.githubDiv.divClassSelector}) to inject button into.`
            );
        }

        const rootElement = document.createElement('div');
        rootElement.id = GitHubButtonInjector.BUTTON_ID;
        const root = ReactDOM.createRoot(rootElement);
        root.render(
            <Button endpoints={endpoints} projectURL={getProjectURL()} additionalClasses={this.additionalBtnClasses}/>
        );

        if (document.getElementById(GitHubButtonInjector.BUTTON_ID)) {
            return;
        }

        ghElement.appendChild(rootElement);
    }
}
