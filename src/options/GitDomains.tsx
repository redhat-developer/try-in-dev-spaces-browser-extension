/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/

import { Fragment, useEffect, useState } from "react";

import "@patternfly/react-core/dist/styles/base.css";
import "@patternfly/patternfly/utilities/Spacing/spacing.css";
import "@patternfly/patternfly/utilities/Float/float.css";

import { getGitDomains, saveGitDomains } from "../preferences/preferences";
import { GitDomainList } from "./GitDomainList";
import { sanitizeUrl } from "./util";
import { FormUI } from "./FormUI";

export const GitDomains = () => {
    const [domains, setDomains] = useState<string[]>([]);

    useEffect(() => {
        updateDomains().then(checkPermissionsOnMount).catch(console.error);
    }, []);

    const checkPermissionsOnMount = async (domains) => {
        const newDomains = [];

        await Promise.all(
            domains.map(async (domain) => {
                let granted = await chrome.permissions.contains({
                    permissions: ["scripting"],
                    origins: [getOriginPattern(domain)],
                });
                if (!granted) {
                    granted = await promptPermissions(domain);
                }
                if (granted) {
                    newDomains.push(domain);
                }
            })
        );

        if (newDomains.length !== domains.length) {
            await saveGitDomains(newDomains);
            await updateDomains();
        }
    };

    const updateDomains = async () => {
        const domains = await getGitDomains();
        setDomains(domains);
        return domains;
    };

    const addNewDomain = async (newDomain: string) => {
        const sanitizedDomain = sanitizeUrl(newDomain);
        const granted = await promptPermissions(sanitizedDomain);

        if (!granted) {
            throw new Error(`Host permissions for ${newDomain} not granted`);
        }

        const newDomains = [...domains, sanitizedDomain];
        await saveGitDomains(newDomains);
        await updateDomains();
        return true;
    };

    const deleteDomain = async (domain: string) => {
        const removed = await removePermissions(domain);
        if (!removed) {
            return;
        }

        const newDomains = domains.filter((d) => d != domain);

        await saveGitDomains(newDomains);
        await updateDomains();
    };

    const promptPermissions = (domain: string) => {
        return chrome.permissions.request({
            permissions: ["scripting"],
            origins: [getOriginPattern(domain)],
        });
    };

    const removePermissions = (domain: string) => {
        return chrome.permissions.remove({
            origins: [getOriginPattern(domain)],
        });
    };

    const getOriginPattern = (domain: string) => {
        return domain + "/*";
    };

    const list = domains.length && (
        <GitDomainList domains={domains} onClickDelete={deleteDomain} />
    );

    return (
        <Fragment>
            {list || "No GitHub Enterprise domains added yet"}
            <FormUI
                onAdd={addNewDomain}
                textInputInvalidText={
                    "Provide the URL of your GitHub Enterprise instance, e.g.,\nhttps://github.example.com"
                }
                textInputAriaLabel="add github enterprise domain"
                textInputPlaceholder="Add GitHub Enterprise domain"
                addBtnAriaLabel="add github enterprise domain"
            />
        </Fragment>
    );
};
