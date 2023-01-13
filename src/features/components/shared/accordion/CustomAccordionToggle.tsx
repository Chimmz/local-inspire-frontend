import React, { useState } from 'react';
import { useAccordionButton } from 'react-bootstrap';
import useToggle from '../../../hooks/useToggle';

interface Props {
  eventKey: string;
  className: string;
  children: React.ReactNode;
  contentOnExpand?: React.ReactNode;
  classNameOnExpand?: string;
}

const CustomAccordionToggle = function (props: Props) {
  const { state: expanded, toggle: toggleExpanded } = useToggle(false);
  // toggleExpanded is used as an onclick callback
  const decoratedOnClick = useAccordionButton(props.eventKey, toggleExpanded);

  return (
    <button
      type="button"
      className={expanded ? props.classNameOnExpand || props.className : props.className}
      onClick={decoratedOnClick}
    >
      {expanded ? props.contentOnExpand || props.children : props.children}
    </button>
  );
};

export default CustomAccordionToggle;
