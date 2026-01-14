export enum HealthStatus {
  HEALTHY = 'Healthy',
  DEGRADED = 'Degraded',
  CRITICAL = 'Critical',
  UNKNOWN = 'Unknown',
}

export function getHealthDisplayName(health: string, t: (key: string) => string): string {
  switch (health?.toLowerCase()) {
    case 'ok':
    case 'success':
      return t('Healthy');
    case 'warning':
      return t('Degraded');
    case 'error':
      return t('Critical');
    default:
      return t('Unknown');
  }
}

export function getHealthStatus(health: string): HealthStatus {
  switch (health?.toLowerCase()) {
    case 'ok':
    case 'success':
      return HealthStatus.HEALTHY;
    case 'warning':
      return HealthStatus.DEGRADED;
    case 'error':
      return HealthStatus.CRITICAL;
    default:
      return HealthStatus.UNKNOWN;
  }
}
