/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/

import { GitHubButtonInjector } from '../GitHubButtonInjector';

const preferencesMock = require('../../../../preferences/preferences');
import { createPopper } from '@popperjs/core';
import { chrome } from 'jest-chrome'
import { getProjectURL } from '../../util';

jest.mock('../../../../preferences/preferences')

jest.mock('../../util', () => ({
    ...(jest.requireActual('../../util')),
    getProjectURL: jest.fn(() => {
        return 'https://github.com/redhat-developer/try-in-web-ide-browser-extension';
    })
}));

jest.mock('@popperjs/core', () => ({
    createPopper: jest.fn(() => undefined),
}));

describe('Inject button on GitHub project repo page', () => {

    let githubService: GitHubButtonInjector;

    beforeEach(() => {
        document.body.innerHTML = `
        <body>
            <div class='file-navigation'>
            </div>
        </body>`
        githubService = new GitHubButtonInjector();
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should inject only the button when there is one configured endpoint', async () => {
        preferencesMock.__setEndpoints(
            [{ url: 'https://url-1.com', active: true, readonly: true }]
        );

        await githubService.inject();

        expect(preferencesMock.getEndpoints).toBeCalled();
        expect(createPopper).toBeCalled();

        const expectedHTML = `
        <div class=\"file-navigation\">
            <div class=\"gh-btn-group ml-2\" id=\"try-in-web-ide-btn\"><a class=\"gh-btn btn-primary\"
                    href=\"https://url-1.com/#https://github.com/redhat-developer/try-in-web-ide-browser-extension\"
                    target=\"_blank\" title=\"Open the project on https://url-1.com\">Dev Spaces</a><button type=\"button\"
                    class=\"gh-btn btn-primary gh-dropdown-toggle gh-dropdown-toggle-split\"></button>
                <ul class=\"gh-dropdown-menu\">
                    <li class=\"gh-list-item\"><a class=\"gh-dropdown-item\"
                            href=\"https://url-1.com/#https://github.com/redhat-developer/try-in-web-ide-browser-extension\"
                            target=\"_blank\" title=\"Open the project on https://url-1.com\">Open with url-1.com<div
                                class=\"gh-pill-badge\">Default</div></a></li>
                    <li>
                        <hr class=\"gh-dropdown-divider\">
                    </li>
                    <li class=\"gh-list-item\"><a class=\"gh-dropdown-item\">Configure</a></li>
                </ul>
            </div>
        </div>`

        expect(removeWhitespace(document.body.innerHTML))
            .toBe(removeWhitespace(expectedHTML));
    });

    it('should inject button and dropdown when there are multiple configured endpoints', async () => {
        preferencesMock.__setEndpoints([
            { url: 'https://url-1.com', active: true, readonly: true },
            { url: 'https://url-2.com', active: false, readonly: false },
            { url: 'https://url-3.com', active: false, readonly: false }
        ]);

        await githubService.inject();

        expect(preferencesMock.getEndpoints).toBeCalled();
        expect(createPopper).toBeCalled();

        const expectedHTML = `
        <div class="file-navigation">
            <div class="gh-btn-group ml-2" id="try-in-web-ide-btn">
                <a class="gh-btn btn-primary"
                    href="https://url-1.com/#https://github.com/redhat-developer/try-in-web-ide-browser-extension"
                    target="_blank" title="Open the project on https://url-1.com">Dev Spaces
                </a>
                <button type="button" class="gh-btn btn-primary gh-dropdown-toggle gh-dropdown-toggle-split">
                </button>
                <ul class="gh-dropdown-menu">
                    <li class="gh-list-item">
                        <a class="gh-dropdown-item"
                            href="https://url-1.com/#https://github.com/redhat-developer/try-in-web-ide-browser-extension"
                            target="_blank" title="Open the project on https://url-1.com">Open with url-1.com
                            <div class="gh-pill-badge">Default</div>
                        </a>
                    </li>
                    <li class="gh-list-item">
                        <a class="gh-dropdown-item"
                            href="https://url-2.com/#https://github.com/redhat-developer/try-in-web-ide-browser-extension"
                            target="_blank" title="Open the project on https://url-2.com">Open with url-2.com
                        </a>
                    </li>
                    <li class="gh-list-item">
                        <a class="gh-dropdown-item"
                            href="https://url-3.com/#https://github.com/redhat-developer/try-in-web-ide-browser-extension"
                            target="_blank" title="Open the project on https://url-3.com">Open with url-3.com
                        </a>
                    </li>
                    <li>
                        <hr class=\"gh-dropdown-divider\">
                    </li>
                    <li class=\"gh-list-item\"><a class=\"gh-dropdown-item\">Configure</a></li>
                </ul>
            </div>
        </div>`

        expect(removeWhitespace(document.body.innerHTML))
            .toBe(removeWhitespace(expectedHTML));
    });

    it('should change the href of the button to the active endpoint', async () => {
        preferencesMock.__setEndpoints([
            { url: 'https://url-1.com', active: false, readonly: true },
            { url: 'https://url-2.com', active: true, readonly: false },
            { url: 'https://url-3.com', active: false, readonly: false }
        ]);

        await githubService.inject();

        expect(preferencesMock.getEndpoints).toBeCalled();
        expect(createPopper).toBeCalled();

        const button = document.body.querySelector('a.gh-btn') as HTMLAnchorElement;
        expect(button).not.toBeNull();
        expect(button.href).toEqual('https://url-2.com/#https://github.com/redhat-developer/try-in-web-ide-browser-extension')
    });

    it('should display the active endpoint at the top of the dropdown', async () => {
        preferencesMock.__setEndpoints([
            { url: 'https://url-1.com', active: false, readonly: true },
            { url: 'https://url-2.com', active: true, readonly: false }, // active endpoint
            { url: 'https://url-3.com', active: false, readonly: false }
        ]);

        await githubService.inject();

        expect(preferencesMock.getEndpoints).toBeCalled();
        expect(createPopper).toBeCalled();

        const dropdown = document.body.querySelector('ul.gh-dropdown-menu') as HTMLUListElement;
        expect(dropdown).not.toBeNull();

        // check the href of the first dropdown item is the active endpoint
        const item = (dropdown.childNodes[0] as Element).querySelector('a.gh-dropdown-item') as HTMLAnchorElement;
        expect(item).not.toBeNull();
        expect(item.href).toEqual('https://url-2.com/#https://github.com/redhat-developer/try-in-web-ide-browser-extension');

        // check that the default badge exists
        const badge = item.querySelector('div.gh-pill-badge');
        expect(badge).not.toBeNull();
        expect(badge.innerHTML).toEqual('Default');
    });

    it('should try to inject button on turbo:load', async () => {
        preferencesMock.__setEndpoints([
            { url: 'https://url-1.com', active: true, readonly: true }
        ]);

        jest.spyOn(document, 'querySelector').mockImplementation((_: string) => {
            const div = document.createElement('div');
            div.className = 'file-navigation';
            return div;
        });

        const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
        addEventListenerSpy.mockImplementationOnce((event: string, callback) => {
            // call the event listener function right away
            (callback as EventListener)(new Event(event));
        });

        await githubService.inject();

        expect(addEventListenerSpy).toBeCalledWith('turbo:load', expect.any(Function));

        // In this case getProjectURL is called twice, once on
        // the initial injection, and another when injection happens
        // due to 'turbo:load' event.
        expect(getProjectURL).toBeCalledTimes(2);
    });

    it('should send message to open options page when configure button is clicked', async () => {
        preferencesMock.__setEndpoints(
            [{ url: 'https://url-1.com', active: true, readonly: true }]
        );

        await githubService.inject();

        const dropdownItems = document.body.querySelector('ul.gh-dropdown-menu');
        expect(dropdownItems).not.toBeNull();

        const configureBtn = dropdownItems.lastChild.firstChild as HTMLAnchorElement;
        expect(configureBtn.innerHTML).toEqual('Configure');
        
        // click the configure button
        configureBtn.onclick(new MouseEvent('click'));
        expect(chrome.runtime.sendMessage).toBeCalledWith({'action': 'openOptionsPage'});
    });

    function removeWhitespace(html: string) {
        return html.trim()
            .replace(/\s\s+/g, ' ')
            .replace(/<\s/g, '<')
            .replace(/\s>/g, '>')
            .replace(/>\s/g, '>')
            .replace(/\s</g, '<');
    }
});
