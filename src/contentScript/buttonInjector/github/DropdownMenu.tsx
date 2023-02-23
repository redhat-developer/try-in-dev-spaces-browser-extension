/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/

import { LegacyRef, PropsWithChildren } from "react";

/**
 * Props needed for PopperJs
 */
interface Props {
    reference: LegacyRef<HTMLUListElement>;
    style: React.CSSProperties;
    attributes: { [key: string]: string };
}

export const DropdownMenu = (props: PropsWithChildren<Props>) => {
    return (
        <ul
            className="gh-dropdown-menu"
            data-testid="dropdown-menu"
            ref={props.reference}
            style={props.style}
            {...props.attributes}
        >
            {props.children}
        </ul>
    );
};

export const DropdownMenuDivider = () => {
    return (
        <li>
            <hr className="gh-dropdown-divider" />
        </li>
    );
};
