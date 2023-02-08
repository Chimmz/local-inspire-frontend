import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  text: string;
  children: React.ReactElement;
}

const AppTooltip: React.FC<Props> = function (props) {
  return (
    <OverlayTrigger placement="top" overlay={<Tooltip id={uuidv4()}>{props.text}</Tooltip>}>
      {props.children}
    </OverlayTrigger>
  );
};

export default AppTooltip;
