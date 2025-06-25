import * as React from 'react';
import {
  getGroupVersionKindForResource,
  K8sResourceKind,
  ResourceLink,
  RowProps,
  TableData,
} from '@openshift-console/dynamic-plugin-sdk';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Status from '@openshift-console/dynamic-plugin-sdk/lib/app/components/status/Status';
import { getCamelVersionAsString } from './camelAppVersion';
import CamelImage from '@images/camel.svg';
import CamelAppHealth from './CamelAppHealth';

const getKind = (obj) => obj.metadata.ownerReferences[0].kind;
const getNamespace = (obj) => obj.metadata?.namespace;
const getStatus = (obj) => (obj.status?.phase ? obj.status.phase : 'Unknown');
const getRuntimeProvider = (obj) =>
  obj.status?.pods && obj.status?.pods[0].runtime ? obj.status.pods[0].runtime.runtimeProvider : '';
const getCamelHealth = (obj) =>
  obj.status?.sliExchangeSuccessRate ? obj.status.sliExchangeSuccessRate.status : '';

// Check for a modified mouse event. For example - Ctrl + Click
const isModifiedEvent = (event: React.MouseEvent<HTMLElement>) => {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
};

const CamelAppRow: React.FC<RowProps<K8sResourceKind>> = ({ obj: camelInt, activeColumnIDs }) => {
  const { t } = useTranslation('plugin__camel-openshift-console-plugin');

  // Dead code ?
  const handleClick = (e) => {
    // Don't set last namespace if its modified click (Ctrl+Click).
    if (isModifiedEvent(e)) {
      return;
    }
  };

  return (
    <>
      <TableData id="name" activeColumnIDs={activeColumnIDs}>
        <span className="co-resource-item co-resource-item--truncate">
          <span className="co-m-resource-icon co-m-resource-camel">
            <img src={CamelImage} alt="Camel" className="camel-icon" />
          </span>

          <Link
            to={`/camel/app/ns/${camelInt.metadata.namespace}/name/${camelInt.metadata.name}`}
            className="co-resource-item__resource-name"
            title={camelInt.metadata.name}
            onClick={handleClick}
          >
            {camelInt.metadata.name}
          </Link>
        </span>
      </TableData>
      <TableData id="kind" activeColumnIDs={activeColumnIDs}>
        <span className="co-break-word co-line-clamp">
          <ResourceLink
            displayName={getKind(camelInt)}
            groupVersionKind={getGroupVersionKindForResource(camelInt.metadata.ownerReferences[0])}
            name={camelInt.metadata.ownerReferences[0].name}
            namespace={camelInt.metadata.namespace}
          />
        </span>
      </TableData>
      <TableData id="namespace" activeColumnIDs={activeColumnIDs}>
        <span className="co-break-word co-line-clamp">
          {getNamespace(camelInt) || <span className="text-muted">{t('No namespace')}</span>}
        </span>
      </TableData>
      <TableData id="status" activeColumnIDs={activeColumnIDs}>
        <Status status={getStatus(camelInt)} />
      </TableData>
      <TableData id="runtime" activeColumnIDs={activeColumnIDs}>
        {getRuntimeProvider(camelInt) || (
          <span className="text-muted">{t('No runtime provider')}</span>
        )}
      </TableData>
      <TableData id="camel" activeColumnIDs={activeColumnIDs}>
        {getCamelVersionAsString(camelInt, 'asc') || (
          <span className="text-muted">{t('No camel version')}</span>
        )}
      </TableData>
      <TableData id="health" activeColumnIDs={activeColumnIDs}>
        <CamelAppHealth health={getCamelHealth(camelInt)} />
      </TableData>
    </>
  );
};

export default CamelAppRow;
