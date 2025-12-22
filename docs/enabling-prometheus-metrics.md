# Enabling Prometheus Metrics for Camel Applications in OpenShift

This guide explains how to configure Prometheus to scrape metrics from your Camel application deployed in OpenShift.

## Overview

To enable Prometheus monitoring for a Camel application in OpenShift, you need to:

1. Enable user workload monitoring in OpenShift
2. Create a Kubernetes Service to expose the metrics endpoint
3. Create a ServiceMonitor resource to tell Prometheus where to scrape
4. Label the namespace for user workload monitoring

## Prerequisites

- OpenShift cluster (or CRC for local development)
- A Camel application exposing metrics at `/observe/metrics` (or similar endpoint)
- The application must have Micrometer metrics enabled
- `oc` CLI tool configured and authenticated

## Step 1: Enable User Workload Monitoring

User workload monitoring allows Prometheus to scrape metrics from user applications (not just cluster infrastructure).

Create a ConfigMap to enable user workload monitoring:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: cluster-monitoring-config
  namespace: openshift-monitoring
data:
  config.yaml: |
    enableUserWorkload: true
```

Apply the configuration:

```bash
oc apply -f cluster-monitoring-config.yaml
```

Verify that user workload monitoring pods are running:

```bash
oc get pods -n openshift-user-workload-monitoring
```

You should see pods like `prometheus-user-workload-0` running.

## Step 2: Configure Namespace Labels

The namespace containing your Camel application must have the correct label for user workload monitoring.

**Important:** Remove any cluster monitoring label and add the user monitoring label:

```bash
# Remove cluster-monitoring label if it exists
oc label namespace <your-namespace> openshift.io/cluster-monitoring-

# Add user-monitoring label
oc label namespace <your-namespace> openshift.io/user-monitoring=true
```

Example for a namespace called `camel-dashboard`:

```bash
oc label namespace camel-dashboard openshift.io/cluster-monitoring-
oc label namespace camel-dashboard openshift.io/user-monitoring=true
```

## Step 3: Create a Service

Create a Kubernetes Service to expose your application's metrics endpoint.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: <your-app-name>
  namespace: <your-namespace>
  labels:
    app: <your-app-name>
spec:
  selector:
    app: <your-app-name>
  ports:
  - name: management
    port: 9876              # Port where metrics are exposed
    targetPort: 9876        # Container port
    protocol: TCP
```

Example for an application called `camel-app-main`:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: camel-app-main
  namespace: camel-dashboard
  labels:
    app: camel-app-main
spec:
  selector:
    app: camel-app-main
  ports:
  - name: management
    port: 9876
    targetPort: 9876
    protocol: TCP
```

Apply the service:

```bash
oc apply -f service.yaml
```

Verify the service endpoints are healthy:

```bash
oc get endpoints <your-service-name> -n <your-namespace>
```

You should see the pod IP and port listed.

## Step 4: Create a ServiceMonitor

Create a ServiceMonitor resource to configure Prometheus scraping.

**Important:** The ServiceMonitor must have the label `openshift.io/user-monitoring: "true"` to be discovered by the user workload Prometheus.

```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: <your-app-name>-metrics
  namespace: <your-namespace>
  labels:
    app: <your-app-name>
    openshift.io/user-monitoring: "true"  # Required for discovery
spec:
  selector:
    matchLabels:
      app: <your-app-name>  # Must match Service labels
  endpoints:
  - port: management        # Must match Service port name
    path: /observe/metrics  # Metrics endpoint path
    scheme: http
    interval: 30s           # Scrape interval
```

Example for `camel-app-main`:

```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: camel-app-main-metrics
  namespace: camel-dashboard
  labels:
    app: camel-app-main
    openshift.io/user-monitoring: "true"
spec:
  selector:
    matchLabels:
      app: camel-app-main
  endpoints:
  - port: management
    path: /observe/metrics
    scheme: http
    interval: 30s
