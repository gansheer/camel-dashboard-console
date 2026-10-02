import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import CamelAppDetails from '../camel-app-details/CamelAppDetails';
import { NavPage } from '@openshift-console/dynamic-plugin-sdk';
import CamelAppResources from '../camel-app-resources/CamelAppResources';
import CamelAppMetrics from '../camel-app-metrics/CamelAppMetrics';

export const useCamelAppTabs = (): NavPage[] => {
  const { t } = useTranslation('plugin__camel-dashboard-console');

  return useMemo(
    () => [
      {
        component: CamelAppDetails,
        href: '',
        name: t('Details'),
      },
      {
        component: CamelAppResources,
        href: 'resources',
        name: t('Resources'),
      },
      {
        component: CamelAppMetrics,
        href: 'metrics',
        name: t('Metrics'),
      },
    ],
    [t],
  );
};
