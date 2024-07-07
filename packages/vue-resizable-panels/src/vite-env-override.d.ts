declare module "*.vue" {
	import type { DefineComponent } from 'vue';
	const component: DefineComponent<{}, {}, any>;
	export default component;
}

declare namespace NodeJS {
	type Timeout = any;
}

declare interface ErrorConstructor {
	captureStackTrace(thisArg: any, func: any): void;
}