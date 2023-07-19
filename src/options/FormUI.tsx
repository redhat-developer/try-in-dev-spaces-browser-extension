/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/

import { Fragment, useState } from "react";

import "@patternfly/react-core/dist/styles/base.css";
import "@patternfly/patternfly/utilities/Spacing/spacing.css";
import "@patternfly/patternfly/utilities/Float/float.css";

import { Button } from "@patternfly/react-core/components/Button";
import { Divider } from "@patternfly/react-core/components/Divider";
import { Split, SplitItem } from "@patternfly/react-core/layouts/Split";
import { Form, FormGroup } from "@patternfly/react-core/components/Form";
import { TextInput } from "@patternfly/react-core/components/TextInput";
import { ExclamationCircleIcon } from "@patternfly/react-icons/dist/js/icons/exclamation-circle-icon";
import { Alert, AlertActionCloseButton } from "@patternfly/react-core";

interface Props {
    onAdd: (str: string) => Promise<boolean>;
    textInputInvalidText: string;
    textInputAriaLabel: string;
    textInputPlaceholder: string;
    addBtnAriaLabel: string;
}

export const FormUI = (props: Props) => {
    const [newUrl, setNewUrl] = useState<string>("");
    const [displayAlert, setDisplayAlert] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>("");

    type validate = "error" | "default";
    const [newUrlStatus, setNewUrlStatus] = useState<validate>("default");

    const handleNewUrlChange = (
        newUrl: string,
        _event: React.FormEvent<HTMLInputElement>
    ) => {
        setNewUrl(newUrl);
        if (!isUrl(newUrl)) {
            setNewUrlStatus("error");
        } else {
            setNewUrlStatus("default");
        }
    };

    const isUrl = (str: string) => {
        let url;
        try {
            url = new URL(str);
        } catch {
            return false;
        }

        if (url.protocol !== "http:" && url.protocol !== "https:") {
            return false;
        }
        return true;
    };

    const addBtnClicked = async () => {
        try {
            const success = await props.onAdd(newUrl.trim());
            if (success) {
                setNewUrl("");
                setNewUrlStatus("default");
                closeErrorMessage();
                return;
            }
        } catch (e) {
            displayErrorMessage(e.message);
        }
    };

    const displayErrorMessage = (message: string) => {
        setAlertMessage(message);
        setDisplayAlert(true);
    };

    const closeErrorMessage = () => {
        setAlertMessage("");
        setDisplayAlert(false);
    };

    const helperTextInvalid = (
        <Split className="pf-u-mt-xs">
            <SplitItem>
                <ExclamationCircleIcon
                    color="var(--pf-global--danger-color--100)"
                    className="pf-u-mr-xs"
                />
            </SplitItem>
            <SplitItem>
                <div className="pf-c-form__helper-text pf-m-error new-line">
                    {props.textInputInvalidText}
                </div>
            </SplitItem>
        </Split>
    );

    const errorAlert = displayAlert && alertMessage && (
        <Alert
            isInline
            variant="danger"
            title={alertMessage}
            actionClose={<AlertActionCloseButton onClose={closeErrorMessage} />}
        />
    );

    return (
        <Fragment>
            <Divider className="pf-u-mt-md pf-u-mb-md" />
            <Split>
                <SplitItem className="form-text-input">
                    <Form>
                        <FormGroup
                            validated={newUrlStatus}
                            helperTextInvalid={helperTextInvalid}
                            helperTextInvalidIcon={<ExclamationCircleIcon />}
                        >
                            <TextInput
                                type="text"
                                aria-label={props.textInputAriaLabel}
                                validated={newUrlStatus}
                                value={newUrl}
                                placeholder={props.textInputPlaceholder}
                                onChange={handleNewUrlChange}
                            />
                        </FormGroup>
                    </Form>
                </SplitItem>
                <SplitItem className="form-fill" isFilled></SplitItem>
                <SplitItem>
                    <Button
                        variant="primary"
                        onClick={addBtnClicked}
                        aria-label={props.addBtnAriaLabel}
                        isDisabled={
                            newUrl.length === 0 || newUrlStatus === "error"
                        }
                    >
                        Add
                    </Button>
                </SplitItem>
            </Split>
            {errorAlert}
        </Fragment>
    );
};
