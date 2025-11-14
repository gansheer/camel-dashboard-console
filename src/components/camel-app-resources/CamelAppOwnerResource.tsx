import * as React from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  Content,
  DataList,
  DataListItem,
  DataListItemRow,
  DataListItemCells,
  DataListCell,
} from '@patternfly/react-core';
import {
  K8sGroupVersionKind,
  K8sResourceKind,
  ResourceLink,
} from '@openshift-console/dynamic-plugin-sdk';
import { Link } from 'react-router-dom-v5-compat';
import { useTranslation } from 'react-i18next';

type CamelAppOwnerResourceProps = {
  obj: K8sResourceKind;
  gvk: K8sGroupVersionKind;
};

const CamelAppOwnerResource: React.FC<CamelAppOwnerResourceProps> = ({
  obj: camelAppOwner,
  gvk: ownerGvk,
}) => {
  const { t } = useTranslation('plugin__camel-dashboard-console');

  return (
    <Card>
      <CardTitle>{camelAppOwner.kind}</CardTitle>
      <CardBody>
        <DataList aria-label={`${camelAppOwner.kind} list`} isCompact>
          <DataListItem>
            <DataListItemRow>
              <DataListItemCells
                dataListCells={[
                  <DataListCell key="name" width={3}>
                    <ResourceLink
                      groupVersionKind={ownerGvk}
                      name={camelAppOwner.metadata.name}
                      namespace={camelAppOwner.metadata.namespace}
                    />
                  </DataListCell>,
                  <DataListCell key="dashboards" width={2} alignRight>
                    <Content>
                      <Link
                        to={`/dev-monitoring/ns/${camelAppOwner.metadata.namespace}?dashboard=dashboard-k8s-resources-workload&workload=${camelAppOwner.metadata.name}&type=ALL_OPTIONS_KEY`}
                      >
                        {t('View dashboards')}
                      </Link>
                    </Content>
                  </DataListCell>,
                ]}
              />
            </DataListItemRow>
          </DataListItem>
        </DataList>
      </CardBody>
    </Card>
  );
};

export default CamelAppOwnerResource;
