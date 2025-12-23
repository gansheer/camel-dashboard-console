import {
  GreenCheckCircleIcon,
  RedExclamationCircleIcon,
  YellowExclamationTriangleIcon,
} from '@openshift-console/dynamic-plugin-sdk';
import { UnknownIcon } from '@patternfly/react-icons';
import { Label } from '@patternfly/react-core';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

type CamelAppHealthProps = {
  health: string;
};

const CamelAppHealth: React.FC<CamelAppHealthProps> = ({ health }) => {
  const { t } = useTranslation('plugin__camel-dashboard-console');
  switch (health?.toLowerCase()) {
    case 'ok':
    case 'success':
      return (
        <Label color="green" icon={<GreenCheckCircleIcon />} isCompact>
          {t('Healthy')}
        </Label>
      );
    case 'warning':
      return (
        <Label color="orange" icon={<YellowExclamationTriangleIcon />} isCompact>
          {t('Degraded')}
        </Label>
      );
    case 'error':
      return (
        <Label color="red" icon={<RedExclamationCircleIcon />} isCompact>
          {t('Critical')}
        </Label>
      );
    default:
      return (
        <Label color="grey" icon={<UnknownIcon />} isCompact>
          {t('Unknown')}
        </Label>
      );
  }
};

export default CamelAppHealth;
