import * as React from 'react';
import { CamelIntegrationKind } from '../../types';
import { Card, CardBody, CardTitle, TextContent } from '@patternfly/react-core';
import { useTranslation } from 'react-i18next';
import { ResourceLink } from '@openshift-console/dynamic-plugin-sdk';
import { camelIntegrationGVK, getIntegrationVersion, getBuildTimestamp } from '../../utils';
import {
  METADATA_ANNOTATION_CAMEL_CEQ_VERSION,
  METADATA_ANNOTATION_CAMEL_CSB_VERSION,
  METADATA_ANNOTATION_CAMEL_QUARKUS_PLATFORM_VERSION,
  METADATA_ANNOTATION_CAMEL_SPRINGBOOT_VERSION,
  METADATA_ANNOTATION_CAMEL_VERSION,
} from '../../const';

type CamelIntegrationDetailsProps = {
  obj: CamelIntegrationKind;
};

const CamelIntegrationDetails: React.FC<CamelIntegrationDetailsProps> = ({ obj: camelInt }) => {
  const { t } = useTranslation('plugin__camel-openshift-console-plugin');

  console.log(camelInt);

  const groupVersionKind = camelIntegrationGVK(camelInt.kind);
  const version = getIntegrationVersion(camelInt);
  const buildTimestamp = getBuildTimestamp(camelInt);

  return (
    <Card>
      <CardTitle>{t('Integration')}</CardTitle>
      <CardBody>
        <Card>
          <CardTitle>Details</CardTitle>
          <CardBody>
            <ResourceLink
              groupVersionKind={groupVersionKind}
              name={camelInt.metadata.name}
              namespace={camelInt.metadata.namespace}
              linkTo={true}
            />
            <TextContent>
              <strong>Version: </strong>
              {version || <span className="text-muted">{t('No version')}</span>}
            </TextContent>
            <TextContent>
              <strong>Build Timestamp: </strong>
              {buildTimestamp || <span className="text-muted">{t('No build timestamp')}</span>}
            </TextContent>
          </CardBody>
        </Card>
        <Card>
          <CardTitle>Frameworks</CardTitle>
          <CardBody>
            {camelInt.metadata.annotations?.[METADATA_ANNOTATION_CAMEL_VERSION] && (
              <TextContent>
                <strong>Camel: </strong>{' '}
                {camelInt.metadata.annotations[METADATA_ANNOTATION_CAMEL_VERSION]}
              </TextContent>
            )}
            {camelInt.metadata.annotations?.[
              METADATA_ANNOTATION_CAMEL_QUARKUS_PLATFORM_VERSION
            ] && (
              <TextContent>
                <strong>Quarkus Platform: </strong>{' '}
                {camelInt.metadata.annotations[METADATA_ANNOTATION_CAMEL_QUARKUS_PLATFORM_VERSION]}
              </TextContent>
            )}
            {camelInt.metadata.annotations?.[METADATA_ANNOTATION_CAMEL_CEQ_VERSION] && (
              <TextContent>
                <strong>Camel Quarkus: </strong>{' '}
                {camelInt.metadata.annotations[METADATA_ANNOTATION_CAMEL_CEQ_VERSION]}
              </TextContent>
            )}

            {camelInt.metadata.annotations?.[METADATA_ANNOTATION_CAMEL_CSB_VERSION] && (
              <TextContent>
                <strong>Camel Spring Boot: </strong>{' '}
                {camelInt.metadata.annotations[METADATA_ANNOTATION_CAMEL_CSB_VERSION]}
              </TextContent>
            )}
            {camelInt.metadata.annotations?.[METADATA_ANNOTATION_CAMEL_SPRINGBOOT_VERSION] && (
              <TextContent>
                <strong>Spring Boot: </strong>{' '}
                {camelInt.metadata.annotations[METADATA_ANNOTATION_CAMEL_SPRINGBOOT_VERSION]}
              </TextContent>
            )}
          </CardBody>
        </Card>
      </CardBody>
    </Card>
  );
};

export default CamelIntegrationDetails;
