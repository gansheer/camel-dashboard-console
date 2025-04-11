import { K8sResourceKind } from '@openshift-console/dynamic-plugin-sdk';

export const sortResourceByCamelVersion =
  (direction: string) => (a: K8sResourceKind, b: K8sResourceKind) => {
    const { first, second } =
      direction === 'asc' ? { first: a, second: b } : { first: b, second: a };

    const firstValue = getCamelVersions(first, direction);
    const secondValue = getCamelVersions(second, direction);

    return firstValue[0]?.localeCompare(secondValue[0]);
  };

export const getCamelVersions = (camelInt: K8sResourceKind, direction: string): string[] => {
  if (direction == 'asc') {
    return camelInt.status?.pods
      ?.map((pod) => pod.runtime.camelVersion)
      .reduce((acc, item) => {
        if (!acc.includes(item)) acc.push(item);
        return acc;
      }, [])
      .sort();
  } else {
    return camelInt.status?.pods
      ?.map((pod) => pod.runtime.camelVersion)
      .reduce((acc, item) => {
        if (!acc.includes(item)) acc.push(item);
        return acc;
      }, [])
      .sort()
      .reverse();
  }
};

export const getCamelVersionAsString = (camelInt: K8sResourceKind, direction: string): string => {
  return getCamelVersions(camelInt, direction).join(',');
};
