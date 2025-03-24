import * as React from 'react';
import { K8sResourceKind } from '@openshift-console/dynamic-plugin-sdk';

import Status from '@openshift-console/dynamic-plugin-sdk/lib/app/components/status/Status';
//import { useTranslation } from "react-i18next";

const CamelIntegrationStatus = ({ camelInt }: { camelInt: K8sResourceKind }) => {
  // Use translated values for Succeded and Failed
  //const { t } = useTranslation('plugin__camel-openshift-console-plugin');

  if (camelInt.kind == 'Deployment' || camelInt.kind == 'DeploymentConfig') {
    return (
      <Status
        title={`${camelInt.status.availableReplicas} of ${camelInt.status.replicas} pods`}
        status={
          camelInt.status.availableReplicas === camelInt.status.replicas ? 'Succeeded' : 'Failed'
        }
      />
    );
  } else if (camelInt.kind == 'CronJob') {
    return (
      <Status
        title={`${camelInt.status.lastSuccessfulTime}`}
        status={camelInt.status.lastSuccessfulTime ? 'Succeeded' : 'Failed'}
      />
    );
  }
};

export default CamelIntegrationStatus;
