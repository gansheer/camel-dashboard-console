import { useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import { CamelAppKind } from '../../types';
import { camelMonitorGVK } from '../../const';

export const useCamelApp = (
  name: string,
  namespace: string,
): { CamelApp: CamelAppKind; isLoading: boolean; error: string } => {
  const [resource, loaded, loadError] = useK8sWatchResource<CamelAppKind>({
    name,
    namespace,
    groupVersionKind: camelMonitorGVK,
    isList: false,
  });

  let error = '';
  if (loadError) {
    if (loadError?.code === 404 || loadError?.message?.includes('not found')) {
      error = `${name} not found in namespace ${namespace}`;
    } else {
      error = loadError;
    }
  }

  return {
    CamelApp: loaded && !loadError ? resource : ({} as CamelAppKind),
    isLoading: !loaded,
    error,
  };
};
