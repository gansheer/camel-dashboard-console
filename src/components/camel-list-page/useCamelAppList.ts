import { useK8sWatchResources, useK8sModel } from '@openshift-console/dynamic-plugin-sdk';
import { CamelAppKind } from '../../types';
import { camelAppGVK, camelMonitorGVK } from '../../const';

// Helper to check if error is NoModelError
const isNoModelError = (error: any): boolean => {
  return error?.message?.includes('Model does not exist') || error?.name === 'NoModelError';
};

export const useCamelAppList = (
  namespace: string,
): {
  CamelApps: CamelAppKind[];
  loaded: boolean;
  error: string;
  hasOldCRD: boolean;
  hasNewCRD: boolean;
} => {
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
    camelApps: CamelAppKind[];
    camelMonitors: CamelAppKind[];
  }>({
    camelApps: {
      isList: true,
      groupVersionKind: camelAppGVK,
      namespaced: true,
      namespace: shouldWatchOld ? namespace : undefined,
      optional: true,
    },
    camelMonitors: {
      isList: true,
      groupVersionKind: camelMonitorGVK,
      namespaced: true,
      namespace: shouldWatchNew ? namespace : undefined,
      optional: true,
    },
  });

  const oldCRDData = shouldWatchOld ? resources.camelApps.data : [];
  const newCRDData = shouldWatchNew ? resources.camelMonitors.data : [];
  const combinedData = hasNewCRD ? newCRDData : oldCRDData;

  // Determine if data is loaded
  const dataLoaded = shouldWatchNew
    ? resources.camelMonitors.loaded
    : shouldWatchOld
    ? resources.camelApps.loaded
    : true; // No CRDs exist, consider loaded

  const loaded = modelsLoaded && dataLoaded;

  // Only report real errors (not NoModelError)
  let error = '';
  const oldError = resources.camelApps.loadError;
  const newError = resources.camelMonitors.loadError;

  if (shouldWatchOld && oldError && !isNoModelError(oldError)) {
    error = oldError;
  } else if (shouldWatchNew && newError && !isNoModelError(newError)) {
    error = newError;
  }

  return {
    CamelApps: combinedData,
    loaded,
    error,
    hasOldCRD,
    hasNewCRD,
  };
};
