/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/

import { Endpoint, getEndpoints } from "../preferences/preferences";
import { ButtonInjectorFactory } from "./buttonInjector/ButtonInjectorFactory";

getEndpoints().then((endpoints: Endpoint[]) => {
    ButtonInjectorFactory.getButtonInjector()?.inject(endpoints);
});
