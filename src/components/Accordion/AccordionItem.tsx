import React, { useRef, useState, FC, useEffect } from 'react';
import styled, { css } from 'styled-components';

import { Icon } from 'components/Icon';
import { IAccordionItemProps } from './type';

const AccordionItem: FC<IAccordionItemProps> = ({
  id,
  header,
  children,
  className,
  headerClassName = 'accordion-item-header',
  bodyClassName = 'accordion-item-body',
  iconClassName = 'accordion-item-icon',
  icon = 'chevron-down',
  open = true,
  isGroup,
  onClick
}) => {
  const [isOpen, setIsOpen] = useState(open);

  const contentHeight = useRef(0);
  const accordionItemBodyRef = useRef<HTMLDivElement>(null);

  // Find the default height of content so that we can animate
  const contentExpandHeight = contentHeight.current ? `${contentHeight.current}px` : 'auto';

  const onAccordionClick = () => {
    !isGroup && setIsOpen((prev) => !prev);
    onClick && onClick(isOpen, id);
  };

  useEffect(() => {
    // ScrollHeight -> ENTIRE content & padding (visible or not)
    const { scrollHeight = 0 } = accordionItemBodyRef.current || {};
    contentHeight.current = scrollHeight;
  }, []);

  useEffect(() => {
    // If it should function as group, then register open prop to state
    if (isGroup) {
      setIsOpen(open);
    }
  }, [open]);

  return (
    <AccordionItemContainer className={className}>
      <AccordionItemHeader className={headerClassName} onClick={onAccordionClick}>
        {header} <AccordionCaretIcon className={iconClassName} $isActive={isOpen} icon={icon} size={14} />
      </AccordionItemHeader>
      <AccordionItemBody
        ref={accordionItemBodyRef}
        className={bodyClassName}
        $height={isOpen ? contentExpandHeight : ''}
      >
        {children}
      </AccordionItemBody>
    </AccordionItemContainer>
  );
};

export default AccordionItem;

const AccordionItemContainer = styled.div`
  display: inline-block;
  overflow: hidden;
  border-radius: 4px;
`;

const AccordionItemHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;

  cursor: pointer;
  background: blue;
  color: white;
  padding: 5px 8px;
`;

const AccordionCaretIcon = styled(Icon)<{ $isActive: boolean }>`
  margin-left: 5px;
  transition: all 0.3s ease-in-out;
  transform: ${({ $isActive }) => $isActive && 'rotate(-180deg)'};
`;

const AccordionItemBody = styled.div<{ $height: string }>`
  border: 1px solid #dddddd;
  border-radius: 0 0 4px 4px;

  overflow: hidden;
  transition: max-height 0.2s ease-in-out;
  padding: 0 8px;

  ${({ $height }) =>
    $height
      ? css`
          max-height: ${$height};
          border: 1px solid #dddddd;
        `
      : css`
          max-height: 0;
          border-color: transparent;
          border-bottom: none;
        `}
`;
