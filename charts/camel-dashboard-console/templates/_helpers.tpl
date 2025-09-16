{{/*
Expand the name of the chart.
*/}}
{{- define "camel-dashboard-console.name" -}}
{{- default (default .Chart.Name .Release.Name) .Values.plugin.name | trunc 63 | trimSuffix "-" }}
{{- end }}


{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "camel-dashboard-console.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "camel-dashboard-console.labels" -}}
helm.sh/chart: {{ include "camel-dashboard-console.chart" . }}
{{ include "camel-dashboard-console.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "camel-dashboard-console.selectorLabels" -}}
app: {{ include "camel-dashboard-console.name" . }}
app.kubernetes.io/name: {{ include "camel-dashboard-console.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/part-of: {{ include "camel-dashboard-console.name" . }}
{{- end }}

{{/*
Create the name secret containing the certificate
*/}}
{{- define "camel-dashboard-console.certificateSecret" -}}
{{ default (printf "%s-cert" (include "camel-dashboard-console.name" .)) .Values.plugin.certificateSecretName }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "camel-dashboard-console.serviceAccountName" -}}
{{- if .Values.plugin.serviceAccount.create }}
{{- default (include "camel-dashboard-console.name" .) .Values.plugin.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.plugin.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
Create the name of the patcher
*/}}
{{- define "camel-dashboard-console.patcherName" -}}
{{- printf "%s-patcher" (include "camel-dashboard-console.name" .) }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "camel-dashboard-console.patcherServiceAccountName" -}}
{{- if .Values.plugin.patcherServiceAccount.create }}
{{- default (printf "%s-patcher" (include "camel-dashboard-console.name" .)) .Values.plugin.patcherServiceAccount.name }}
{{- else }}
{{- default "default" .Values.plugin.patcherServiceAccount.name }}
{{- end }}
{{- end }}
