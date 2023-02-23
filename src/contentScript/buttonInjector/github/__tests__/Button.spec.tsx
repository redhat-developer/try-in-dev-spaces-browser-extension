/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/

import { act } from "react-dom/test-utils";
import { render, screen, waitFor, getAllByRole } from "@testing-library/react";
import "@testing-library/jest-dom";

import { Button } from "../Button";

const projectURL = "https://github.com/redhat-developer/try-in-dev-spaces-browser-extension";

describe("Snapshot tests", () => {
    it("renders correctly with one endpoint", () => {
        const endpoints = [
            { url: "https://url-1.com", active: true, readonly: true },
        ];

        const { asFragment } = render(
            <Button endpoints={endpoints} projectURL={projectURL} />
        );
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders correctly with multiple endpoints", () => {
        const endpoints = [
            { url: "https://url-1.com", active: true, readonly: true },
            { url: "https://url-2.com", active: false, readonly: false },
            { url: "https://url-3.com", active: false, readonly: false },
        ];

        const { asFragment } = render(
            <Button endpoints={endpoints} projectURL={projectURL} />
        );
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders correctly with multiple endpoints, with dropdown menu open", async () => {
        const endpoints = [
            { url: "https://url-1.com", active: true, readonly: true },
            { url: "https://url-2.com", active: false, readonly: false },
            { url: "https://url-3.com", active: false, readonly: false },
        ];

        const { asFragment } = render(
            <Button endpoints={endpoints} projectURL={projectURL} />
        );
        await openDropdownMenu();

        expect(asFragment()).toMatchSnapshot();
    });
});

describe("Functional tests", () => {
    it("should have correct href for main button", async () => {
        let endpoints = [
            { url: "https://url-1.com", active: true, readonly: true },
        ];

        act(() => {
            render(<Button endpoints={endpoints} projectURL={projectURL} />);
        });

        const btn = screen.getByText("Dev Spaces");
        expect((btn as HTMLAnchorElement).href).toEqual(
            "https://url-1.com/#https://github.com/redhat-developer/try-in-dev-spaces-browser-extension"
        );
    });

    it("should have correct href for main button, multiple endpoints", async () => {
        let endpoints = [
            { url: "https://url-1.com", active: true, readonly: true },
            { url: "https://url-2.com", active: false, readonly: false },
            { url: "https://url-3.com", active: false, readonly: false },
        ];

        act(() => {
            render(<Button endpoints={endpoints} projectURL={projectURL} />);
        });

        const btn = screen.getByText("Dev Spaces");
        expect((btn as HTMLAnchorElement).href).toEqual(
            "https://url-1.com/#https://github.com/redhat-developer/try-in-dev-spaces-browser-extension"
        );
    });

    it("should change the href of the button to the active endpoint", async () => {
        let endpoints = [
            { url: "https://url-1.com", active: false, readonly: true },
            { url: "https://url-2.com", active: true, readonly: false },
            { url: "https://url-3.com", active: false, readonly: false },
        ];

        act(() => {
            render(<Button endpoints={endpoints} projectURL={projectURL} />);
        });

        const btn = screen.getByText("Dev Spaces");
        expect((btn as HTMLAnchorElement).href).toEqual(
            "https://url-2.com/#https://github.com/redhat-developer/try-in-dev-spaces-browser-extension"
        );
    });

    it("should display 'Default' label only on the active endpoint", async () => {
        let endpoints = [
            { url: "https://url-1.com", active: false, readonly: true },
            { url: "https://url-2.com", active: true, readonly: false },
            { url: "https://url-3.com", active: false, readonly: false },
        ];

        act(() => {
            render(<Button endpoints={endpoints} projectURL={projectURL} />);
        });

        await openDropdownMenu();

        const dropdownMenu = screen.getByTestId("dropdown-menu");
        expect(dropdownMenu.querySelectorAll('a').length).toEqual(
            endpoints.length + 1
        );
    });

    it("should have the same number of dropdown items as number of endpoints plus one", async () => {
        const endpoints = [
            { url: "https://url-1.com", active: true, readonly: true },
            { url: "https://url-2.com", active: false, readonly: false },
            { url: "https://url-3.com", active: false, readonly: false },
        ];

        act(() => {
            render(<Button endpoints={endpoints} projectURL={projectURL} />);
        });

        await openDropdownMenu();

        const dropdownMenu = screen.getByTestId("dropdown-menu");
        expect(dropdownMenu.querySelectorAll('a').length).toEqual(
            endpoints.length + 1
        );
    });

    it("should send message to open options page when configure button is clicked", async () => {
        const endpoints = [
            { url: "https://url-1.com", active: true, readonly: true },
        ];

        act(() => {
            render(<Button endpoints={endpoints} projectURL={projectURL} />);
        });

        await openDropdownMenu();

        const configureBtn = screen.getByText("Configure");
        act(() => {
            configureBtn.click();
        });

        expect(chrome.runtime.sendMessage).toBeCalledWith({"action": "openOptionsPage"});
    });
});

async function openDropdownMenu() {
    const dropdownBtn = screen.getByTitle("Toggle dropdown");
    act(() => {
        dropdownBtn.click();
    });

    await waitFor(() => {
        expect(screen.getByTestId("dropdown-menu")).toBeInTheDocument();
    });
}
