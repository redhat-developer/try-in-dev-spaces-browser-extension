/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/

import { act } from "react-dom/test-utils";
import { render, RenderResult, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import { Button } from "../Button";

const projectURL =
    "https://github.com/redhat-developer/try-in-dev-spaces-browser-extension";

describe("Snapshot tests", () => {
    it("renders correctly with one endpoint", () => {
        const endpoints = [
            { url: "https://url-1.com", active: true, readonly: true },
        ];

        const { asFragment } = render(
            <Button endpoints={endpoints} projectURL={projectURL} additionalClasses={['ml-2']} />
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
            <Button endpoints={endpoints} projectURL={projectURL} additionalClasses={['ml-2']} />
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
            <Button endpoints={endpoints} projectURL={projectURL} additionalClasses={['ml-2']} />
        );
        await openDropdownMenu();

        expect(asFragment()).toMatchSnapshot();
    });
});

describe("Functional tests", () => {

    afterEach(() => {
        jest.resetAllMocks();
    });

    it("should have correct href for main button", async () => {
        let endpoints = [
            { url: "https://url-1.com", active: true, readonly: true },
        ];

        act(() => {
            render(<Button endpoints={endpoints} projectURL={projectURL} additionalClasses={['ml-2']} />);
        });

        const btn = screen.getByText("Dev Spaces");
        expect((btn as HTMLAnchorElement).href).toEqual(
            "https://url-1.com/f?url=https://github.com/redhat-developer/try-in-dev-spaces-browser-extension"
        );
    });

    it("should have correct href for main button, multiple endpoints", async () => {
        let endpoints = [
            { url: "https://url-1.com", active: true, readonly: true },
            { url: "https://url-2.com", active: false, readonly: false },
            { url: "https://url-3.com", active: false, readonly: false },
        ];

        act(() => {
            render(<Button endpoints={endpoints} projectURL={projectURL} additionalClasses={['ml-2']} />);
        });

        const btn = screen.getByText("Dev Spaces");
        expect((btn as HTMLAnchorElement).href).toEqual(
            "https://url-1.com/f?url=https://github.com/redhat-developer/try-in-dev-spaces-browser-extension"
        );
    });

    it("should change the href of the button to the active endpoint", async () => {
        let endpoints = [
            { url: "https://url-1.com", active: false, readonly: true },
            { url: "https://url-2.com", active: true, readonly: false },
            { url: "https://url-3.com", active: false, readonly: false },
        ];

        act(() => {
            render(<Button endpoints={endpoints} projectURL={projectURL} additionalClasses={['ml-2']} />);
        });

        const btn = screen.getByText("Dev Spaces");
        expect((btn as HTMLAnchorElement).href).toEqual(
            "https://url-2.com/f?url=https://github.com/redhat-developer/try-in-dev-spaces-browser-extension"
        );
    });

    it("should display 'Default' label only on the active endpoint", async () => {
        let endpoints = [
            { url: "https://url-1.com", active: false, readonly: true },
            { url: "https://url-2.com", active: true, readonly: false },
            { url: "https://url-3.com", active: false, readonly: false },
        ];

        act(() => {
            render(<Button endpoints={endpoints} projectURL={projectURL} additionalClasses={['ml-2']} />);
        });

        await openDropdownMenu();

        const dropdownMenu = screen.getByTestId("dropdown-menu");
        expect(dropdownMenu.querySelectorAll("a")).toHaveLength(
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
            render(<Button endpoints={endpoints} projectURL={projectURL} additionalClasses={['ml-2']} />);
        });

        await openDropdownMenu();

        const dropdownMenu = screen.getByTestId("dropdown-menu");
        expect(dropdownMenu.querySelectorAll("a")).toHaveLength(
            endpoints.length + 1
        );
    });

    it("should send message to open options page when configure button is clicked", async () => {
        const endpoints = [
            { url: "https://url-1.com", active: true, readonly: true },
        ];

        act(() => {
            render(<Button endpoints={endpoints} projectURL={projectURL} additionalClasses={['ml-2']} />);
        });

        await openDropdownMenu();

        const configureBtn = screen.getByText("Configure");
        act(() => {
            configureBtn.click();
        });

        expect(chrome.runtime.sendMessage).toBeCalledWith({
            action: "openOptionsPage",
        });
    });

    it("should remove click event listener on component unmount", async () => {
        const endpoints = [
            { url: "https://url-1.com", active: true, readonly: true },
        ];

        const addListenerSpy = jest.spyOn(window, "addEventListener");
        const removeListenerSpy = jest.spyOn(window, "removeEventListener");

        let renderResult: RenderResult;
        act(() => {
            renderResult = render(
                <Button endpoints={endpoints} projectURL={projectURL} additionalClasses={['ml-2']} />
            );
        });

        expect(addListenerSpy).toBeCalledWith(
            "click",
            expect.any(Function)
        );
        renderResult.unmount();
        expect(removeListenerSpy).toBeCalledWith(
            "click",
            expect.any(Function)
        );
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
