import { K8sResourceKind } from '@openshift-console/dynamic-plugin-sdk';

// See how to enrich camelSpec
export type CamelAppKind = K8sResourceKind & {
  spec?: {
    camelSpec: string;
  };
};
