import { useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import { camelIntegrationGVK } from '../../utils';
import { CamelIntegrationKind } from '../../types';

export const useCamelIntegration = (
  name: string,
  namespace: string,
  kind: string,
): { camelIntegration: CamelIntegrationKind; isLoading: boolean; error: string } => {
  const [camelIntegrationDatas, loaded, loadError] = useK8sWatchResource<CamelIntegrationKind>({
    name: name,
    namespace: namespace,
    groupVersionKind: camelIntegrationGVK(kind),
    isList: false,
  });

  return { camelIntegration: camelIntegrationDatas, isLoading: !loaded, error: loadError };
};
