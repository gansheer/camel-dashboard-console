import * as React from 'react';
import { Card, CardHeader, CardTitle, CardBody } from '@patternfly/react-core';
import { QueryBrowser } from '@openshift-console/dynamic-plugin-sdk';
import { useTranslation } from 'react-i18next';
import { CamelAppMetricsProps } from './CamelAppMetrics';

const DEFAULT_TIMESPAN = 30 * 60 * 1000;
const DEFAULT_POLL_INTERVAL = 30 * 1000;

const CamelAppMemoryCard: React.FC<CamelAppMetricsProps> = ({ obj: camelInt }) => {
  const { t } = useTranslation('plugin__camel-openshift-console-plugin');
  const ownerReference = camelInt.metadata?.ownerReferences[0];
  const namespace = camelInt.metadata?.namespace;
  const workload = ownerReference ? ownerReference.name : camelInt.metadata?.name;

  const MemoryQueries = [
    'sum(container_memory_working_set_bytes{cluster="", namespace="' +
      namespace +
      '", container!="", image!=""} ' +
      ' * on(namespace,pod) group_left(workload, workload_type) ' +
      ' namespace_workload_pod:kube_pod_owner:relabel{cluster="", namespace="' +
      namespace +
      '", workload="' +
      workload +
      '", workload_type=~".+"}) by (pod)',
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('Memory Usage')}</CardTitle>
      </CardHeader>
      <CardBody>
        <QueryBrowser
          defaultTimespan={DEFAULT_TIMESPAN}
          pollInterval={DEFAULT_POLL_INTERVAL}
          queries={MemoryQueries}
          showLegend
        />
      </CardBody>
    </Card>
  );
};

export default CamelAppMemoryCard;
