import * as React from 'react';
import { Button, Popover, PopoverPosition, PopoverProps } from '@patternfly/react-core';
import { Trans, useTranslation } from 'react-i18next';
import CamelAppHealth from '../camel-list-page/CamelAppHealth';

type PopoverCamelHealthProps = {
  popoverBody: React.ReactNode;
  onHide?: () => void;
  onShow?: () => void;
  title?: string;
  hideHeader?: boolean;
  isVisible?: boolean;
  shouldClose?: (hideFunction: any) => void;
  shouldOpen?: PopoverProps['shouldOpen'];
};

export const PopoverCamelHealth: React.FC<PopoverCamelHealthProps> = ({
  hideHeader,
  isVisible = null,
  shouldClose = null,
  shouldOpen = null,
  popoverBody,
  title,
  onHide,
  onShow,
}) => {
  const { t } = useTranslation('plugin__camel-openshift-console-plugin');
  return (
    <Popover
      position={PopoverPosition.right}
      headerContent={hideHeader ? null : title}
      bodyContent={() => (
        <div>
          <div>
            <Trans t={t}>
              <h4>Service Level Indicator</h4>
              <CamelAppHealth health="Error" />: &gt; 10 % failed exchanges
              <br />
              <CamelAppHealth health="Warning" />: &gt; 5 % failed exchanges
              <br />
              <CamelAppHealth health="OK" />: healthy
              <br />
              <CamelAppHealth health="Unknown" />: no informations
              <br />
            </Trans>
          </div>
        </div>
      )}
      aria-label={title}
      onHide={onHide}
      onShow={onShow}
      isVisible={isVisible}
      shouldClose={shouldClose}
      shouldOpen={shouldOpen}
    >
      <Button
        variant="link"
        isInline
        className="pf-v5-c-button pf-m-plain details-item__popover-button"
      >
        {popoverBody}
      </Button>
    </Popover>
  );
};
