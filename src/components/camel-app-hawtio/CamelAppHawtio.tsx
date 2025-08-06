import { CamelAppKind } from '../../types';
import * as React from 'react';
import {
    RoutePage as DynamicRoutePageExtension,
    isRoutePage as isDynamicRoutePageExtension,
    useResolvedExtensions,
} from '@openshift-console/dynamic-plugin-sdk';


import { useTranslation } from 'react-i18next';
import { PageSection } from '@patternfly/react-core';

export type CamelAppHawtioProps = {
    obj: CamelAppKind;
};

const CamelAppHawtio: React.FC<CamelAppHawtioProps> = ({ obj: camelInt }) => {
    const { t } = useTranslation('plugin__camel-openshift-console-plugin');

    const dynamicExtensions = useResolvedExtensions<DynamicRoutePageExtension>(isDynamicRoutePageExtension);
    console.log(dynamicExtensions);
    const currentPluginExtensions = dynamicExtensions[0].filter(
        (extension) => extension.pluginName == 'camel-openshift-console-plugin' && extension.properties["name"] == "camelAppPage");
    console.log(currentPluginExtensions);
    currentPluginExtensions[0].properties.component.

    return (
        <PageSection>
            {t("Do the thing")}
        </PageSection>
    );
};

export default CamelAppHawtio;
