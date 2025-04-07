import { useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import { CamelAppGVK } from '../../utils';
import { CamelAppKind } from '../../types';

export const useCamelApp = (
  name: string,
  namespace: string,
  kind: string,
): { CamelApp: CamelAppKind; isLoading: boolean; error: string } => {
  const [CamelAppDatas, loaded, loadError] = useK8sWatchResource<CamelAppKind>({
    name: name,
    namespace: namespace,
    groupVersionKind: CamelAppGVK(kind),
    isList: false,
  });

  return { CamelApp: CamelAppDatas, isLoading: !loaded, error: loadError };
};
