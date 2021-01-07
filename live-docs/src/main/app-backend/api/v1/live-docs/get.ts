/*
 * Permissions management system, define access level for each of
 * your server apis, and restrict users by giving them access levels
 *
 * Copyright (C) 2020 Intuition Robotics
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
	ApiResponse,
	ServerApi_Get,
    ExpressRequest
} from "@intuitionrobotics/thunderstorm/backend";


import {
	ApiGetLiveDoc,
	LiveDocReqParams,
	LiveDocsModule
} from "./_imports";

class ServerApi_LiveDoc_Get
	extends ServerApi_Get<ApiGetLiveDoc> {

	constructor() {
		super("get");
		this.dontPrintResponse();
	}

	protected async process(request: ExpressRequest, response: ApiResponse, queryParams: LiveDocReqParams, body: void) {
		// await KasperoProxy.assertPermissions(request, "Read Live-Doc", PermissionCategory_LiveDoc, PermissionAccessLevel_LiveDoc.Read);

		this.assertProperty(queryParams, "key");

		return LiveDocsModule.getLiveDoc(queryParams.key);
	}
}

module.exports = new ServerApi_LiveDoc_Get();
