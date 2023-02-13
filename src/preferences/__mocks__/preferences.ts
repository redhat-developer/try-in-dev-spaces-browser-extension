import { Endpoint } from '../preferences';

let endpoints: Endpoint[] = []

export function __setEndpoints(_endpoints: Endpoint[]) {
    endpoints = _endpoints;
}

export const getCurrentEndpoint = jest.fn(async () => {
    return endpoints.find(endpoint => endpoint.active);
});

export const getEndpoints = jest.fn(async () => {
    return endpoints;
});
