import type { FC, ReactNode } from 'react';
import { Icon } from '@patternfly/react-core';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  SyncAltIcon,
  BanIcon,
  QuestionCircleIcon,
  HourglassHalfIcon,
  InProgressIcon,
} from '@patternfly/react-icons';

type StatusProps = {
  status: string;
  title?: string;
  iconOnly?: boolean;
  children?: ReactNode;
};

type StatusEntry = {
  icon: ReactNode;
  color: 'success' | 'danger' | 'warning' | 'info' | 'custom';
};

const statusMap: Record<string, StatusEntry> = {
  Running: { icon: <SyncAltIcon />, color: 'info' },
  Updating: { icon: <SyncAltIcon />, color: 'info' },
  Installing: { icon: <SyncAltIcon />, color: 'info' },
  'In Progress': { icon: <SyncAltIcon />, color: 'info' },
  Upgrading: { icon: <SyncAltIcon />, color: 'info' },

  Pending: { icon: <HourglassHalfIcon />, color: 'info' },
  pending: { icon: <HourglassHalfIcon />, color: 'info' },
  ContainerCreating: { icon: <InProgressIcon />, color: 'info' },

  Succeeded: { icon: <CheckCircleIcon />, color: 'success' },
  Ready: { icon: <CheckCircleIcon />, color: 'success' },
  Active: { icon: <CheckCircleIcon />, color: 'success' },
  Bound: { icon: <CheckCircleIcon />, color: 'success' },
  Complete: { icon: <CheckCircleIcon />, color: 'success' },
  Completed: { icon: <CheckCircleIcon />, color: 'success' },
  Connected: { icon: <CheckCircleIcon />, color: 'success' },
  Deployed: { icon: <CheckCircleIcon />, color: 'success' },

  Failed: { icon: <ExclamationCircleIcon />, color: 'danger' },
  Error: { icon: <ExclamationCircleIcon />, color: 'danger' },
  CrashLoopBackOff: { icon: <ExclamationCircleIcon />, color: 'danger' },
  ImagePullBackOff: { icon: <ExclamationCircleIcon />, color: 'danger' },
  ErrImagePull: { icon: <ExclamationCircleIcon />, color: 'danger' },

  Warning: { icon: <ExclamationTriangleIcon />, color: 'warning' },

  Terminating: { icon: <BanIcon />, color: 'custom' },
  Deleting: { icon: <BanIcon />, color: 'custom' },
  Cancelled: { icon: <BanIcon />, color: 'custom' },

  Unknown: { icon: <QuestionCircleIcon />, color: 'custom' },
};

const Status: FC<StatusProps> = ({ status, title, iconOnly, children }) => {
  const label = title || status;
  const entry = statusMap[status];

  if (!entry) {
    return <span className="co-icon-and-text">{label || '-'}</span>;
  }

  return (
    <span className="co-icon-and-text">
      <Icon status={entry.color !== 'custom' ? entry.color : undefined} isInline className="co-icon-and-text__icon co-icon-flex-child">
        {entry.icon}
      </Icon>
      {!iconOnly && <span className="co-icon-and-text__text">{label}</span>}
      {children}
    </span>
  );
};

export default Status;
