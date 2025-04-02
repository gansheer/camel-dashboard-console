import * as React from 'react';
import { Spinner } from '@patternfly/react-core';
import { useParams } from 'react-router-dom-v5-compat';
import { HorizontalNav, NamespaceBar } from '@openshift-console/dynamic-plugin-sdk';
import { useCamelIntegration } from './useCamelIntegration';
import { useCamelIntegrationTabs } from './useCamelIntegrationTabs';
import CamelIntegrationTitle from './CamelIntegrationTitle';

const CamelIntegration: React.FC = () => {
  const {
    ns: namespace,
    name,
    kind,
  } = useParams<{
    ns?: string;
    name?: string;
    kind?: string;
  }>();

  const { camelIntegration, isLoading, error } = useCamelIntegration(name, namespace, kind);

  const pages = useCamelIntegrationTabs(camelIntegration);

  // TODO A common loading spinner component
  if (isLoading) {
    return (
      <>
        <CamelIntegrationTitle name={name} namespace={namespace} />
        <Spinner />
      </>
    );
  }

  // TODO A common error component
  if (error) {
    return <>{error}</>;
  }

  return (
    <>
      <NamespaceBar isDisabled />
      <CamelIntegrationTitle name={name} namespace={namespace} />
      <HorizontalNav pages={pages} />
    </>
  );
};

export default CamelIntegration;
