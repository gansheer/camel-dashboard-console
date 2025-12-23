import * as React from 'react';
import { Card, CardBody, CardTitle, Spinner } from '@patternfly/react-core';

type ResourceLoadingCardProps = {
  title: string;
};

const ResourceLoadingCard: React.FC<ResourceLoadingCardProps> = ({ title }) => {
  return (
    <Card>
      <CardTitle>{title}</CardTitle>
      <CardBody>
        <Spinner />
      </CardBody>
    </Card>
  );
};

export default ResourceLoadingCard;
