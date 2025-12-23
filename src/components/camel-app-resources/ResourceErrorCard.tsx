import * as React from 'react';
import { Card, CardBody, CardTitle, Label } from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';

type ResourceErrorCardProps = {
  title: string;
  error: string;
};

const ResourceErrorCard: React.FC<ResourceErrorCardProps> = ({ title, error }) => {
  return (
    <Card>
      <CardTitle>{title}</CardTitle>
      <CardBody>
        <Label color="red" icon={<ExclamationCircleIcon />}>
          {error}
        </Label>
      </CardBody>
    </Card>
  );
};

export default ResourceErrorCard;
