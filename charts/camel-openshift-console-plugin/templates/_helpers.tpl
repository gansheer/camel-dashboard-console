{{/*
Expand the name of the chart.
*/}}
{{- define "camel-openshift-console-plugin.name" -}}
{{- default (default .Chart.Name .Release.Name) .Values.plugin.name | trunc 63 | trimSuffix "-" }}
{{- end }}


{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "camel-openshift-console-plugin.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "camel-openshift-console-plugin.labels" -}}
helm.sh/chart: {{ include "camel-openshift-console-plugin.chart" . }}
{{ include "camel-openshift-console-plugin.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "camel-openshift-console-plugin.selectorLabels" -}}
app: {{ include "camel-openshift-console-plugin.name" . }}
app.kubernetes.io/name: {{ include "camel-openshift-console-plugin.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/part-of: {{ include "camel-openshift-console-plugin.name" . }}
{{- end }}

{{/*
Create the name secret containing the certificate
*/}}
{{- define "camel-openshift-console-plugin.certificateSecret" -}}
{{ default (printf "%s-cert" (include "camel-openshift-console-plugin.name" .)) .Values.plugin.certificateSecretName }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "camel-openshift-console-plugin.serviceAccountName" -}}
{{- if .Values.plugin.serviceAccount.create }}
{{- default (include "camel-openshift-console-plugin.name" .) .Values.plugin.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.plugin.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
Create the name of the patcher
*/}}
{{- define "camel-openshift-console-plugin.patcherName" -}}
{{- printf "%s-patcher" (include "camel-openshift-console-plugin.name" .) }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "camel-openshift-console-plugin.patcherServiceAccountName" -}}
{{- if .Values.plugin.patcherServiceAccount.create }}
{{- default (printf "%s-patcher" (include "camel-openshift-console-plugin.name" .)) .Values.plugin.patcherServiceAccount.name }}
{{- else }}
{{- default "default" .Values.plugin.patcherServiceAccount.name }}
{{- end }}
{{- end }}
