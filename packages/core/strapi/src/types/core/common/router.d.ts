import type { MiddlewareHandler } from './middleware';

export type RouterType = 'admin' | 'content-api';

export type Route = {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  handler?: string;
  info: {
    apiName?: string;
    pluginName?: string;
    type?: string;
  };
  config?: {
    middlewares?: Array<string | MiddlewareHandler>;
    policies?: Array<string | { name: string; config: unknown }>;
    auth?: any;
  };
};

export type Router = {
  type: RouterType;
  prefix?: string;
  routes: Route[];
};
