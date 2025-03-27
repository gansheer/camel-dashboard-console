import { K8sResourceKind, TableColumn } from '@openshift-console/dynamic-plugin-sdk';
import { sortable } from '@patternfly/react-table';
import { useTranslation } from 'react-i18next';
import { CamelIntegrationStatusValue } from './CamelIntegrationStatus';

export const sortResourceByStatus =
  (direction: string) => (a: K8sResourceKind, b: K8sResourceKind) => {
    const { first, second } =
      direction === 'asc' ? { first: a, second: b } : { first: b, second: a };

    const firstValue = CamelIntegrationStatusValue(first);
    const secondValue = CamelIntegrationStatusValue(second);

    return firstValue?.localeCompare(secondValue);
  };

const useCamelIntegrationColumns = (namespace): TableColumn<K8sResourceKind>[] => {
  const { t } = useTranslation('plugin__camel-openshift-console-plugin');
  return [
    {
      title: t('Name'),
      id: 'name',
      sort: 'metadata.name',
      transforms: [sortable],
    },
    {
      title: t('Kind'),
      id: 'kind',
      sort: 'kind',
      transforms: [sortable],
    },
    ...(!namespace
      ? [
          {
            title: t('Namespace'),
            id: 'namespace',
            sort: 'metadata.namespace',
            transforms: [sortable],
          },
        ]
      : []),
    {
      title: t('Status'),
      id: 'status',
      sort: (data, direction) => data?.sort(sortResourceByStatus(direction)),
      transforms: [sortable],
    },
    {
      title: t('Camel'),
      id: 'camel',
      sort: "metadata.annotations.['camel/camel-core-version']",
      transforms: [sortable],
    },
    {
      title: t('Created'),
      id: 'created',
      sort: 'metadata.creationTimestamp',
      transforms: [sortable],
    },
  ];
};

export default useCamelIntegrationColumns;
