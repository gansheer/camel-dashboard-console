import { RowFilter, RowFilterItem } from '@openshift-console/dynamic-plugin-sdk';
import { useTranslation } from 'react-i18next';
import { CamelAppKind } from '../../types';
import { getCamelVersions } from './camelAppVersion';

export function statusFilterReducer(app): string {
  return app.status?.phase;
}
export function statusFilter(input, app): boolean {
  const reduced = statusFilterReducer(app);
  if (input.selected?.length) {
    return input.selected.includes(reduced);
  }
  return true;
}

export function statusFilterItems(CamelApps: CamelAppKind[]): RowFilterItem[] {
  const statuses = [...new Set(CamelApps.map((app) => statusFilterReducer(app)))].sort();

  if (statuses?.length) {
    return statuses.map((version) => {
      return { id: version, title: version };
    });
  } else {
    return [];
  }
}

export function runtimeProviderFilterReducer(app): string {
  if (!app.status?.pods) {
    return 'unknown';
  }
  const runtimeProviderLower = app.status.pods[0]?.runtime?.runtimeProvider?.toLowerCase();
  if (runtimeProviderLower === undefined) {
    return 'unknown';
  } else if (runtimeProviderLower.includes('spring')) {
    return 'spring-boot';
  } else if (runtimeProviderLower.includes('quarkus')) {
    return 'quarkus';
  } else {
    return 'main';
  }
}

export function runtimeProviderFilter(input, app): boolean {
  const reduced = runtimeProviderFilterReducer(app);
  if (input.selected?.length) {
    return input.selected.includes(reduced);
  }
  return true;
}

export const runtimeProviderFilterItems: RowFilterItem[] = [
  { id: 'spring-boot', title: 'Spring-Boot' },
  { id: 'quarkus', title: 'Quarkus' },
  { id: 'main', title: 'Camel Main' },
];

export function camelVersionFilterReducer(app): string {
  const versions = getCamelVersions(app, 'asc');
  if (versions) {
    return versions.join();
  }
  return '';
}

export function camelVersionFilter(input, app): boolean {
  const versions = getCamelVersions(app, 'asc');
  if (input.selected?.length) {
    if (versions?.length) {
      return versions.some((version) => input.selected.includes(version));
    }
    return false;
  }
  return true;
}

export function camelVersionFilterItems(CamelApps: CamelAppKind[]): RowFilterItem[] {
  const versions = [
    ...new Set(
      CamelApps.map((app) => getCamelVersions(app, 'asc')).reduce((acc, camelVersions) => {
        if (camelVersions) {
          acc.push(...camelVersions.filter((version) => !!version));
        }
        return acc;
      }, []),
    ),
  ].sort();

  if (versions?.length) {
    return versions.map((version) => {
      return { id: version, title: version };
    });
  } else {
    return [];
  }
}

export function camelHealthFilterReducer(app): string {
  return app.status?.sliExchangeSuccessRate ? app.status.sliExchangeSuccessRate.status : 'Unknown';
}

export function camelHealthFilter(input, app): boolean {
  const reduced = camelHealthFilterReducer(app);
  if (input.selected?.length) {
    return input.selected.includes(reduced);
  }
  return true;
}

export function camelHealthFilterItems(CamelApps: CamelAppKind[]): RowFilterItem[] {
  const camelHealthes = [...new Set(CamelApps.map((app) => camelHealthFilterReducer(app)))].sort();

  if (camelHealthes?.length) {
    return camelHealthes.map((camelHealth) => {
      return { id: camelHealth, title: camelHealth };
    });
  } else {
    return [];
  }
}

export const camelAppRowFilters = (CamelApps: CamelAppKind[]): RowFilter[] => {
  const { t } = useTranslation('plugin__camel-openshift-console-plugin');
  return [
    {
      filterGroupName: t('Camel Health'),
      type: 'camel-health',
      reducer: camelHealthFilterReducer,
      filter: camelHealthFilter,
      items: camelHealthFilterItems(CamelApps),
    },
    {
      filterGroupName: t('Runtime Provider'),
      type: 'runtime-provider',
      reducer: runtimeProviderFilterReducer,
      filter: runtimeProviderFilter,
      items: runtimeProviderFilterItems,
    },
    {
      filterGroupName: t('Camel Version'),
      type: 'camel-version',
      reducer: camelVersionFilterReducer,
      filter: camelVersionFilter,
      items: camelVersionFilterItems(CamelApps),
    },
    {
      filterGroupName: t('Status'),
      type: 'status',
      reducer: statusFilterReducer,
      filter: statusFilter,
      items: statusFilterItems(CamelApps),
    },
  ];
};
