/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/

import { GitHubButtonInjector } from "./github/GitHubButtonInjector";
import { ButtonInjector } from "./ButtonInjector";

export class ButtonInjectorFactory {
    static getButtonInjector(): ButtonInjector | undefined {
        if (GitHubButtonInjector.matches()) {
            return new GitHubButtonInjector();
        }
        return undefined;
    }
}
