import { K8sGroupVersionKind } from '@openshift-console/dynamic-plugin-sdk';

export const HAWTIO_CONSOLE_PLUGIN_NAME = 'hawtio-online-console-plugin';

export const METADATA_LABEL_SELECTOR_CAMEL_APP_KEY = 'camel/integration-runtime';
export const METADATA_LABEL_SELECTOR_CAMEL_APP_VALUE = 'camel';

export const METADATA_ANNOTATION_APP_VERSION = 'app.kubernetes.io/version';

export const METADATA_ANNOTATION_CAMEL_VERSION = 'camel/camel-core-version';

export const METADATA_ANNOTATION_CAMEL_QUARKUS_PLATFORM_VERSION = 'camel/quarkus-platform';
export const METADATA_ANNOTATION_CAMEL_CEQ_VERSION = 'camel/camel-quarkus';

export const METADATA_ANNOTATION_QUARKUS_BUILD_TIMESTAMP = 'app.quarkus.io/build-timestamp';

export const METADATA_ANNOTATION_CAMEL_SPRINGBOOT_VERSION = 'camel/spring-boot-version';
export const METADATA_ANNOTATION_CAMEL_CSB_VERSION = 'camel/camel-spring-boot-version';

export const camelAppGVK: K8sGroupVersionKind = {
  group: 'camel.apache.org',
  version: 'v1alpha1',
  kind: 'App',
};

export const deploymentGVK: K8sGroupVersionKind = {
  group: 'apps',
  version: 'v1',
  kind: 'Deployment',
};
export const deploymentConfigGVK: K8sGroupVersionKind = {
  group: 'apps.openshift.io',
  version: 'v1',
  kind: 'DeploymentConfig',
};
export const cronJobGVK: K8sGroupVersionKind = {
  group: 'batch',
  version: 'v1',
  kind: 'CronJob',
};
export const jobGVK: K8sGroupVersionKind = {
  group: 'batch',
  version: 'v1',
  kind: 'Job',
};

export const podGVK: K8sGroupVersionKind = {
  group: '',
  version: 'v1',
  kind: 'Pod',
};
export const serviceGVK: K8sGroupVersionKind = {
  group: '',
  version: 'v1',
  kind: 'Service',
};
export const routeGVK: K8sGroupVersionKind = {
  group: 'route.openshift.io',
  version: 'v1',
  kind: 'Route',
};

export const configMapGVK: K8sGroupVersionKind = {
  group: '',
  version: 'v1',
  kind: 'ConfigMap',
};
export const secretGVK: K8sGroupVersionKind = {
  group: '',
  version: 'v1',
  kind: 'Secret',
};
export const persistentVolumeClaimGVK: K8sGroupVersionKind = {
  group: '',
  version: 'v1',
  kind: 'PersistentVolumeClaim',
};

export const consolePluginGVK: K8sGroupVersionKind = {
  group: 'console.openshift.io',
  version: 'v1',
  kind: 'ConsolePlugin',
};

export const ALL_NAMESPACES_KEY = '#ALL_NS#';
