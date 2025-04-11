import * as React from 'react';
import { CamelAppKind } from '../../types';
import CamelAppPods from './CamelAppPods';
import CamelAppServices from './CamelAppServices';
import CamelAppRoutes from './CamelAppRoutes';
import CamelAppOwnerResource from './CamelAppOwnerResource';
import { Card, CardBody, CardTitle, Spinner } from '@patternfly/react-core';
import CamelAppJobs from './CamelAppJobs';
import { CamelAppOwnerGVK } from '../../utils';
import { useCamelAppOwner } from './useCamelAppResources';

type CamelAppResourcesProps = {
  obj: CamelAppKind;
};

// TODO : add volumes
const CamelAppResources: React.FC<CamelAppResourcesProps> = ({ obj: camelInt }) => {
  const ownerReference = camelInt.metadata.ownerReferences[0];
  const ownerGvk = CamelAppOwnerGVK(ownerReference.kind);

  const { CamelAppOwner, isLoading, error } = useCamelAppOwner(
    ownerReference.name,
    camelInt.metadata.namespace,
    ownerGvk,
  );

  // TODO A common loading spinner component
  if (isLoading) {
    return (
      <>
        <Card>
          <CardTitle>Resources</CardTitle>
          <CardBody>
            <Spinner />
          </CardBody>
        </Card>
      </>
    );
  }

  // TODO A common error component
  if (error) {
    return <>{error}</>;
  }

  return (
    <Card>
      <CardBody>
        <CamelAppOwnerResource obj={CamelAppOwner} gvk={ownerGvk} />
        <CamelAppPods obj={CamelAppOwner} />
        <CamelAppJobs obj={CamelAppOwner} />
        <CamelAppServices obj={CamelAppOwner} />
        <CamelAppRoutes obj={CamelAppOwner} />
      </CardBody>
    </Card>
  );
};

export default CamelAppResources;
