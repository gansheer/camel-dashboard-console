# Camel Dashboard Operator

This project provides a [console plugin](https://github.com/openshift/console/tree/master/frontend/packages/console-dynamic-plugin-sdk) for [Camel](https://camel.apache.org).

## Prerequisites

* Kubernetes 1.19+
* [Camel Dashboard Operator](https://github.com/camel-tooling/camel-dashboard-operator)

## Installation procedure

Add repository
```
helm repo add camel-dashboard https://camel-tooling.github.io/camel-dashboard/charts
```

Install chart
```
$ helm install camel-dashboard-console camel-dashboard/camel-dashboard-console --version <version> --namespace camel-dashboard --set plugin.image=quay.io/camel-tooling/camel-dashboard-console:<version>
```


For more installation configuration on the Camel Dashboard Console please see the [installation documentation](https://camel-tooling.github.io/camel-dashboard/docs/installation-guide/console/).