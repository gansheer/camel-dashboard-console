import * as React from 'react';
import { CamelAppKind } from '../../types';
import CamelAppPods from './CamelAppPods';
import CamelAppServices from './CamelAppServices';
import CamelAppRoutes from './CamelAppRoutes';
import { Card, CardBody, CardTitle } from '@patternfly/react-core';
import CamelAppJobs from './CamelAppJobs';

type CamelAppResourcesProps = {
  obj: CamelAppKind;
};

// TODO : add volumes
const CamelAppResources: React.FC<CamelAppResourcesProps> = ({ obj: camelInt }) => {
  return (
    <Card>
      <CardTitle>Resources</CardTitle>
      <CardBody>
        <CamelAppPods obj={camelInt} />
        <CamelAppJobs obj={camelInt} />
        <CamelAppServices obj={camelInt} />
        <CamelAppRoutes obj={camelInt} />
      </CardBody>
    </Card>
  );
};

export default CamelAppResources;
