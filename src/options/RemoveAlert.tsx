/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/

import { Button } from "@patternfly/react-core/components/Button";
import { PropsWithChildren } from "react";
import { Modal } from "@patternfly/react-core";

interface Props {
    isOpen: boolean;
    handleModalToggle?: () => void;
    onClickRemove: () => void;
}

export const RemoveAlert = (props: PropsWithChildren<Props>) => {
    return (
        <Modal
            title="Confirm remove"
            isOpen={props.isOpen}
            onClose={props.handleModalToggle}
            actions={[
                <Button
                    key="confirm"
                    variant="danger"
                    onClick={props.onClickRemove}
                >
                    Remove
                </Button>,
                <Button
                    key="cancel"
                    variant="link"
                    onClick={props.handleModalToggle}
                >
                    Cancel
                </Button>,
            ]}
        >
            {props.children}
        </Modal>
    );
};
