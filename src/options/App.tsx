/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/

import { useState } from "react";

import "@patternfly/react-core/dist/styles/base.css";
import "@patternfly/patternfly/utilities/Spacing/spacing.css";
import "@patternfly/patternfly/utilities/Float/float.css";

import { Card } from "@patternfly/react-core/components/Card";
import {
    PageSection,
    PageSectionVariants,
    Tabs,
    Tab,
    TabContent,
    TabContentBody,
    TabTitleText,
} from "@patternfly/react-core";
import { GitDomains } from "./GitDomains";
import { DevSpacesEndpoints } from "./DevSpacesEndpoints";
import "./styles/App.css";

export const App = () => {
    const [activeTabKey, setActiveTabKey] = useState(0);

    const handleTabClick = (_, tabIndex) => {
        setActiveTabKey(tabIndex);
    };

    return (
        <Card>
            <PageSection
                type="tabs"
                variant={PageSectionVariants.light}
                isWidthLimited
            >
                <Tabs
                    activeKey={activeTabKey}
                    onSelect={handleTabClick}
                    usePageInsets
                    id="open-tabs-example-tabs-list"
                >
                    <Tab
                        eventKey={0}
                        title={
                            <TabTitleText>Dev Spaces endpoints</TabTitleText>
                        }
                        tabContentId={`tabContent${0}`}
                    />
                    <Tab
                        eventKey={1}
                        title={
                            <TabTitleText>
                                GitHub Enterprise domains
                            </TabTitleText>
                        }
                        tabContentId={`tabContent${1}`}
                    />
                </Tabs>
            </PageSection>
            <PageSection isWidthLimited variant={PageSectionVariants.light}>
                <TabContent
                    key={0}
                    eventKey={0}
                    id={`tabContent${0}`}
                    activeKey={activeTabKey}
                    hidden={0 !== activeTabKey}
                    data-testid="dev-spaces-endpoints-tab"
                >
                    <TabContentBody>
                        <DevSpacesEndpoints />
                    </TabContentBody>
                </TabContent>
                <TabContent
                    key={1}
                    eventKey={1}
                    id={`tabContent${1}`}
                    activeKey={activeTabKey}
                    hidden={1 !== activeTabKey}
                    data-testid="git-domains-tab"
                >
                    <TabContentBody>
                        <GitDomains />
                    </TabContentBody>
                </TabContent>
            </PageSection>
        </Card>
    );
};
