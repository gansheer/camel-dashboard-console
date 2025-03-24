import { K8sResourceKind } from '@openshift-console/dynamic-plugin-sdk';

export type CamelIntegrationIdentity = {
  name: string;
  ns: string;
  kind: string;
};

// See how to enrich camelSpec
export type CamelIntegrationKind = K8sResourceKind & {
  spec?: {
    camelSpec: string;
  };
};
