import React, { FC, ReactNode, useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import { Icon } from '..';

interface IAccordion {
  id: string;
  header: string;
  content: string;
}

interface IBadAccordionProps {
  data: IAccordion[];
  defaultOpenId?: string;
  isGroup?: boolean;
  className?: string;
  accordionItemClassName?: string;
}

const BadAccordion: FC<IBadAccordionProps> = ({
  data,
  isGroup,
  defaultOpenId = '1',
  className,
  accordionItemClassName = 'accordion-item'
}) => {
  const [accordions, setAccordions] = useState<Record<string, boolean>>({});
  const accordionContentRefs = useRef<Record<string, HTMLDivElement>>({});

  const getAccordionContentHeight = (id: string) => {
    const { scrollHeight = 0 } = accordionContentRefs.current[id] || {};
    return scrollHeight ? `${scrollHeight}px` : 'auto';
  };

  const onAccordionClick = (id: string) => {
    if (!isGroup) {
      setAccordions((prev) => ({
        ...prev,
        [id]: !prev[id]
      }));
    } else {
      const newAccordions = Object.keys(accordions).reduce<Record<string, boolean>>((acc, key) => {
        return {
          ...acc,
          [key]: key !== id ? false : !accordions[id]
        };
      }, {});

      setAccordions(newAccordions);
    }
  };

  useEffect(() => {
    const newAccordions = data.reduce<Record<string, boolean>>((acc, { id }) => {
      return {
        ...acc,
        [id]: defaultOpenId === id
      };
    }, {});

    setAccordions(newAccordions);
  }, [data]);

  return (
    <BadAccordionContainer className={className}>
      {data.map(({ header, content, id }) => {
        return (
          <BadAccordionItem className={accordionItemClassName}>
            <BadAccordionItemHeader onClick={() => onAccordionClick(id)}>
              {header}
              <BadAccordionCaretIcon $isActive={accordions[id]} icon="chevron-down" size={14} />
            </BadAccordionItemHeader>
            <BadAccordionItemBody
              ref={(element) => {
                if (element) {
                  accordionContentRefs.current[id] = element;
                }
              }}
              $height={accordions[id] ? getAccordionContentHeight(id) : ''}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </BadAccordionItem>
        );
      })}
    </BadAccordionContainer>
  );
};

export default BadAccordion;

const BadAccordionContainer = styled.div``;

const BadAccordionItem = styled.div`
  display: inline-block;
  overflow: hidden;
  border-radius: 4px;
`;

const BadAccordionItemHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;

  cursor: pointer;
  background: blue;
  color: white;
  padding: 5px 8px;
`;

const BadAccordionCaretIcon = styled(Icon)<{ $isActive: boolean }>`
  margin-left: 5px;
  transition: all 0.3s ease-in-out;
  transform: ${({ $isActive }) => $isActive && 'rotate(-180deg)'};
`;

const BadAccordionItemBody = styled.div<{ $height: string }>`
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
