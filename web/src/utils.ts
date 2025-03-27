import {
  cronJobGVK,
  deploymentConfigGVK,
  deploymentGVK,
  METADATA_ANNOTATION_APP_VERSION,
  METADATA_ANNOTATION_QUARKUS_BUILD_TIMESTAMP,
} from './const';
import { CamelIntegrationKind } from './types';

export function camelIntegrationGVK(kind: string) {
  switch (kind) {
    case deploymentConfigGVK.kind:
      return deploymentConfigGVK;
    case cronJobGVK.kind:
      return cronJobGVK;
    default:
      return deploymentGVK;
  }
}

export function getIntegrationVersion(integration: CamelIntegrationKind): string | null {
  if (integration && integration.metadata) {
    return integration.metadata.annotations?.[METADATA_ANNOTATION_APP_VERSION];
  }
  return null;
}

export function getBuildTimestamp(integration: CamelIntegrationKind): string | null {
  if (integration && integration.metadata) {
    return integration.metadata.annotations?.[METADATA_ANNOTATION_QUARKUS_BUILD_TIMESTAMP];
  }
  return null;
}
