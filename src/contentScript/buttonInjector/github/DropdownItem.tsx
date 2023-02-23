/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/

import { PropsWithChildren } from "react";

interface Props {
    href?: string;
    onClick?: React.MouseEventHandler;
}

export const DropdownItem = (props: PropsWithChildren<Props>) => {
    return (
        <li className="gh-list-item">
            <a className="gh-dropdown-item" {...getAttributes(props)}>
                {props.children}
            </a>
        </li>
    );
};

const getAttributes = (props: Props): any => {
    const attr = {} as any;
    if (props.href) {
        attr.href = props.href;
    }
    if (props.onClick) {
        attr.onClick = props.onClick;
    }
    return attr;
};
