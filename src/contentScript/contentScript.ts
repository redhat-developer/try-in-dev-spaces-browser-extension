import { GitServiceFactory } from '../gitServices/GitServiceFactory';

try {
    GitServiceFactory.getGitService()?.injectButton();
} catch(e) {
    const message = e instanceof Error ? e.message : e;
    console.log(`try-in-web-ide-browser-extension error: ${message}`);
}
