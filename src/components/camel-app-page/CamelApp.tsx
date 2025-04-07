import * as React from 'react';
import { Spinner } from '@patternfly/react-core';
import { useParams } from 'react-router-dom-v5-compat';
import { HorizontalNav, NamespaceBar } from '@openshift-console/dynamic-plugin-sdk';
import { useCamelApp } from './useCamelApp';
import { useCamelAppTabs } from './useCamelAppTabs';
import CamelAppTitle from './CamelAppTitle';

const CamelApp: React.FC = () => {
  const {
    ns: namespace,
    name,
    kind,
  } = useParams<{
    ns?: string;
    name?: string;
    kind?: string;
  }>();

  const { CamelApp, isLoading, error } = useCamelApp(name, namespace, kind);

  const pages = useCamelAppTabs(CamelApp);

  // TODO A common loading spinner component
  if (isLoading) {
    return (
      <>
        <CamelAppTitle name={name} namespace={namespace} />
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
      <CamelAppTitle name={name} namespace={namespace} />
      <HorizontalNav pages={pages} />
    </>
  );
};

export default CamelApp;
