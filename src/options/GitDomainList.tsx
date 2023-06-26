/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/

import { Split, SplitItem } from "@patternfly/react-core/layouts/Split";
import {
    SimpleList,
    SimpleListItem,
} from "@patternfly/react-core/components/SimpleList";
import { TrashIcon } from "@patternfly/react-icons/dist/js/icons/trash-icon";
import { Truncate } from "@patternfly/react-core/components/Truncate";
import { Button } from "@patternfly/react-core/components/Button";

interface Props {
    domains: string[];
    onClickDelete: (domain: string) => void;
}

export const GitDomainList = (props: Props) => {
    const listItems = props.domains.map((domain: string, i: number) => {
        return (
            <SimpleListItem
                key={"item-" + i}
                component="a"
                onClick={(e) => e.preventDefault()}
            >
                <Split>
                    <SplitItem>
                        <Truncate content={domain} />
                    </SplitItem>
                    <SplitItem isFilled />
                    <SplitItem>
                        <Button
                            className="pf-u-p-0"
                            variant="link"
                            isDanger
                            onClick={() => props.onClickDelete(domain)}
                            aria-label={
                                "Remove GitHub Enterprise domain " + domain
                            }
                        >
                            <TrashIcon />
                        </Button>
                    </SplitItem>
                </Split>
            </SimpleListItem>
        );
    });

    return <SimpleList data-testid="git-domains-list">{listItems}</SimpleList>;
};
