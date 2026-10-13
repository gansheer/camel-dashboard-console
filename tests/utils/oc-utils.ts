import { execSync } from 'child_process';

export function execOc(command: string): string {
  try {
    return execSync(`oc ${command}`, {
      encoding: 'utf-8',
      stdio: 'pipe',
    }).trim();
  } catch (error: unknown) {
    const err = error as Error & { stderr?: string };
    throw new Error(`oc execution failed: ${err.stderr || err.message}`);
  }
}

export function ocApplyYaml(yamlContent: string): string {
  try {
    return execSync('oc apply -f -', {
      input: yamlContent,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();
  } catch (error: unknown) {
    const err = error as Error & { stderr?: string };
    throw new Error(`oc apply failed: ${err.stderr || err.message}`);
  }
}

export function ocDelete(resource: string, name: string, namespace?: string): string {
  const nsFlag = namespace ? `-n ${namespace}` : '';
  try {
    return execSync(`oc delete ${resource} ${name} ${nsFlag} --ignore-not-found`, {
      encoding: 'utf-8',
      stdio: 'pipe',
    }).trim();
  } catch (error: unknown) {
    const err = error as Error & { stderr?: string };
    throw new Error(`oc delete failed: ${err.stderr || err.message}`);
  }
}
