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
import { RemoveAlert } from "./RemoveAlert";

export const GitDomains = () => {
    const [domains, setDomains] = useState<string[]>([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [domainToRemove, setDomainToRemove] = useState<string | undefined>(
        undefined
    );

    useEffect(() => {
        updateDomains().then(checkPermissionsOnMount).catch(console.error);
    }, []);

    const handleModalToggle = () => {
        setIsModalOpen(!isModalOpen);
    };

    /**
     * Check if permissions are granted for each domain on mount
     * @param domains
     */
    const checkPermissionsOnMount = async (domains) => {
        const newDomains = [];

        await Promise.all(
            domains.map(async (domain) => {
                let granted = await containsPermissions(domain);
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

    /**
     * Updates state and returns domains with the domains from storage
     * @returns the domains from storage
     */
    const updateDomains = async () => {
        const domains = await getGitDomains();
        setDomains(domains);
        return domains;
    };

    const addNewDomain = async (newDomain: string) => {
        const sanitizedDomain = sanitizeUrl(newDomain);
        if (domains.includes(sanitizedDomain)) {
            throw new Error(`Host permissions for ${newDomain} already granted`)
        }
        const granted = await promptPermissions(sanitizedDomain);

        if (!granted) {
            throw new Error(`Host permissions for ${newDomain} not granted`);
        }

        const newDomains = [...domains, sanitizedDomain];
        await saveGitDomains(newDomains);
        await updateDomains();
        return true;
    };

    const displayRemoveAlert = (domain: string) => {
        setDomainToRemove(domain);
        setIsModalOpen(true);
    };

    const removeDomain = async (domain: string) => {
        const removed = await removePermissions(domain);
        if (!removed) {
            return;
        }

        const newDomains = domains.filter((d) => d != domain);

        await saveGitDomains(newDomains);
        await updateDomains();
    };

    const promptPermissions = async (domain: string): Promise<boolean> => {
        return chrome.permissions.request({
            permissions: ["scripting"],
            origins: [getOriginPattern(domain)],
        });
    };

    const removePermissions = (domain: string): Promise<boolean> => {
        return chrome.permissions.remove({
            origins: [getOriginPattern(domain)],
        });
    };

    const containsPermissions = (domain: string): Promise<boolean> => {
        return chrome.permissions.contains({
            permissions: ["scripting"],
            origins: [getOriginPattern(domain)],
        });
    }

    const getOriginPattern = (domain: string) => {
        return domain + "/*";
    };

    const list = domains.length && (
        <GitDomainList domains={domains} onClickDelete={displayRemoveAlert} />
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

            <RemoveAlert
                isOpen={isModalOpen}
                handleModalToggle={handleModalToggle}
                onClickRemove={async () => {
                    await removeDomain(domainToRemove);
                    setDomainToRemove(undefined);
                    handleModalToggle();
                }}
            >
                {`Are you sure you want to remove "${domainToRemove}" from the list of GitHub Enterprise domains?`}
            </RemoveAlert>
        </Fragment>
    );
};
