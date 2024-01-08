/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/

import ReactDOM from "react-dom/client";
import {
    Endpoint,
    getActiveEndpoint,
} from "../../../preferences/preferences";
import { ButtonInjector } from "../ButtonInjector";
import { getInjectionStrategy } from "./injectionStrategy/GitHubInjectionStrategy";

export class GitHubButtonInjector implements ButtonInjector {
    public static BUTTON_ID = "try-in-web-ide-btn";

    private root: ReactDOM.Root | undefined;

    /**
     * @returns true if current page is a GitHub page to inject the button to
     */
    public static matches(): boolean {
        return !!getInjectionStrategy();
    }

    public async inject(endpoints: Endpoint[]) {
        if (document.getElementById(GitHubButtonInjector.BUTTON_ID)) {
            return;
        }
        this.setActiveEndpointToFront(endpoints);
        await getInjectionStrategy()?.inject(endpoints)
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
