/*
 * Permissions management system, define access level for each of
 * your server apis, and restrict users by giving them access levels
 *
 * Copyright (C) 2020 Adam van der Kruk aka TacB0sS
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
import * as React from 'react';
import {BaseComponent} from "@nu-art/thunderstorm/frontend";
import {
	_setTimeout,
	Second
} from '@nu-art/ts-common';
import {ExampleModule} from "@modules/ExampleModule";
import {
	OnNotificationsReceived,
	PushPubSubModule
} from "@nu-art/push-pub-sub/frontend";
import {DB_Notifications} from "@nu-art/push-pub-sub/shared/types";

export type State = {
	notifications: DB_Notifications[]
}

export class Example_TriggerPush
	extends BaseComponent<{}, State>
	implements OnNotificationsReceived {

	constructor(props: {}) {
		super(props);
		this.state = {
			notifications: []
		};
	}

	__onNotificationsReceived(): void {
		this.setState({notifications: PushPubSubModule.getNotifications()});
	}

	render() {
		return <div className={'ll_h_v'}>
			<button onClick={() => this.triggerPush()}>Trigger Push</button>
			<button onClick={() => this.triggerPush(Second)}>Trigger Delayed Push</button>
			{this.state.notifications.map(_notification => <div onClick={() => PushPubSubModule.readNotification(_notification._id, !_notification.read)}>{_notification.read.toString()}</div>)}
		</div>;
	}

	private triggerPush(timeout?: number) {
		return _setTimeout(() => {
			ExampleModule.testPush();
		}, timeout);
	}
}
