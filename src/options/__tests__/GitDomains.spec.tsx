/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/

import { fireEvent, render, screen, within } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import "@testing-library/jest-dom";

import { App } from "../App";
import { chrome } from "jest-chrome";

const preferencesMock = require("../../preferences/preferences");

jest.mock("../../preferences/preferences");

beforeEach(() => {
    chrome.permissions.contains.mockImplementation(async () => {
        return true;
    });
});

afterEach(() => {
    jest.clearAllMocks();
});

it("renders correctly with one domain", async () => {
    preferencesMock.setGitDomains(["https://github.example.com"]);
    const { findByText, asFragment } = render(<App />);
    await findByText("https://github.example.com");
    expect(asFragment()).toMatchSnapshot();
});

it("renders correctly with multiple domains", async () => {
    preferencesMock.setGitDomains([
        "https://github.example-1.com",
        "https://github.example-2.com",
        "https://github.example-3.com",
    ]);
    const { findByText, asFragment } = render(<App />);
    await findByText("https://github.example-1.com");
    await findByText("https://github.example-2.com");
    await findByText("https://github.example-3.com");
    expect(asFragment()).toMatchSnapshot();
});

it("should have the same number of endpoints as links in the endpoints list (1)", async () => {
    preferencesMock.setGitDomains(["https://github.example-1.com"]);
    const { findByText, findByTestId } = render(<App />);
    await findByText("https://github.example-1.com");

    const list = await findByTestId("git-domains-list");
    expect(list.querySelectorAll("li").length).toEqual(1);
});

it("should have the same number of endpoints as links in the endpoints list (2)", async () => {
    preferencesMock.setGitDomains([
        "https://github.example-1.com",
        "https://github.example-2.com",
        "https://github.example-3.com",
    ]);
    const { findByText, findByTestId } = render(<App />);
    await findByText("https://github.example-1.com");
    await findByText("https://github.example-2.com");
    await findByText("https://github.example-3.com");

    const list = await findByTestId("git-domains-list");
    expect(list.querySelectorAll("li").length).toEqual(3);
});

it("should enable 'Add' button when a valid URL is entered in the input box", async () => {
    preferencesMock.setGitDomains(["https://github.example.com"]);

    const { findByPlaceholderText } = render(<App />);
    const inputBox = await findByPlaceholderText(
        "Add GitHub Enterprise domain"
    );
    const domainsTab = await screen.findByTestId("git-domains-tab");
    const addButton = (await within(domainsTab).findByText("Add")).closest(
        "button"
    );

    fireEvent.change(inputBox, {
        target: { value: "https://github.example.com" },
    });
    expect(addButton.classList.contains("pf-m-disabled")).toBe(false);
});

it("should disable 'Add' button when invalid input is entered in the input box", async () => {
    const { findByPlaceholderText } = render(<App />);
    const inputBox = await findByPlaceholderText(
        "Add GitHub Enterprise domain"
    );
    const endpointsTab = await screen.findByTestId("git-domains-tab");
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
    const inputBox = await findByPlaceholderText(
        "Add GitHub Enterprise domain"
    );
    fireEvent.change(inputBox, { target: { value: "invalidtext" } });
    await findByText(
        "Provide the URL of your GitHub Enterprise instance, e.g.,\nhttps://github.example.com",
        { collapseWhitespace: false }
    );
});

it("should display error message when invalid input with invalid protocol is entered in the input box", async () => {
    const { findByPlaceholderText, findByText } = render(<App />);
    const inputBox = await findByPlaceholderText(
        "Add GitHub Enterprise domain"
    );
    fireEvent.change(inputBox, {
        target: { value: "test://github.example.com" },
    });
    await findByText(
        "Provide the URL of your GitHub Enterprise instance, e.g.,\nhttps://github.example.com",
        { collapseWhitespace: false }
    );
});

it("should display alert when host permissions already granted", async () => {
    const { findByPlaceholderText, findByText } = render(<App />);
    const inputBox = await findByPlaceholderText(
        "Add GitHub Enterprise domain"
    );
    const domainsTab = await screen.findByTestId("git-domains-tab");
    const addButton = (await within(domainsTab).findByText("Add")).closest(
        "button"
    );

    fireEvent.change(inputBox, {
        target: { value: "https://github.example.com" },
    });

    await act(() => {
        addButton.click();
    });

    await findByText(
        "Host permissions for https://github.example.com already granted"
    );
});

it("should remove host permission when git domain is removed", async () => {
    preferencesMock.setGitDomains(["https://github.example.com"]);

    const { findByText, findByLabelText } = render(<App />);
    const deleteButton = await findByLabelText(
        "Remove GitHub Enterprise domain https://github.example.com"
    );
    await act(() => {
        deleteButton.click();
    });

    const confirmRemoveBtn = await findByText("Remove");
    await act(() => {
        confirmRemoveBtn.click();
    });

    expect(chrome.permissions.remove).toHaveBeenCalledTimes(1);
});
