/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/

import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

import { App } from "../App";

const preferencesMock = require("../../preferences/preferences");

jest.mock("../../preferences/preferences");

it("renders correctly with one endpoint", async () => {
    preferencesMock.setEndpoints([
        { url: "https://url-1.com", active: true, readonly: true },
    ]);
    const { findByText, asFragment } = render(<App />);
    await findByText("https://url-1.com");
    expect(asFragment()).toMatchSnapshot();
});

it("renders correctly with multiple endpoints", async () => {
    preferencesMock.setEndpoints([
        { url: "https://url-1.com", active: true, readonly: true },
        { url: "https://url-2.com", active: false, readonly: false },
        { url: "https://url-3.com", active: false, readonly: false },
    ]);
    const { findByText, asFragment } = render(<App />);
    await findByText("https://url-1.com");
    await findByText("https://url-2.com");
    await findByText("https://url-3.com");
    expect(asFragment()).toMatchSnapshot();
});

it("should have the same number of endpoints as links in the endpoints list (1)", async () => {
    preferencesMock.setEndpoints([
        { url: "https://url-1.com", active: true, readonly: true },
    ]);
    const { findByText, findByTestId } = render(<App />);
    await findByText("https://url-1.com");

    const list = await findByTestId("endpoints-list");
    expect(list.querySelectorAll("li").length).toEqual(1);
});

it("should have the same number of endpoints as links in the endpoints list (3)", async () => {
    preferencesMock.setEndpoints([
        { url: "https://url-1.com", active: true, readonly: true },
        { url: "https://url-2.com", active: false, readonly: false },
        { url: "https://url-3.com", active: false, readonly: false },
    ]);
    const { findByText, findByTestId } = render(<App />);
    await findByText("https://url-1.com");
    await findByText("https://url-2.com");
    await findByText("https://url-3.com");

    const list = await findByTestId("endpoints-list");
    expect(list.querySelectorAll("li").length).toEqual(3);
});

it("has same number of endpoints as links in the endpoints list (3)", async () => {
    preferencesMock.setEndpoints([
        { url: "https://url-1.com", active: true, readonly: true },
        { url: "https://url-2.com", active: false, readonly: false },
        { url: "https://url-3.com", active: false, readonly: false },
    ]);
    const { findByText, findByTestId } = render(<App />);
    await findByText("https://url-1.com");
    await findByText("https://url-2.com");
    await findByText("https://url-3.com");

    const list = await findByTestId("endpoints-list");
    expect(list.querySelectorAll("li")).toHaveLength(3);
});

it("should have only one default label", async () => {
    preferencesMock.setEndpoints([
        { url: "https://url-1.com", active: true, readonly: true },
        { url: "https://url-2.com", active: false, readonly: false },
        { url: "https://url-3.com", active: false, readonly: false },
    ]);
    const { findAllByText } = render(<App />);
    const items = await findAllByText("Default");
    expect(items).toHaveLength(1);
});
