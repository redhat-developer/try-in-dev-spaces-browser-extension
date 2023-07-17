/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/

import { fireEvent, render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";

import { App } from "../App";

const preferencesMock = require("../../preferences/preferences");

jest.mock("../../preferences/preferences");

afterEach(() => {
    preferencesMock.reset();
});

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

it("should have the same number of endpoints as links in the endpoints list (2)", async () => {
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

it("should enable 'Add' button when a valid URL is entered in the input box", async () => {
    preferencesMock.setEndpoints([
        { url: "https://url-1.com", active: true, readonly: true },
    ]);

    const { findByPlaceholderText, findByText } = render(<App />);
    const inputBox = await findByPlaceholderText("Add endpoint");
    const endpointsTab = await screen.findByTestId("dev-spaces-endpoints-tab");
    const addButton = (await within(endpointsTab).findByText("Add")).closest(
        "button"
    );

    fireEvent.change(inputBox, {
        target: { value: "https://my-che-instance.che" },
    });
    expect(addButton.classList.contains("pf-m-disabled")).toBe(false);
});

it("should disable 'Add' button when invalid input is entered in the input box", async () => {
    preferencesMock.setEndpoints([
        { url: "https://url-1.com", active: true, readonly: true },
    ]);

    const { findByPlaceholderText, findByText } = render(<App />);
    const inputBox = await findByPlaceholderText("Add endpoint");
    const endpointsTab = await screen.findByTestId("dev-spaces-endpoints-tab");
    const addButton = (await within(endpointsTab).findByText("Add")).closest(
        "button"
    );

    fireEvent.change(inputBox, { target: { value: "    " } });
    expect(addButton.classList.contains("pf-m-disabled")).toBe(true);

    fireEvent.change(inputBox, { target: { value: "invalidtext" } });
    expect(addButton.classList.contains("pf-m-disabled")).toBe(true);

    fireEvent.change(inputBox, { target: { value: "123412341234" } });
    expect(addButton.classList.contains("pf-m-disabled")).toBe(true);
});

it("should display error message when invalid input is entered in the input box", async () => {
    const { findByPlaceholderText, findByText } = render(<App />);
    const inputBox = await findByPlaceholderText("Add endpoint");
    fireEvent.change(inputBox, { target: { value: "invalidtext" } });
    await findByText(
        "Provide the URL of your Dev Spaces installation, e.g.,\nhttps://devspaces.mycluster.example.com",
        { collapseWhitespace: false }
    );
});

it("should display error message when invalid input with invalid protocol is entered in the input box", async () => {
    const { findByPlaceholderText, findByText } = render(<App />);
    const inputBox = await findByPlaceholderText("Add endpoint");
    fireEvent.change(inputBox, { target: { value: "test://devspaces" } });
    await findByText(
        "Provide the URL of your Dev Spaces installation, e.g.,\nhttps://devspaces.mycluster.example.com",
        { collapseWhitespace: false }
    );
});
