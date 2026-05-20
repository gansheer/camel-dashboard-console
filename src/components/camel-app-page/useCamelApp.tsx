import { useK8sWatchResources, useK8sModel } from '@openshift-console/dynamic-plugin-sdk';
import { CamelAppKind } from '../../types';
import { camelAppGVK, camelMonitorGVK } from '../../const';

// Helper to check if error is NoModelError or NotFound
const isNoModelError = (error: any): boolean => {
  return error?.message?.includes('Model does not exist') || error?.name === 'NoModelError';
};

const isNotFoundError = (error: any): boolean => {
  return error?.message?.includes('not found') || error?.code === 404;
};

export const useCamelApp = (
  name: string,
  namespace: string,
): { CamelApp: CamelAppKind; isLoading: boolean; error: string } => {
  // Check which CRDs/models are registered in the cluster
  const [camelAppModel, camelAppModelLoading] = useK8sModel(camelAppGVK);
  const [camelMonitorModel, camelMonitorModelLoading] = useK8sModel(camelMonitorGVK);

  const hasOldCRD = !!camelAppModel;
  const hasNewCRD = !!camelMonitorModel;
  const modelsLoaded = !camelAppModelLoading && !camelMonitorModelLoading;

  // Only watch the CRD that exists
  // Priority: camelMonitors > camelApps
  const shouldWatchOld = hasOldCRD && !hasNewCRD;
  const shouldWatchNew = hasNewCRD;

  const resources = useK8sWatchResources<{
    camelApp: CamelAppKind;
    camelMonitor: CamelAppKind;
  }>({
    camelApp: {
      name: shouldWatchOld ? name : undefined,
      namespace: shouldWatchOld ? namespace : undefined,
      groupVersionKind: camelAppGVK,
      isList: false,
      optional: true,
    },
    camelMonitor: {
      name: shouldWatchNew ? name : undefined,
      namespace: shouldWatchNew ? namespace : undefined,
      groupVersionKind: camelMonitorGVK,
      isList: false,
      optional: true,
    },
  });

  const oldCRDLoaded = resources.camelApp.loaded;
  const newCRDLoaded = resources.camelMonitor.loaded;
  const oldCRDError = resources.camelApp.loadError;
  const newCRDError = resources.camelMonitor.loadError;

  // Determine which resource exists
  const hasOldResource =
    shouldWatchOld &&
    oldCRDLoaded &&
    !isNoModelError(oldCRDError) &&
    !isNotFoundError(oldCRDError) &&
    resources.camelApp.data?.metadata?.name;

  const hasNewResource =
    shouldWatchNew &&
    newCRDLoaded &&
    !isNoModelError(newCRDError) &&
    !isNotFoundError(newCRDError) &&
    resources.camelMonitor.data?.metadata?.name;

  // Prefer new CRD over old CRD
  const resourceData = hasNewResource
    ? resources.camelMonitor.data
    : hasOldResource
      ? resources.camelApp.data
      : ({} as CamelAppKind);

  // Loading state: wait for model discovery and data query
  const dataLoaded = shouldWatchNew
    ? newCRDLoaded
    : shouldWatchOld
    ? oldCRDLoaded
    : true;

  const isLoading = !modelsLoaded || !dataLoaded;

  // Error handling: report real errors, ignore NoModelError and NotFound
  let error = '';
  if (shouldWatchOld && oldCRDError && !isNoModelError(oldCRDError) && !isNotFoundError(oldCRDError)) {
    error = oldCRDError;
  } else if (shouldWatchNew && newCRDError && !isNoModelError(newCRDError) && !isNotFoundError(newCRDError)) {
    error = newCRDError;
  } else if (!isLoading && !hasOldResource && !hasNewResource) {
    // Queries completed but resource not found
    error = `${name} not found in namespace ${namespace}`;
  }

  return {
    CamelApp: resourceData,
    isLoading,
    error,
  };
};
