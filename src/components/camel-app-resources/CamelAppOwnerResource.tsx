import * as React from 'react';
import { Card, CardBody, CardTitle } from '@patternfly/react-core';
import {
  K8sGroupVersionKind,
  K8sResourceKind,
  ResourceLink,
} from '@openshift-console/dynamic-plugin-sdk';

type CamelAppOwnerResourceProps = {
  obj: K8sResourceKind;
  gvk: K8sGroupVersionKind;
};

const CamelAppOwnerResource: React.FC<CamelAppOwnerResourceProps> = ({
  obj: camelAppOwner,
  gvk: ownerGvk,
}) => {
  return (
    <Card>
      <CardTitle>{camelAppOwner.kind}</CardTitle>
      <CardBody>
        <ul className="list-group">
          <li className="list-group-item">
            <ResourceLink
              groupVersionKind={ownerGvk}
              name={camelAppOwner.metadata.name}
              namespace={camelAppOwner.metadata.namespace}
            />
          </li>
        </ul>
      </CardBody>
    </Card>
  );
};

export default CamelAppOwnerResource;
