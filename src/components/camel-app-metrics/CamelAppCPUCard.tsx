import * as React from 'react';
import { Card, CardHeader, CardTitle, CardBody } from '@patternfly/react-core';
import { QueryBrowser } from '@openshift-console/dynamic-plugin-sdk';
import { useTranslation } from 'react-i18next';
import { CamelAppMetricsProps } from './CamelAppMetrics';

const DEFAULT_TIMESPAN = 30 * 60 * 1000;
const DEFAULT_POLL_INTERVAL = 30 * 1000;

const CamelAppCPUCard: React.FC<CamelAppMetricsProps> = ({ obj: camelInt }) => {
  const ownerReference = camelInt.metadata?.ownerReferences[0];
  const namespace = camelInt.metadata?.namespace;
  const workload = ownerReference ? ownerReference.name : camelInt.metadata?.name;
  const CPUQueries = [
    'sum(node_namespace_pod_container:container_cpu_usage_seconds_total:sum_irate{cluster="", namespace="' +
      namespace +
      '"}' +
      ' * on(namespace,pod) group_left(workload, workload_type) ' +
      'namespace_workload_pod:kube_pod_owner:relabel{cluster="", namespace="' +
      namespace +
      '", workload="' +
      workload +
      '", workload_type=~".+"}) by (pod)',
  ];

  const { t } = useTranslation('plugin__camel-dashboard-console');
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('CPU Usage')}</CardTitle>
      </CardHeader>
      <CardBody>
        <QueryBrowser
          defaultTimespan={DEFAULT_TIMESPAN}
          pollInterval={DEFAULT_POLL_INTERVAL}
          queries={CPUQueries}
          showLegend
        />
      </CardBody>
    </Card>
  );
};

export default CamelAppCPUCard;
