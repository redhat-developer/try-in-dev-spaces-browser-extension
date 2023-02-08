import { getCurrentEndpoint } from "../preferences";
import { GitService } from "./GitService";

export class GitHubService implements GitService {

    /**
     * @returns true if current page is a GitHub page to inject the button to
     */
    public static matches(): boolean {
        const actionBar = window.document.querySelector(".file-navigation");
        return !!actionBar;
    }

    public async injectButton() {
        const project = this.getProjectURL();
        const container = document.createElement('div');
        container.className = 'float-right';
        const link = window.document.createElement('a');

        const currentEndpoint = await getCurrentEndpoint();
        link.href = currentEndpoint.url + '/#' + project;
        link.target = '_blank';
        link.title = 'Open the project on ' + currentEndpoint.url;
        link.className = 'btn btn-primary ml-2'
        link.appendChild(window.document.createTextNode('Web IDE'));
        container.appendChild(link);

        const actionBar = window.document.querySelector('.file-navigation');
        const btnGroup = actionBar.getElementsByClassName('BtnGroup');
        if (btnGroup && btnGroup.length > 0 && btnGroup[0].classList.contains('float-right')) {
            actionBar.insertBefore(link, btnGroup[0]);
        } else {
            actionBar.appendChild(link);
        }
    }

    private getProjectURL() {
        const query = 'meta[property="og:url"]';
        const meta = window.document.querySelector(query);
        if (!meta) {
            throw new Error(`Could not determine project URL using query: ${query}.`)
        }
        return meta.getAttribute('content');
    }
}
