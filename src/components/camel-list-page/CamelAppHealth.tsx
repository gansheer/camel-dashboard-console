import { ColoredIconProps, GreenCheckCircleIcon, RedExclamationCircleIcon, YellowExclamationTriangleIcon } from '@openshift-console/dynamic-plugin-sdk';
import { Icon } from '@patternfly/react-core';
import { UnknownIcon } from '@patternfly/react-icons';
import * as React from 'react';
import { css } from '@patternfly/react-styles';
import { useTranslation } from 'react-i18next';

type CamelAppHealthProps = {
    health: string;
};

const CamelAppHealth: React.FC<CamelAppHealthProps> = ({ health }) => {
    const { t } = useTranslation('plugin__camel-openshift-console-plugin');

    switch (health.toLowerCase()) {
        case 'ok':
            return (
                <><GreenCheckCircleIcon title={t(health)} />&nbsp;&nbsp;{t(health)}</>
            );
        case 'warning':
            return (
                <><YellowExclamationTriangleIcon title={t(health)} />&nbsp;&nbsp;{t(health)}</>
            );
        case 'error':
            return (
                <><RedExclamationCircleIcon title={t(health)} />&nbsp;&nbsp;{t(health)}</>
            );
        default:
            return (
                <><GrayUnknownIcon title={t('Unknown')} />&nbsp;&nbsp;{t('Unknown')}</>
            );
    }

}

export const GrayUnknownIcon: React.FC<ColoredIconProps> = ({ className, title, size }) => {
    const icon = (
        <UnknownIcon
            data-test="unknown-icon"
            className={css('unknown-icon', className)}
            title={title}
        />
    );
    if (size) {
        return <Icon size={size}>{icon}</Icon>;
    }
    return icon;
};


export default CamelAppHealth;