import { K8sResourceKind } from '@openshift-console/dynamic-plugin-sdk';

// See how to enrich camelSpec
export type CamelIntegrationKind = K8sResourceKind & {
  spec?: {
    camelSpec: string;
  };
};
