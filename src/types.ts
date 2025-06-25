import { K8sResourceKind } from '@openshift-console/dynamic-plugin-sdk';

// See how to enrich camelSpec
export type CamelAppKind = K8sResourceKind & {
  status: {
    pods: CamelAppStatusPod[];
    phase: string;
    sliExchangeSuccessRate: CamelAppSli;
  };
};

export type CamelAppSli = {
  /** Format: date-time - in nanoseconds */
  lastTimestamp: string;
  samplingInterval: number;
  samplingIntervalFailed: number;
  samplingIntervalTotal: number;
  status: string;
  successPercentage: string;
};

export type CamelAppStatusPod = {
  internalIp: string;
  name: string;
  observe: CamelAppObservability;
  ready: boolean;
  reason: boolean;
  runtime: CamelAppRuntime;
  status: string;
  /** Format: date-time - in nanoseconds */
  uptimeTimestamp: string;
};

export type CamelAppObservability = {
  healthEndpoint: string;
  healthPort: number;
  metricsEndpoint: string;
  metricsPort: number;
};

export type CamelAppRuntime = {
  camelVersion: string;
  exchange: CamelAppExchange;
  runtimeProvider: string;
  runtimeVersion: string;
  status: string;
};

export type CamelAppExchange = {
  failed: number;
  pending: number;
  succeed: number;
  total: number;
};
