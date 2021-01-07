/*
 * Firebase is a simpler Typescript wrapper to all of firebase services.
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

import {FirebaseSession} from "./firebase-session";
import {Logger} from "@intuitionrobotics/ts-common";

export abstract class FirebaseBaseWrapper
	extends Logger {

	public readonly firebaseSession: FirebaseSession<any>;

	protected constructor(firebaseSession: FirebaseSession<any>) {
		super();
		this.firebaseSession = firebaseSession;
	}

	isAdmin() {
		return this.firebaseSession.isAdmin();
	}
}