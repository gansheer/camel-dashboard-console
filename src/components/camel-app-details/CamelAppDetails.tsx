import * as React from 'react';
import { CamelAppKind } from '../../types';
import { Card, CardBody, CardTitle, TextContent } from '@patternfly/react-core';
import { useTranslation } from 'react-i18next';
import { K8sGroupVersionKind, ResourceLink } from '@openshift-console/dynamic-plugin-sdk';
import { CamelAppGVK, getBuildTimestamp, getHealthEndpoints } from '../../utils';

type CamelAppDetailsProps = {
  obj: CamelAppKind;
};

type CamelAppDetails = {
  groupVersionKind: K8sGroupVersionKind;
  name: string;
  namespace: string;
  version: string;
  buildTimestamp: string;
  runtimeFramework: string;
  runtimeVersion: string;
  frameworkVersion: string;
  healthEndpoints: string[];
  metricsEndpoint: string;
};

const CamelAppDetails: React.FC<CamelAppDetailsProps> = ({ obj: camelInt }) => {
  const { t } = useTranslation('plugin__camel-openshift-console-plugin');

  // TODO : replace with real CR values
  const CamelAppDetails = {
    groupVersionKind: CamelAppGVK(camelInt.kind),
    name: camelInt.metadata.name,
    namespace: camelInt.metadata.namespace,
    version: '4.10.2',
    buildTimestamp: getBuildTimestamp(camelInt),
    runtimeFramework: 'quarkus',
    runtimeVersion: '3.20.0',
    healthEndpoints: getHealthEndpoints('quarkus'),
    metricsEndpoint: '/observe/metrics',
  };

  return (
    <div className="co-m-pane__body">
      <h2>{t('Camel App Details')}</h2>
      <Card>
        <CardTitle>{t('Details')}</CardTitle>
        <CardBody>
          <ResourceLink
            groupVersionKind={CamelAppDetails.groupVersionKind}
            name={CamelAppDetails.name}
            namespace={CamelAppDetails.namespace}
            linkTo={true}
          />
          <TextContent>
            <strong>{t('Version')}: </strong>
            {CamelAppDetails.version || (
              <span className="text-muted">{t('No version')}</span>
            )}
          </TextContent>
          <TextContent>
            <strong>{t('Build Timestamp')}: </strong>
            {CamelAppDetails.buildTimestamp || (
              <span className="text-muted">{t('No build timestamp')}</span>
            )}
          </TextContent>
        </CardBody>
      </Card>
      <Card>
        <CardTitle>{t('Endpoints')}</CardTitle>
        <CardBody>
          <TextContent>
            <strong>{t('Health Endpoints')}: </strong>
            {CamelAppDetails.healthEndpoints
              ? CamelAppDetails.healthEndpoints.map((endpoint, i) => {
                  return <TextContent key={i}> {endpoint}</TextContent>;
                })
              : '-'}
          </TextContent>
          <TextContent>
            <strong>{t('Metrics Endpoint')}: </strong>
            {CamelAppDetails.metricsEndpoint ? (
              <TextContent> {CamelAppDetails.metricsEndpoint}</TextContent>
            ) : (
              '-'
            )}
          </TextContent>
        </CardBody>
      </Card>
      <Card>
        <CardTitle>{t('Frameworks')}</CardTitle>
        <CardBody>
          <TextContent>
            <strong>{t('Runtime')}: </strong> {CamelAppDetails.runtimeFramework}
          </TextContent>
          <TextContent>
            <strong>{t('Runtime version')}: </strong> {CamelAppDetails.runtimeVersion}
          </TextContent>
        </CardBody>
      </Card>
    </div>
  );
};

export default CamelAppDetails;
