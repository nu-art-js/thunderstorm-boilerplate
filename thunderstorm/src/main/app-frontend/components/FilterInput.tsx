/*
 * Thunderstorm is a full web app framework!
 *
 * Typescript & Express backend infrastructure that natively runs on firebase function
 * Typescript & React frontend infrastructure
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
import {Filter} from "@nu-art/ts-common/utils/filter-tools";
import {TS_Input} from "./TS_Input";
import {Stylable} from "../tools/Stylable";
import { __stringify } from '@nu-art/ts-common';

export type Props_FilterInput<T> = Stylable & {
	filter: (item: T) => string[],
	list: T[],
	onChange: (items: T[], filterBy: string, id?: string) => void,
	id?: string,
	initialFilterText?: string,
	focus?: boolean,
	placeholder?: string
	handleKeyEvent?: (e: KeyboardEvent) => void
}

type State = {}

export class FilterInput<T>
	extends React.Component<Props_FilterInput<T>, State> {
	private filterInstance: Filter;

	constructor(props: Props_FilterInput<T>) {
		super(props);

		this.filterInstance = new Filter();
		this.filterInstance.setFilter(props.initialFilterText || '');
		this.state = {};
	}

	componentDidMount() {
		console.log(`componentDidMount: props === ${__stringify(this.props)}`);
		this.callOnChange(this.props.list, "");
	}

	shouldComponentUpdate(nextProps: Readonly<Props_FilterInput<T>>, nextState: Readonly<State>, nextContext: any): boolean {
		const b = this.props.list !== nextProps.list;
		console.log(`shouldComponentUpdate: list === ${__stringify(nextProps.list)}`);
		if (b)
			this.callOnChange(nextProps.list, "");

		return b;
	}

	callOnChange = (list: T[], filter: string) => {
		console.log("GOT HERE");
		console.log("callOnChange: list === ", list === undefined ? "undefined" : "[...]");

		this.props.onChange(this.filterInstance.filter(list, this.props.filter), filter, this.props.id);
		console.log("GOT THERE");
	};

	filter = (text: string) => {
		this.filterInstance.setFilter(text);
		console.log(`filter: list === ${__stringify(this.props.list)}`);
		this.callOnChange(this.props.list, text);
	};

	render() {
		const {id, placeholder, focus} = this.props;
		return (
			<TS_Input
				type='text'
				id={id}
				value={this.props.initialFilterText}
				onChange={(text) => {
					this.filter(text);
				}}
				focus={focus}
				placeholder={placeholder}
				className={this.props.className}
				style={this.props.style}
				handleKeyEvent={this.props.handleKeyEvent}
			/>
		);
	}

}
