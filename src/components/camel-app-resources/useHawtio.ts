import { K8sResourceKind, useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import { consolePluginGVK, HAWTIO_CONSOLE_PLUGIN_NAME } from '../../const';
import * as jsonpath from 'jsonpath';

const JOLOKIA_PORT_QUERY = '$.spec.containers[*].ports[?(@.name=="jolokia")]';

export function isHawtioEnabled(pod: K8sResourceKind): boolean {
  return pod && jsonpath.query(pod, JOLOKIA_PORT_QUERY).length > 0;
}

// TODO: Add check to see if active or not
export const useHawtioConsolePlugin = (): {
  available: boolean;
} => {
  const [HawtioConsolePluginResource, loaded] = useK8sWatchResource<K8sResourceKind>({
    name: HAWTIO_CONSOLE_PLUGIN_NAME,
    groupVersionKind: consolePluginGVK,
    isList: false,
  });

  const available = loaded && HawtioConsolePluginResource != null

  return { available };
};
