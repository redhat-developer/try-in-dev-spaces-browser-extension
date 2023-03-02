/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/

import { useEffect, useState } from "react";

import "@patternfly/react-core/dist/styles/base.css";
import "@patternfly/patternfly/utilities/Spacing/spacing.css";
import "@patternfly/patternfly/utilities/Float/float.css";

import {
    Button,
    Card,
    CardBody,
    Divider,
    Split,
    SplitItem,
    Form,
    FormGroup,
    TextInput,
    CardTitle,
} from "@patternfly/react-core";
import { ExclamationCircleIcon } from "@patternfly/react-icons";
import {
    Endpoint,
    getEndpoints,
    saveEndpoints,
} from "../preferences/preferences";
import { EndpointsList } from "./EndpointsList";
import "./styles/App.css";

export const App = () => {
    const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
    const [newEndpointUrl, setNewEndpointUrl] = useState<string>("");
    
    type validate = "success" | "error" | "default";
    const [newEndpointStatus, setNewEndpointStatus] = useState<validate>("default");

    useEffect(() => {
        const fetchData = async () => {
            const endpoints = await getEndpoints();
            setEndpoints(endpoints);
        };
        fetchData().catch(console.error);
    }, []);

    const handleNewEndpointUrlChange = (newUrl: string, _event: React.FormEvent<HTMLInputElement>) => {
        setNewEndpointUrl(newUrl);
        if (newUrl === "") {
          setNewEndpointStatus("default");
        } else if (isUrl(newUrl)) {
          setNewEndpointStatus("success");
        } else {
          setNewEndpointStatus("error");
        }
    };

    const isUrl = (str: string) => {
        try {
            new URL(str);
        } catch {
            return false;
        }
        return true;
    }

    const addNewEndpoint = async () => {
        const sanitizedEndpoint = sanitizeEndpoint(newEndpointUrl);
        const newEndpoints = endpoints.concat({
            url: sanitizedEndpoint,
            active: false,
            readonly: false,
        });
        await saveEndpoints(newEndpoints);
        await setEndpoints(newEndpoints);
        setNewEndpointUrl("");
        setNewEndpointStatus("default");
    };

    const sanitizeEndpoint = (str: string) => {
        let res = str;
        while (res.charAt(res.length - 1) === "/") {
            res = res.substring(0, res.length - 1);
        }
        return res;
    }

    const setDefault = async (endpoint: Endpoint) => {
        const newEndpoints = [...endpoints];
        newEndpoints.forEach((e) => {
            e.active = e == endpoint;
        });
        await saveEndpoints(newEndpoints);
        await setEndpoints(newEndpoints);
    };

    const deleteEndpoint = async (endpoint: Endpoint) => {
        const newEndpoints = endpoints.filter((e) => e != endpoint);
        await saveEndpoints(newEndpoints);
        await setEndpoints(newEndpoints);
    };

    const list = endpoints.length && (
        <EndpointsList
            endpoints={endpoints}
            onClickSetDefault={setDefault}
            onClickDelete={deleteEndpoint}
        />
    );

    return (
        <Card>
            <CardTitle>Dev Spaces endpoints</CardTitle>
            <CardBody>
                {list}
                <Divider className="pf-u-mt-md pf-u-mb-md" />
                <Split>
                    <SplitItem className="form-text-input">
                        <Form>
                            <FormGroup
                                validated={newEndpointStatus}
                                helperTextInvalid="The new endpoint must be a URL"
                                helperTextInvalidIcon={<ExclamationCircleIcon />}>
                                <TextInput
                                    type="text"
                                    aria-label="new endpoint"
                                    validated={newEndpointStatus}
                                    value={newEndpointUrl}
                                    placeholder="Add endpoint"
                                    onChange={handleNewEndpointUrlChange}
                                />
                            </FormGroup>
                        </Form>
                    </SplitItem>
                    <SplitItem className="form-fill" isFilled></SplitItem>
                    <SplitItem>
                        <Button variant="primary" onClick={addNewEndpoint} isDisabled={newEndpointUrl.length === 0 || newEndpointStatus === "error"}>
                            Add
                        </Button>
                    </SplitItem>
                </Split>
            </CardBody>
        </Card>
    );
};
