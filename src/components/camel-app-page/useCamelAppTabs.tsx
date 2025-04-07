import * as React from 'react';
import { useTranslation } from 'react-i18next';
import CamelAppDetails from '../camel-app-details/CamelAppDetails';
import { NavPage } from '@openshift-console/dynamic-plugin-sdk';
import CamelAppResources from '../camel-app-resources/CamelAppResources';
import { CamelAppKind } from '../../types';

export const useCamelAppTabs = (CamelApp: CamelAppKind): NavPage[] => {
  const { t } = useTranslation('plugin__camel-openshift-console-plugin');

  return [
    {
      component: () => <CamelAppDetails obj={CamelApp} />,
      href: '',
      name: t('Details'),
    },
    {
      component: () => <CamelAppResources obj={CamelApp} />,
      href: 'resources',
      name: t('Resources'),
    },
  ];
};
