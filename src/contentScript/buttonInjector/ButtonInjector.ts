/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/

import { Endpoint } from "../../preferences/preferences";

export interface ButtonInjector {
    inject(endpoints: Endpoint[]): Promise<void>
}
