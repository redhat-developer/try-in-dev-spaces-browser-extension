/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/

import { GitHubButtonInjector } from '../GitHubButtonInjector';

const preferencesMock = require('../../../../preferences/preferences');
import { createPopper } from '@popperjs/core';
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
    });

    it('should inject only the button when there is one configured endpoint', async () => {
        preferencesMock.__setEndpoints(
            [{ url: 'https://url-1.com', active: true, readonly: true }]
        );

        await githubService.inject();

        expect(preferencesMock.getEndpoints).toBeCalled();
        expect(createPopper).toBeCalledTimes(0);

        const expectedHTML = `
        <div class="file-navigation">
            <div id="try-in-web-ide-btn" class="gh-btn-group ml-2">
            <a
                href="https://url-1.com/#https://github.com/redhat-developer/try-in-web-ide-browser-extension"
                target="_blank"
                title="Open the project on https://url-1.com"
                class="gh-btn btn-primary"
                >Web IDE
            </a>
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
                    target="_blank" title="Open the project on https://url-1.com">Web IDE
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

        const expectedHTML = `
        <div class="file-navigation">
            <div class="gh-btn-group ml-2" id="try-in-web-ide-btn">
                <a class="gh-btn btn-primary"
                    href="https://url-2.com/#https://github.com/redhat-developer/try-in-web-ide-browser-extension"
                    target="_blank" title="Open the project on https://url-2.com">Web IDE
                </a>
                <button type="button" class="gh-btn btn-primary gh-dropdown-toggle gh-dropdown-toggle-split">
                </button>
                <ul class="gh-dropdown-menu">
                    <li class="gh-list-item">
                        <a class="gh-dropdown-item"
                            href="https://url-1.com/#https://github.com/redhat-developer/try-in-web-ide-browser-extension"
                            target="_blank" title="Open the project on https://url-1.com">Open with url-1.com
                        </a>
                    </li>
                    <li class="gh-list-item">
                        <a class="gh-dropdown-item"
                            href="https://url-2.com/#https://github.com/redhat-developer/try-in-web-ide-browser-extension"
                            target="_blank" title="Open the project on https://url-2.com">Open with url-2.com
                            <div class="gh-pill-badge">Default</div>
                        </a>
                    </li>
                    <li class="gh-list-item">
                        <a class="gh-dropdown-item"
                            href="https://url-3.com/#https://github.com/redhat-developer/try-in-web-ide-browser-extension"
                            target="_blank" title="Open the project on https://url-3.com">Open with url-3.com
                        </a>
                    </li>
                </ul>
            </div>
        </div>`

        expect(removeWhitespace(document.body.innerHTML))
            .toBe(removeWhitespace(expectedHTML));
    });

    it('should try to inject button on turbo:load', async () => {
        preferencesMock.__setEndpoints([
            { url: 'https://url-1.com', active: false, readonly: true }
        ]);

        document.querySelector = jest.fn().mockImplementation((query: string) => {
            const div = document.createElement('div');
            div.className = 'file-navigation';
            return div;
        })

        document.addEventListener = jest.fn().mockImplementationOnce((_, callback) => {
            // call the event listener function right away
            callback();
        });


        await githubService.inject();

        expect(document.addEventListener).toBeCalledWith('turbo:load', expect.any(Function));


        // In this case getEndpoints is called twice, once on
        // the initial injection, and another when injection happens
        // due to 'turbo:load' event.
        expect(getProjectURL).toBeCalledTimes(2);
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
