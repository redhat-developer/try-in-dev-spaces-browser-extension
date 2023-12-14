/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/

import React from "react";
import { usePopper } from "react-popper";
import { OPEN_OPTIONS } from "../../../messageActions";

import { Endpoint, getActiveEndpoint } from "../../../preferences/preferences";
import { getFactoryURL, getHostName } from "../util";
import { DropdownItem } from "./DropdownItem";
import { DropdownMenu, DropdownMenuDivider } from "./DropdownMenu";
import { EndpointDropdownItem } from "./EndpointDropdownItem";
import "./styles/github.css";

type Props = {
    endpoints: Endpoint[];
    projectURL: string;
    additionalClasses?: string[];
};

/**
 * GitHub button component with dropdown
 */
export const Button = (props: Props) => {
    const [dropdownBtn, _setDropdownBtn] =
        React.useState<HTMLButtonElement | null>(null);
    const [dropdownContent, setDropdownContent] =
        React.useState<HTMLUListElement | null>(null);
    const [showDropdown, setShowDropdown] = React.useState<boolean>(false);

    /**
     * Store dropdown button as reference to use in event listener
     */
    const dropdownBtnRef = React.useRef(dropdownBtn);
    const setDropdownBtn = (element: HTMLButtonElement) => {
        dropdownBtnRef.current = element;
        _setDropdownBtn(element);
    };

    React.useEffect(() => {
        const listener = (event: MouseEvent) => {
            if (event.target instanceof Element) {
                if (dropdownBtnRef.current?.contains(event.target)) {
                    setShowDropdown((prev) => !prev);
                } else {
                    setShowDropdown(false);
                }
            }
        };
        window.addEventListener("click", listener);
        return () => window.removeEventListener("click", listener);
    }, []);

    const { styles, attributes } = usePopper(dropdownBtn, dropdownContent, {
        placement: "bottom-end",
        modifiers: [
            {
                name: "offset",
                options: {
                    offset: [0, 2],
                },
            },
        ],
    });

    const dropdownMenu = showDropdown && (
        <DropdownMenu
            reference={setDropdownContent}
            style={styles.popper}
            attributes={attributes.popper}
        >
            {props.endpoints.map((endpoint: Endpoint) => {
                return (
                    <EndpointDropdownItem
                        endpoint={endpoint}
                        projectURL={props.projectURL}
                        key={endpoint.url}
                    />
                );
            })}

            <DropdownMenuDivider />

            <DropdownItem
                aria-label="Open the extension's options page in a separate tab"
                onClick={() => {
                    chrome.runtime.sendMessage({ action: OPEN_OPTIONS });
                }}
            >
                Configure
            </DropdownItem>
        </DropdownMenu>
    );

    const defaultEndpoint = getActiveEndpoint(props.endpoints);
    const defaultHostname = getHostName(defaultEndpoint);
    const { additionalClasses = [] } = props;

    return (
        <div className={["gh-btn-group"].concat(additionalClasses).join(' ')} id="try-in-web-ide-btn">
            <a
                className="gh-btn gh-btn-padding Button--primary btn-primary Button"
                href={getFactoryURL(props.projectURL, defaultEndpoint)}
                target="_blank"
                aria-label={
                    "Open the current project in a new tab on " +
                    defaultHostname
                }
                title={
                    "Open the current project in a new tab on " +
                    defaultHostname
                }
            >
                Dev Spaces
            </a>
            <button
                type="button"
                ref={setDropdownBtn}
                className="gh-btn btn-primary gh-dropdown-toggle gh-dropdown-toggle-split"
                aria-label="Toggle dropdown"
                title="Toggle dropdown"
            ></button>
            {dropdownMenu}
        </div>
    );
};