```

Apply the ServiceMonitor:

```bash
oc apply -f servicemonitor.yaml
```

## Step 5: Verify Configuration

### Check Prometheus Targets

Wait 30-60 seconds for Prometheus to discover the ServiceMonitor, then check if your application appears in the targets:

```bash
oc -n openshift-user-workload-monitoring exec prometheus-user-workload-0 -c prometheus -- \
  sh -c "curl -s http://localhost:9090/api/v1/targets" | grep -i <your-app-name>
```

Look for:
- `"health": "up"` - Target is healthy
- `"lastError": ""` - No scraping errors
- `"scrapeUrl": "http://<pod-ip>:<port>/observe/metrics"` - Correct endpoint

### Query Metrics from Prometheus

Test querying a Camel metric directly:

```bash
oc -n openshift-user-workload-monitoring exec prometheus-user-workload-0 -c prometheus -- \
  sh -c 'curl -s "http://localhost:9090/api/v1/query?query=camel_exchanges_total"'
```

You should see JSON output with metric data.

### View in OpenShift Console

1. Navigate to **Observe → Metrics** in the OpenShift web console
2. Switch to **Custom query** mode
3. Enter a query like: `sum(rate(camel_exchanges_total[5m])) by (pod)`
4. You should see data points in the graph

Alternatively, view targets at **Observe → Targets** and search for your application name.

## Common Issues and Troubleshooting

### ServiceMonitor Not Discovered

**Symptom:** No targets appear in Prometheus for your application.

**Solutions:**

1. Verify the ServiceMonitor has the required label:
   ```bash
   oc get servicemonitor <name> -n <namespace> -o yaml | grep "openshift.io/user-monitoring"
   ```

2. Verify the namespace has the correct label:
   ```bash
   oc get namespace <namespace> -o yaml | grep "openshift.io"
   ```
   Should show `openshift.io/user-monitoring: "true"` and NOT `openshift.io/cluster-monitoring: "true"`

3. Check Prometheus serviceMonitorSelector requirements:
   ```bash
   oc get prometheus user-workload -n openshift-user-workload-monitoring -o yaml | grep -A10 serviceMonitorSelector
   ```

### Target Shows as Down

**Symptom:** Target appears in Prometheus but health is "down" or shows errors.

**Solutions:**

1. Verify the Service has healthy endpoints:
   ```bash
   oc get endpoints <service-name> -n <namespace>
   ```

2. Test the metrics endpoint directly:
   ```bash
   oc exec -n <namespace> <pod-name> -- curl -s http://localhost:<port>/observe/metrics
   ```

3. Check ServiceMonitor configuration matches Service:
   - Port name in ServiceMonitor must match Service port name
   - Path must be correct
   - Namespace must match

### No Metrics Appearing

**Symptom:** Target is up but no metrics data appears.

**Solutions:**

1. Verify your Camel application is actually exposing metrics:
   ```bash
   oc exec -n <namespace> <pod-name> -- curl http://localhost:<port>/observe/metrics
   ```
   Should return Prometheus-formatted metrics like:
   ```
   camel_exchanges_total{routeId="route1"} 1234.0
   ```

2. Check that Micrometer is properly configured in your Camel application

3. Verify the application is processing messages (metrics will be 0 if no activity)

## Example Queries

Once metrics are being scraped, you can use these PromQL queries:

```promql
# Total exchanges across all routes
camel_exchanges_total

# Rate of exchanges per second over 5 minutes
sum(rate(camel_exchanges_total[5m])) by (pod)

# Exchanges by route
sum(rate(camel_exchanges_total[5m])) by (routeId)

# Failed exchanges
camel_exchanges_failed_total

# Exchange completion time (if available)
rate(camel_exchange_completion_time_seconds_sum[5m]) / rate(camel_exchange_completion_time_seconds_count[5m])
```

## Additional Resources

- [OpenShift Monitoring Documentation](https://docs.openshift.com/container-platform/latest/monitoring/enabling-monitoring-for-user-defined-projects.html)
- [Prometheus Operator ServiceMonitor](https://github.com/prometheus-operator/prometheus-operator/blob/main/Documentation/api.md#servicemonitor)
- [Apache Camel Micrometer Documentation](https://camel.apache.org/components/latest/micrometer-component.html)
