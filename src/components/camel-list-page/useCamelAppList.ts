import { useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import { CamelAppKind } from '../../types';
import { camelMonitorGVK } from '../../const';

export const useCamelAppList = (
  namespace: string,
): {
  CamelApps: CamelAppKind[];
  loaded: boolean;
  error: string;
} => {
  const [resources, loaded, loadError] = useK8sWatchResource<CamelAppKind[]>({
    isList: true,
    groupVersionKind: camelMonitorGVK,
    namespaced: true,
    namespace: namespace || undefined,
  });

  let error = '';
  if (loadError && !loadError?.message?.includes('Model does not exist') && loadError?.name !== 'NoModelError') {
    error = loadError;
  }

  return {
    CamelApps: loaded ? resources : [],
    loaded,
    error,
  };
};
