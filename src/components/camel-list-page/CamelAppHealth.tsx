import {
  GreenCheckCircleIcon,
  RedExclamationCircleIcon,
  YellowExclamationTriangleIcon,
} from '@openshift-console/dynamic-plugin-sdk';
import { UnknownIcon } from '@patternfly/react-icons';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

type CamelAppHealthProps = {
  health: string;
};

const CamelAppHealth: React.FC<CamelAppHealthProps> = ({ health }) => {
  const { t } = useTranslation('plugin__camel-dashboard-console');
  // FIXME: manage undefined
  switch (health?.toLowerCase()) {
    case 'ok':
    case 'success':
      return (
        <>
          <GreenCheckCircleIcon title={t(health)} />
          &nbsp;&nbsp;{t(health)}
        </>
      );
    case 'warning':
      return (
        <>
          <YellowExclamationTriangleIcon title={t(health)} />
          &nbsp;&nbsp;{t(health)}
        </>
      );
    case 'error':
      return (
        <>
          <RedExclamationCircleIcon title={t(health)} />
          &nbsp;&nbsp;{t(health)}
        </>
      );
    default:
      return (
        <>
          <UnknownIcon title={t('Unknown')} />
          &nbsp;&nbsp;{t('Unknown')}
        </>
      );
  }
};

export default CamelAppHealth;
