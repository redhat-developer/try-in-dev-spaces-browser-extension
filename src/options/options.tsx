/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/

import { createRoot } from "react-dom/client";
import { App } from "./App";

applyStyles();

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);

function applyStyles() {
    const isChromium = navigator.userAgent.includes("Chrome")
    const isEdge = isChromium && navigator.userAgent.includes("Edg");
    if (isChromium && !isEdge) {
        document.body.classList.add("chromium-body");
    }
}
