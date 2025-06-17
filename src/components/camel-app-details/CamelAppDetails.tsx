import * as React from 'react';
import { CamelAppKind } from '../../types';
import {
  Card,
  CardBody,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  TextList,
  TextListItem,
} from '@patternfly/react-core';
import { useTranslation } from 'react-i18next';
import { K8sGroupVersionKind, ResourceLink } from '@openshift-console/dynamic-plugin-sdk';
import { camelAppGVK } from '../../const';
import CamelAppStatusPod from './CamelAppStatusPod';
import CamelAppHealth from '../camel-list-page/CamelAppHealth';
import { PopoverCamelHealth } from './CamelAppHealthPopover';
import { formatDuration } from '../../date-utils';

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

  return (
    <div className="co-m-pane__body">
      <h2>{t('Camel App Details')}</h2>
      <Card>
        <CardBody>
          <h4>
            <ResourceLink
              displayName={camelInt.metadata.name}
              groupVersionKind={camelAppGVK}
              name={camelInt.metadata.name}
              namespace={camelInt.metadata.namespace}
            />
          </h4>

          <DescriptionList
            columnModifier={{
              default: '1Col',
            }}
          >
            <DescriptionListGroup>
              <DescriptionListTerm>{t('Image')}:</DescriptionListTerm>
              <DescriptionListDescription>{camelInt.status.image}</DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>
                <PopoverCamelHealth popoverBody={t('Health') + ' :'} />
              </DescriptionListTerm>
              <DescriptionListDescription>
                <CamelAppHealth
                  health={
                    camelInt.status.sliExchangeSuccessRate?.status
                      ? camelInt.status.sliExchangeSuccessRate?.status
                      : ''
                  }
                />
              </DescriptionListDescription>
            </DescriptionListGroup>
            {camelInt.status.sliExchangeSuccessRate ? (
              <DescriptionListGroup>
                <DescriptionListTerm>{t('Percentage of success rate')}:</DescriptionListTerm>
                <DescriptionListDescription>
                  <TextList>
                    <TextListItem>
                      <strong>{t('Sampling interval')}: </strong>
                      {formatDuration(
                        camelInt.status.sliExchangeSuccessRate.samplingInterval / 1000000,
                        { omitSuffix: true },
                      )}
                    </TextListItem>
                    <TextListItem>
                      <strong>{t('Failed exchanges')}: </strong>
                      {camelInt.status.sliExchangeSuccessRate.samplingIntervalFailed | 0}
                    </TextListItem>
                    <TextListItem>
                      <strong>{t('Total exchanges')}: </strong>
                      {camelInt.status.sliExchangeSuccessRate.samplingIntervalTotal}
                    </TextListItem>
                    <TextListItem>
                      <strong>{t('Success percentage')}: </strong>
                      {camelInt.status.sliExchangeSuccessRate.successPercentage} %
                    </TextListItem>
                  </TextList>
                </DescriptionListDescription>
              </DescriptionListGroup>
            ) : (
              <></>
            )}
          </DescriptionList>
        </CardBody>
      </Card>

      <ul className="list-group">
        {camelInt.status.pods
          ? camelInt.status.pods.map((pod, i) => {
              return (
                <li key={i} className="list-group-item">
                  <CamelAppStatusPod obj={camelInt} pod={pod} />
                </li>
              );
            })
          : ''}
      </ul>
    </div>
  );
};

export default CamelAppDetails;
