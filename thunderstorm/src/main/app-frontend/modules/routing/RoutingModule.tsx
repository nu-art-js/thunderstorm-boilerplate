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

import {_keys, addItemToArray, BadImplementationException, Module} from "@nu-art/ts-common";
import * as React from "react";
import {defaultLinkNode, defaultNavLinkNode, defaultRouteNode, RouteParams, RoutePath} from "./route";
import {Redirect, Switch} from "react-router-dom";
import {BrowserHistoryModule} from "../HistoryModule";
import {QueryParams} from "../../../shared/types";


class RoutingModule_Class
	extends Module<{}> {
	private readonly routes: { [key: string]: RoutePath } = {};
	private readonly ordinalRoutes: string[] = [];

	private readonly createNavLinkNode: (route: RoutePath) => React.ReactElement;
	private readonly createRouteNode: (route: RoutePath) => React.ReactElement;
	private readonly createLinkNode: (route: RoutePath, node?: React.ReactNode) => React.ReactElement;

	constructor() {
		super();
		this.createNavLinkNode = defaultNavLinkNode;
		this.createLinkNode = defaultLinkNode;
		this.createRouteNode = defaultRouteNode;
	}

	init() {
	}

	clearRoutes() {
		for (const item of this.ordinalRoutes) {
			delete this.routes[item];
		}
		this.ordinalRoutes.splice(0);
	}

	addRoute(key: string, route: string, component: React.ComponentClass | string) {
		const previousRoute = this.routes[key];
		if (previousRoute)
			throw new BadImplementationException(
				`Route key '${key}' MUST be unique!!\n  Found two routes with matching key: '${route}' && '${previousRoute.path}'`);

		addItemToArray(this.ordinalRoutes, key);
		return this.routes[key] = new RoutePath(key, route, component);
	}

	getRoute(key: string) {
		const route = this.routes[key];
		if (!route)
			throw new BadImplementationException(`No Route for key '${key}'... Did you forget to add it??`);

		return route;
	}

	getPath(key: string) {
		return this.getRoute(key).path;
	}

	goToRoute(key: string, params?: RouteParams) {
		const pathname = RoutingModule.getPath(key);
		const search = RoutePath.composeStringQuery(params);

		BrowserHistoryModule.push({pathname, search});
	}

	redirect(key: string) {
		return <Redirect to={RoutingModule.getPath(key)}/>;
	}

	getMyRouteKey = () => Object.keys(this.routes).find(key => this.routes[key].path === BrowserHistoryModule.getCurrent().pathname);

	// need to figure out how to create parameterized urls from this call !!
	getNavLinks(keys: string[]) {
		return keys.map(key => this.getRoute(key)).filter(route => route.visible && route.visible()).map(route => this.createNavLinkNode(route));
	}

	getNavLink(key: string) {
		return this.createNavLinkNode(this.getRoute(key));
	}

	getLink(key: string) {
		return this.createLinkNode(this.getRoute(key));
	}

	getRoutesMap(keys?: string[]) {
		return <Switch>
			{(keys || this.ordinalRoutes).map(key => this.createRouteNode(this.getRoute(key)))}
		</Switch>;
	}

	getCurrentUrl = () => window.location.href

	private getEncodedQueryParams = (): QueryParams => {
		const queryParams: QueryParams = {};
		let queryAsString = window.location.search;
		if (!queryAsString || queryAsString.length === 0)
			return {};

		while (true) {
			if (queryAsString.startsWith("?"))
				queryAsString = queryAsString.substring(1);
			else if (queryAsString.startsWith("/?"))
				queryAsString = queryAsString.substring(1);
			else
				break;
		}

		const query = queryAsString.split("&");
		return query.map(param => {
			const parts = param.split("=");
			return {key: parts[0], value: parts[1]};
		}).reduce((toRet, param) => {
			if (param.key && param.value)
				toRet[param.key] = param.value;

			return toRet;
		}, queryParams);
	};

	getSearch() {
		const params = this.getEncodedQueryParams();
		_keys(params).forEach(key => {
			const value = params[key];
			if (!value) {
				delete params[key];
				return;
			}

			params[key] = decodeURIComponent(value);
		});
		return params;
	}

	goToUrl = (url: string) => window.location.href = url;
}

export const RoutingModule = new RoutingModule_Class();