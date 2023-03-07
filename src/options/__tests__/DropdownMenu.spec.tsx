/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/

import { act } from "react-dom/test-utils";
import { Matcher, MatcherOptions, render } from "@testing-library/react";
import "@testing-library/jest-dom";

import { DropdownMenu } from "../DropdownMenu";

const onClickSetDefaultMock = jest.fn();
const onClickDeleteMock = jest.fn();

const DISABLED_CLASS = "pf-m-disabled"

afterEach(() => {
    onClickSetDefaultMock.mockClear();
    onClickDeleteMock.mockClear();
});

it("should have 'Set default' and 'Delete' to be enabled", async () => {
    const { findByText, getByRole } = render(
        <DropdownMenu
            isDefault={false}
            isReadOnly={false}
            onClickSetDefault={onClickSetDefaultMock}
            onClickDelete={onClickDeleteMock}
        />
    );

    openDropdownMenu(getByRole);
    const setDefaultBtn = (await findByText("Set default")).closest("button");
    const deleteTextBtn = (await findByText("Delete")).closest("button");
    expect(setDefaultBtn.classList.contains(DISABLED_CLASS)).toBe(false);
    expect(deleteTextBtn.classList.contains(DISABLED_CLASS)).toBe(false);
});

it("should have 'Set default' and 'Delete' to be disabled", async () => {
    const { findByText, getByRole } = render(
        <DropdownMenu
            isDefault={true}
            isReadOnly={true}
            onClickSetDefault={onClickSetDefaultMock}
            onClickDelete={onClickDeleteMock}
        />
    );

    openDropdownMenu(getByRole);
    const setDefaultBtn = (await findByText("Set default")).closest("button");
    const deleteTextBtn = (await findByText("Delete")).closest("button");
    expect(setDefaultBtn.classList.contains(DISABLED_CLASS)).toBe(true);
    expect(deleteTextBtn.classList.contains(DISABLED_CLASS)).toBe(true);
});

it("should have 'Set default' be disabled and 'Delete' be enabled", async () => {
    const { findByText, getByRole } = render(
        <DropdownMenu
            isDefault={true}
            isReadOnly={false}
            onClickSetDefault={onClickSetDefaultMock}
            onClickDelete={onClickDeleteMock}
        />
    );

    openDropdownMenu(getByRole);
    const setDefaultBtn = (await findByText("Set default")).closest("button");
    const deleteTextBtn = (await findByText("Delete")).closest("button");
    expect(setDefaultBtn.classList.contains(DISABLED_CLASS)).toBe(true);
    expect(deleteTextBtn.classList.contains(DISABLED_CLASS)).toBe(false);
});

it("should have 'Set default' be enabled and 'Delete' be disabled", async () => {
    const { findByText, getByRole } = render(
        <DropdownMenu
            isDefault={false}
            isReadOnly={true}
            onClickSetDefault={onClickSetDefaultMock}
            onClickDelete={onClickDeleteMock}
        />
    );

    openDropdownMenu(getByRole);
    const setDefaultBtn = (await findByText("Set default")).closest("button");
    const deleteTextBtn = (await findByText("Delete")).closest("button");
    expect(setDefaultBtn.classList.contains(DISABLED_CLASS)).toBe(false);
    expect(deleteTextBtn.classList.contains(DISABLED_CLASS)).toBe(true);
});

function openDropdownMenu(getByRole: (id: Matcher, options?: MatcherOptions) => HTMLElement) {
    const dropdownBtn = getByRole("button");
    act(() => {
        dropdownBtn.click();
    });
}
