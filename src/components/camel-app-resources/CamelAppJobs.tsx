import * as React from 'react';
import { useCamelAppJobs } from './useCamelAppResources';
import { Card, CardBody, CardTitle, Spinner } from '@patternfly/react-core';
import { jobGVK } from '../../const';
import { K8sResourceKind, ResourceLink } from '@openshift-console/dynamic-plugin-sdk';
import Status from '@openshift-console/dynamic-plugin-sdk/lib/app/components/status/Status';

type CamelAppJobsProps = {
  obj: K8sResourceKind;
};

type Resources = {
  name: string;
  status: string;
};

const CamelAppJobs: React.FC<CamelAppJobsProps> = ({ obj: camelAppOwner }) => {
  const jobs: Resources[] = [];

  const { CamelAppJobs, loaded: loadedJobs } = useCamelAppJobs(
    camelAppOwner.metadata.namespace,
    camelAppOwner.spec.selector,
  );
  if (loadedJobs && CamelAppJobs.length > 0) {
    CamelAppJobs.forEach((job) => {
      getJobsStatus(job);
      jobs.push({
        name: job.metadata.name,
        status: getJobsStatus(job),
      });
    });
  }
  if (!loadedJobs) {
    return (
      <Card>
        <CardTitle>Jobs</CardTitle>
        <CardBody>
          <Spinner />
        </CardBody>
      </Card>
    );
  }

  if (loadedJobs && jobs.length == 0) {
    return <></>;
  }

  return (
    <Card>
      <CardTitle>Jobs</CardTitle>
      <CardBody>
        <ul className="list-group">
          {jobs.map((resource, i) => {
            return (
              <li key={i} className="list-group-item container-fluid">
                <div className="row">
                  <span className="col-xs-8">
                    <ResourceLink
                      groupVersionKind={jobGVK}
                      name={resource.name}
                      namespace={camelAppOwner.metadata.namespace}
                    />
                  </span>
                  <span className="col-xs-4">
                    <Status title={resource.status || 'N/A'} status={resource.status} />
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </CardBody>
    </Card>
  );
};

const getJobsStatus = (job: K8sResourceKind): string => {
  const finished =
    job.status?.conditions?.filter(
      (condition) => condition.type == 'Complete' && condition.status == 'True',
    ).length == 1;
  const succeeded =
    job.status?.conditions?.filter(
      (condition) => condition.type == 'SuccessCriteriaMet' && condition.status == 'True',
    ).length == 1;
  if (finished) {
    if (succeeded) {
      return 'Succeeded';
    } else {
      return 'Failed';
    }
  } else {
    return 'Running';
  }
};

export default CamelAppJobs;
