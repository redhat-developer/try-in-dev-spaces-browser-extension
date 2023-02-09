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
