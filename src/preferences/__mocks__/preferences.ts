/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/

import { Endpoint } from '../preferences';

let endpoints: Endpoint[] = []

module.exports = {
    ...(jest.requireActual('../preferences')),
    getEndpoints: jest.fn(async () => {
        return endpoints;
    }),
    setEndpoints(_endpoints: Endpoint[]) {
        endpoints = _endpoints;
    }
}
