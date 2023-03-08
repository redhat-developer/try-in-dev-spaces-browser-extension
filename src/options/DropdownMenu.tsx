/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/

import {
    Dropdown,
    DropdownItem,
    DropdownPosition,
    DropdownToggle,
} from "@patternfly/react-core/components/Dropdown";
import { useState } from "react";
import { EllipsisVIcon } from "@patternfly/react-icons/dist/js/icons/ellipsis-v-icon";

interface Props {
    onClickSetDefault: () => void;
    onClickDelete: () => void;
    isReadOnly: boolean;
    isDefault: boolean;
}

export const DropdownMenu = (props: Props) => {
    const [isOpen, setIsOpen] = useState(false);

    const onToggle = (isOpen: boolean) => {
        setIsOpen(isOpen);
    };

    const onSelect = () => {
        setIsOpen(false);
    };

    const dropdownItems = [
        <DropdownItem
            key="set-default"
            component="button"
            onClick={props.onClickSetDefault}
            isDisabled={props.isDefault}
        >
            Set default
        </DropdownItem>,
        <DropdownItem
            key="delete"
            component="button"
            onClick={props.onClickDelete}
            isDisabled={props.isReadOnly}
        >
            Delete
        </DropdownItem>,
    ];

    return (
        <Dropdown
            title="Toggle dropdown"
            className="pf-u-float-right"
            position={DropdownPosition.right}
            onSelect={onSelect}
            toggle={
                <DropdownToggle
                    toggleIndicator={null}
                    onToggle={onToggle}
                    aria-label="Actions"
                >
                    <EllipsisVIcon />
                </DropdownToggle>
            }
            isOpen={isOpen}
            dropdownItems={dropdownItems}
        />
    );
};
