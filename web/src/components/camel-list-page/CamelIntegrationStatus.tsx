import { K8sResourceKind } from '@openshift-console/dynamic-plugin-sdk';

export const CamelIntegrationStatuses = ['Succeeded', 'Failed', 'Unknown'] as const;

export type CamelIntegrationStatuses = typeof CamelIntegrationStatuses[number];

export const CamelIntegrationStatusValue = (
  camelInt: K8sResourceKind,
): CamelIntegrationStatuses => {
  if (camelInt.kind == 'Deployment' || camelInt.kind == 'DeploymentConfig') {
    return camelInt.status.availableReplicas === camelInt.status.replicas ? 'Succeeded' : 'Failed';
  }

  if (camelInt.kind == 'CronJob') {
    return camelInt.status.lastSuccessfulTime ? 'Succeeded' : 'Failed';
  }

  return 'Unknown';
};

export const CamelIntegrationStatusTitle = (camelInt: K8sResourceKind): string => {
  if (camelInt.kind == 'Deployment' || camelInt.kind == 'DeploymentConfig') {
    return camelInt.status.availableReplicas + ' of ' + camelInt.status.replicas + ' pods';
  }

  if (camelInt.kind == 'CronJob') {
    return camelInt.status.lastSuccessfulTime;
  }

  return 'Unknown';
};
