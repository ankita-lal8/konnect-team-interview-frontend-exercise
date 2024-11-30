export type SERVICE = {
  configured: boolean;
  description: string;
  id: string;
  metrics: METRICS;
  name: string;
  published: boolean;
  type: 'HTTP' | 'REST';
  versions: VERSION[] | [];
}

export interface METRICS {
  errors: number;
  latency: number;
  requests: number;
  uptime: number;
}

export interface VERSION {
  description: string;
  developer?: DEVELOPER;
  id: string;
  name: string;
  updated_at: string;
}
export interface DEVELOPER {
  avatar: string;
  email: string;
  id: string;
  name: string;
}

export type SIDEBAR_VERSIONS_DATA = {
  serviceName: string;
  versions: VERSION[];
  type: 'HTTP' | 'REST';
}
