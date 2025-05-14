import {
  cronJobGVK,
  deploymentConfigGVK,
  deploymentGVK,
  LAST_LANGUAGE_LOCAL_STORAGE_KEY,
} from './const';
import { K8sResourceKind } from '@openshift-console/dynamic-plugin-sdk';

export const getLastLanguage = (): string =>
  localStorage.getItem(LAST_LANGUAGE_LOCAL_STORAGE_KEY) ?? navigator.language;

export function CamelAppOwnerGVK(kind: string) {
  switch (kind) {
    case deploymentConfigGVK.kind:
      return deploymentConfigGVK;
    case cronJobGVK.kind:
      return cronJobGVK;
    default:
      return deploymentGVK;
  }
}

// TODO use something else than Unknown
export function serviceMatchLabelValue(camelAppOwner: K8sResourceKind): string {
  if (camelAppOwner.kind == 'Deployment') {
    return camelAppOwner.spec.selector.matchLabels['app.kubernetes.io/name'];
  } else if (camelAppOwner.kind == 'DeploymentConfig') {
    return camelAppOwner.spec.selector['app.kubernetes.io/name'];
  } else if (camelAppOwner.kind == 'CronJob') {
    return camelAppOwner.metadata.labels['app.kubernetes.io/name'];
  }
  return 'Unknown';
}
