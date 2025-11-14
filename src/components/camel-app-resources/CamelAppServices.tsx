import * as React from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  Spinner,
  DataList,
  DataListItem,
  DataListItemRow,
  DataListItemCells,
  DataListCell,
  List,
  ListItem,
} from '@patternfly/react-core';
import { K8sResourceKind, ResourceLink } from '@openshift-console/dynamic-plugin-sdk';
import { serviceGVK } from '../../const';
import { useCamelAppServices } from './useCamelAppResources';
import { LongArrowAltRightIcon } from '@patternfly/react-icons';
import { useTranslation } from 'react-i18next';

type CamelAppServicesProps = {
  obj: K8sResourceKind;
};

type Resources = {
  name: string;
  ports: [];
};

const CamelAppServices: React.FC<CamelAppServicesProps> = ({ obj: camelAppOwner }) => {
  const { t } = useTranslation('plugin__camel-dashboard-console');

  const services: Resources[] = [];

  const { CamelAppServices, loaded: loadedServices } = useCamelAppServices(
    camelAppOwner.metadata.namespace,
    camelAppOwner.metadata.name,
  );
  if (loadedServices && CamelAppServices.length > 0) {
    CamelAppServices.forEach((service) => {
      services.push({
        name: service.metadata.name,
        ports: service.spec?.ports ?? [],
      });
    });
  }

  if (!loadedServices) {
    return (
      <Card>
        <CardTitle>Services</CardTitle>
        <CardBody>
          <Spinner />
        </CardBody>
      </Card>
    );
  }

  if (loadedServices && services.length == 0) {
    return <></>;
  }

  return (
    <Card>
      <CardTitle>Services</CardTitle>
      <CardBody>
        <DataList aria-label="Services list" isCompact>
          {services.map((resource, i) => {
            return (
              <DataListItem key={i}>
                <DataListItemRow>
                  <DataListItemCells
                    dataListCells={[
                      <DataListCell key="service">
                        <ResourceLink
                          groupVersionKind={serviceGVK}
                          name={resource.name}
                          namespace={camelAppOwner.metadata.namespace}
                        />
                        {resource.ports.length > 0 && (
                          <List isPlain>
                            {resource.ports.map(({ name, port, protocol, targetPort }) => (
                              <ListItem key={name || `${protocol}/${port}`}>
                                <span style={{ color: 'var(--pf-v6-global--Color--200)' }}>
                                  {t('Service port:')}
                                </span>{' '}
                                {name || `${protocol}/${port}`}
                                &nbsp;
                                <LongArrowAltRightIcon />
                                &nbsp;
                                <span style={{ color: 'var(--pf-v6-global--Color--200)' }}>
                                  {t('Pod port:')}
                                </span>{' '}
                                {targetPort}
                              </ListItem>
                            ))}
                          </List>
                        )}
                      </DataListCell>,
                    ]}
                  />
                </DataListItemRow>
              </DataListItem>
            );
          })}
        </DataList>
      </CardBody>
    </Card>
  );
};

export default CamelAppServices;
