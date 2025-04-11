import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ListPageBody,
  ListPageFilter,
  ListPageHeader,
  NamespaceBar,
  useActiveNamespace,
  useListPageFilter,
  VirtualizedTable,
} from '@openshift-console/dynamic-plugin-sdk';
import '../../camel.css';
import CamelAppRow from './CamelAppRow';
import useCamelAppColumns from './useCamelAppColumns';
import { useCamelAppList } from './useCamelAppList';
import { ALL_NAMESPACES_KEY } from '../../const';

// Note : using this as inspiration for the list: https://github.com/openshift-pipelines/console-plugin/blob/main/src/components/projects-list/ProjectsRow.tsx#L91

type CamelAppProps = {
  ns: string;
  showTitle?: boolean;
};

const CamelAppList: React.FC<CamelAppProps> = ({ ns, showTitle = true }) => {
  const { t } = useTranslation('plugin__camel-openshift-console-plugin');

  const [activeNamespace, setActiveNamespace] = useActiveNamespace();

  const filterCamelAppsNamespace = (activeNamespace: string): string => {
    return activeNamespace === ALL_NAMESPACES_KEY ? '' : activeNamespace;
  };

  const columns = useCamelAppColumns(filterCamelAppsNamespace(activeNamespace));
  const { CamelApps, loaded, error } = useCamelAppList(filterCamelAppsNamespace(activeNamespace));

  const [staticData, filteredData, onFilterChange] = useListPageFilter(CamelApps);

  // TODO add filters

  return (
    <>
      <NamespaceBar onNamespaceChange={setActiveNamespace} />

      <ListPageHeader title={t('Camel')} />

      <ListPageBody>
        <ListPageFilter data={staticData} onFilterChange={onFilterChange} loaded={loaded} />

        <VirtualizedTable
          EmptyMsg={() => (
            <div
              className="pf-v5-u-text-align-center virtualized-table-empty-msg"
              id="no-templates-msg"
            >
              {t('No resources found')}
            </div>
          )}
          columns={columns}
          data={filteredData}
          loaded={loaded}
          loadError={error}
          Row={CamelAppRow}
          unfilteredData={staticData}
        />
      </ListPageBody>
    </>
  );
};

export default CamelAppList;
