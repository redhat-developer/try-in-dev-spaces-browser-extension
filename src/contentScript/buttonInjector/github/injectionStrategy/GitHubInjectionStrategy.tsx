/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/

import { GitHubDivInjectionStrategy } from "./GitHubDivInjectionStrategy";

const fileNavigationClass = '.file-navigation';
const eLcVeeClass = '.bWpuBf';

/**
 * Returns a GitHubDivInjectionStrategy object that injects the 'Dev Spaces'
 * button for the following scenarios:
 * 
 * Scenario 1:
 * The 'Dev Spaces' button is to be injected into a class named 'file-navigation'.
 * The 'Code' button is a 'summary' element.
 * 
 * Scenario 2:
 * The 'Dev Spaces' button is to be injected into a class named 'bWpuBf'.
 * The 'Code' button is a 'button' element. 
 */
export function getInjectionStrategy(): GitHubDivInjectionStrategy | undefined {
    if (matches(fileNavigationClass, "summary")) {
        return new GitHubDivInjectionStrategy(fileNavigationClass, ['ml-2']);
    }

    if (matches(eLcVeeClass, "button")) {
        return new GitHubDivInjectionStrategy(eLcVeeClass, []);
    }
    return undefined;
}

/**
 * Returns true if the current web page has a classSelector element with a 'Code' button
 * as its descendant. 
 * @param classSelector The class of the div to check whether the 'Code' button exists within 
 * @param buttonTag  The HTML tag of the 'Code' button
 * @returns true if the current web page has a classSelector element with a 'Code' button
 */
function matches(classSelector: string, buttonTag: string): boolean {
    const actionBar = document.querySelector(
        classSelector
    );
    if (!actionBar) {
        return false;
    }
    return codeBtnExists(actionBar, buttonTag);
}

function codeBtnExists(element: Element, buttonTag: string): boolean {
    const btnList = element.getElementsByTagName(
        buttonTag
    );
    for (const btn of btnList) {
        if ((btn as HTMLElement).innerText.indexOf("Code") > -1) {
            return true;
        }
    }
    return false;
}
