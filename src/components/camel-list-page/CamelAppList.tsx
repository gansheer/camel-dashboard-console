import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  GreenCheckCircleIcon,
  ListPageBody,
  ListPageFilter,
  ListPageHeader,
  NamespaceBar,
  RedExclamationCircleIcon,
  useActiveNamespace,
  useListPageFilter,
  VirtualizedTable,
  YellowExclamationTriangleIcon,
} from '@openshift-console/dynamic-plugin-sdk';
import '../../camel.css';
import CamelAppRow from './CamelAppRow';
import useCamelAppColumns from './useCamelAppColumns';
import { useCamelAppList } from './useCamelAppList';
import { ALL_NAMESPACES_KEY } from '../../const';
import CamelImage from '@images/camel.svg';
import { camelAppRowFilters } from './useCamelAppRowFilters';
import { ToggleGroup, ToggleGroupItem } from '@patternfly/react-core';
//import { createIcon } from '@patternfly/react-icons/dist/esm/createIcon';

// Note : using this as inspiration for the list: https://github.com/openshift-pipelines/console-plugin/blob/main/src/components/projects-list/ProjectsRow.tsx#L91

type CamelAppProps = {
  ns: string;
  showTitle?: boolean;
};

const CamelAppList: React.FC<CamelAppProps> = () => {
  const { t } = useTranslation('plugin__camel-openshift-console-plugin');

  const [activeNamespace, setActiveNamespace] = useActiveNamespace();

  const filterCamelAppsNamespace = (activeNamespace: string): string => {
    return activeNamespace === ALL_NAMESPACES_KEY ? '' : activeNamespace;
  };

  const columns = useCamelAppColumns(filterCamelAppsNamespace(activeNamespace));
  const { CamelApps, loaded, error } = useCamelAppList(filterCamelAppsNamespace(activeNamespace));

  const [staticData, filteredData, onFilterChange] = useListPageFilter(
    CamelApps,
    camelAppRowFilters(CamelApps),
  );

  // TODO add filters

  return (
    <>
      <NamespaceBar onNamespaceChange={setActiveNamespace} />

      <ListPageHeader title={t('Camel Applications')} >
        <ToggleGroup aria-label="Default with single selectable" title='toto' >
          <ToggleGroupItem
            text="Success"
            buttonId="toggle-group-single-1"
            icon={<GreenCheckCircleIcon />}
          />
          <ToggleGroupItem
            text="Warning"
            buttonId="toggle-group-single-2"
            icon={<YellowExclamationTriangleIcon />}
          />
          <ToggleGroupItem
            text={t('Error')}
            buttonId="toggle-group-single-3"
            icon={<RedExclamationCircleIcon />}
          />
        </ToggleGroup>
      </ListPageHeader>

      <ListPageBody>
        <ListPageFilter
          data={staticData}
          onFilterChange={onFilterChange}
          loaded={loaded}
          rowFilters={camelAppRowFilters(CamelApps)}
        />




        <VirtualizedTable
          EmptyMsg={() => (
            <div
              className="pf-v5-u-text-align-center virtualized-table-empty-msg"
              id="no-templates-msg"
            >
              <img src={CamelImage} alt="Camel" width="50px" height="50px" />
              <br />
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
