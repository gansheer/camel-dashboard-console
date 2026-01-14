import {
  GreenCheckCircleIcon,
  RedExclamationCircleIcon,
  YellowExclamationTriangleIcon,
} from '@openshift-console/dynamic-plugin-sdk';
import { UnknownIcon } from '@patternfly/react-icons';
import { Label } from '@patternfly/react-core';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { HealthStatus, getHealthStatus, getHealthDisplayName } from './camel-health-utils';

type CamelAppHealthProps = {
  health: string;
};

const CamelAppHealth: React.FC<CamelAppHealthProps> = ({ health }) => {
  const { t } = useTranslation('plugin__camel-dashboard-console');
  const status = getHealthStatus(health);
  const displayName = getHealthDisplayName(health, t);

  switch (status) {
    case HealthStatus.HEALTHY:
      return (
        <Label color="green" icon={<GreenCheckCircleIcon />} isCompact>
          {displayName}
        </Label>
      );
    case HealthStatus.DEGRADED:
      return (
        <Label color="orange" icon={<YellowExclamationTriangleIcon />} isCompact>
          {displayName}
        </Label>
      );
    case HealthStatus.CRITICAL:
      return (
        <Label color="red" icon={<RedExclamationCircleIcon />} isCompact>
          {displayName}
        </Label>
      );
    case HealthStatus.UNKNOWN:
    default:
      return (
        <Label color="grey" icon={<UnknownIcon />} isCompact>
          {displayName}
        </Label>
      );
  }
};

export default CamelAppHealth;
