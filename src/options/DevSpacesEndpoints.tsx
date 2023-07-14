/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/

import { Fragment, useEffect, useState } from "react";

import {
    Endpoint,
    getEndpoints,
    saveEndpoints,
} from "../preferences/preferences";
import { EndpointsList } from "./EndpointsList";
import { sanitizeUrl } from "./util";
import { FormUI } from "./FormUI";

export const DevSpacesEndpoints = () => {
    const [endpoints, setEndpoints] = useState<Endpoint[]>([]);

    useEffect(() => {
        updateEndpoints().catch(console.error);
    }, []);

    const updateEndpoints = async () => {
        const endpoints = await getEndpoints();
        setEndpoints(endpoints);
    };

    const addNewEndpoint = async (newEndpointUrl: string) => {
        const sanitizedEndpoint = sanitizeUrl(newEndpointUrl);
        const newEndpoints = endpoints.concat({
            url: sanitizedEndpoint,
            active: false,
            readonly: false,
        });
        await saveEndpoints(newEndpoints);
        await updateEndpoints();
        return true;
    };

    const setDefault = async (endpoint: Endpoint) => {
        const newEndpoints = [...endpoints];
        newEndpoints.forEach((e) => {
            e.active = e == endpoint;
        });
        await saveEndpoints(newEndpoints);
        await updateEndpoints();
    };

    const deleteEndpoint = async (endpoint: Endpoint) => {
        const newEndpoints = endpoints.filter((e) => e != endpoint);
        await saveEndpoints(newEndpoints);
        await updateEndpoints();
    };

    const list = endpoints.length && (
        <EndpointsList
            endpoints={endpoints}
            onClickSetDefault={setDefault}
            onClickDelete={deleteEndpoint}
        />
    );

    return (
        <Fragment>
            {list || "No endpoints added yet"}
            <FormUI
                onAdd={addNewEndpoint}
                textInputInvalidText={
                    "Provide the URL of your Dev Spaces installation, e.g.,\nhttps://devspaces.mycluster.example.com"
                }
                textInputAriaLabel="new endpoint"
                textInputPlaceholder="Add endpoint"
                addBtnAriaLabel="add endpoint"
            />
        </Fragment>
    );
};
