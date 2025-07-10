import { CamelAppKind } from '../../types';
import * as React from 'react';
import { Overview, OverviewGrid } from '@openshift-console/dynamic-plugin-sdk';
import CamelAppMemoryCard from './CamelAppMemoryCard';
import CamelAppCPUCard from './CamelAppCPUCard';

export type CamelAppMetricsProps = {
  obj: CamelAppKind;
};

const CamelAppMetrics: React.FC<CamelAppMetricsProps> = ({ obj: camelInt }) => {
  const mainCards = [
    { Card: () => <CamelAppCPUCard obj={camelInt} /> },
    { Card: () => <CamelAppMemoryCard obj={camelInt} /> },
  ];

  return (
    <Overview className="co-dashboard-body">
      <OverviewGrid mainCards={mainCards} />
    </Overview>
  );
};

export default CamelAppMetrics;
