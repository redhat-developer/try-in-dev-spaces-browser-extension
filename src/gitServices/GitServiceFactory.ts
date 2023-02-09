/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/

import { GitHubService } from "./github/GitHubService";
import { GitService } from "./GitService";

export class GitServiceFactory {
    static getGitService(): GitService | undefined {
        if (GitHubService.matches()) {
            return new GitHubService();
        }
        return undefined;
    }
}
