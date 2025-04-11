import {
  K8sGroupVersionKind,
  K8sResourceKind,
  Selector,
  useK8sWatchResource,
  useK8sWatchResources,
} from '@openshift-console/dynamic-plugin-sdk';
import { cronJobGVK, jobGVK, podGVK, routeGVK, serviceGVK } from '../../const';

export const useCamelAppOwner = (
  name: string,
  namespace: string,
  gvk: K8sGroupVersionKind,
): { CamelAppOwner: K8sResourceKind; isLoading: boolean; error: string } => {
  const [CamelAppOwner, loaded, loadError] = useK8sWatchResource<K8sResourceKind>({
    name: name,
    namespace: namespace,
    groupVersionKind: gvk,
    isList: false,
  });

  return { CamelAppOwner, isLoading: !loaded, error: loadError };
};

export const useCamelAppPods = (
  namespace: string,
  parentKind: string,
  match: Selector,
): { CamelAppPods: K8sResourceKind[]; loaded: boolean; error: string } => {
  console.log(parentKind);
  if (parentKind == cronJobGVK.kind) {
    // get pods for cronjob
    const resources = useK8sWatchResources<{
      jobs: K8sResourceKind[];
      pods: K8sResourceKind[];
    }>({
      jobs: {
        isList: true,
        groupVersionKind: jobGVK,
        namespaced: true,
        namespace: namespace,
        selector: match,
      },
      pods: {
        isList: true,
        groupVersionKind: podGVK,
        namespaced: true,
        namespace: namespace,
        selector: match,
      },
    });

    const jobsUids: string[] = [];

    if (resources.jobs.loaded && resources.jobs.data.length > 0) {
      resources.jobs.data.forEach((job) => jobsUids.push(job.metadata.uid));
    }

    console.log(jobsUids);
    if (resources.pods.data.length > 0) {
      resources.pods.data = resources.pods.data.filter((pod) =>
        jobsUids.includes(pod.metadata?.labels['batch.kubernetes.io/controller-uid']),
      );
    }

    return {
      CamelAppPods: resources.pods.data,
      loaded: resources.pods.loaded,
      error: resources.pods.loadError,
    };
  } else {
    // get pods default
    const resources = useK8sWatchResources<{
      pods: K8sResourceKind[];
    }>({
      pods: {
        isList: true,
        groupVersionKind: podGVK,
        namespaced: true,
        namespace: namespace,
        selector: match,
      },
    });

    return {
      CamelAppPods: resources.pods.data,
      loaded: resources.pods.loaded,
      error: resources.pods.loadError,
    };
  }
};

export const useCamelAppJobs = (
  namespace: string,
  match: Selector,
): { CamelAppJobs: K8sResourceKind[]; loaded: boolean; error: string } => {
  const resources = useK8sWatchResources<{
    jobs: K8sResourceKind[];
  }>({
    jobs: {
      isList: true,
      groupVersionKind: jobGVK,
      namespaced: true,
      namespace: namespace,
      selector: match,
    },
  });

  return {
    CamelAppJobs: resources.jobs.data,
    loaded: resources.jobs.loaded,
    error: resources.jobs.loadError,
  };
};

export const useCamelAppServices = (
  namespace: string,
  match: Selector,
): { CamelAppServices: K8sResourceKind[]; loaded: boolean; error: string } => {
  const resources = useK8sWatchResources<{
    services: K8sResourceKind[];
  }>({
    services: {
      isList: true,
      groupVersionKind: serviceGVK,
      namespaced: true,
      namespace: namespace,
      selector: match,
    },
  });

  return {
    CamelAppServices: resources.services.data,
    loaded: resources.services.loaded,
    error: resources.services.loadError,
  };
};
export const useCamelAppRoutes = (
  namespace: string,
  servicesMatch: Selector,
): { CamelAppRoutes: K8sResourceKind[]; loaded: boolean; error: string } => {
  const resources = useK8sWatchResources<{
    routes: K8sResourceKind[];
    services: K8sResourceKind[];
  }>({
    routes: {
      isList: true,
      groupVersionKind: routeGVK,
      namespaced: true,
      namespace: namespace,
    },
    services: {
      isList: true,
      groupVersionKind: serviceGVK,
      namespaced: true,
      namespace: namespace,
      selector: servicesMatch,
    },
  });

  const servicesNames: string[] = [];

  if (resources.services.loaded && resources.services.data.length > 0) {
    resources.services.data.forEach((service) => servicesNames.push(service.metadata.name));
  }

  if (resources.routes.data.length > 0) {
    resources.routes.data = resources.routes.data.filter((route) =>
      servicesNames.includes(route.spec?.to?.name),
    );
  }

  return {
    CamelAppRoutes: resources.routes.data,
    loaded: resources.routes.loaded,
    error: resources.routes.loadError,
  };
};
