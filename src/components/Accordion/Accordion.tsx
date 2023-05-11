import { cloneElement, isValidElement, useEffect, useState, Children, ReactElement, useMemo } from 'react';
import styled from 'styled-components';

import AccordionItem from './AccordionItem';
import { IAccordionItemProps, IAccordionProps } from './type';

const Accordion = ({ defaultOpenId = '1', children, className, onClick }: IAccordionProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [accordions, setAccordions] = useState<Record<string, boolean>>({});

  // Convert children into array of child
  const arrayChildren = Children.toArray(children);

  const onAccordionClick = (isOpen: boolean, id: string) => {
    const newAccordions = Object.keys(accordions).reduce<Record<string, boolean>>((acc, key) => {
      return {
        ...acc,
        [key]: key !== id ? false : !isOpen
      };
    }, {});

    setAccordions(newAccordions);
    onClick && onClick(isOpen, id);
  };

  useEffect(() => {
    if (!isMounted) {
      arrayChildren.forEach((child) => {
        // Typescript is dumb here, even if you filter at the start ts will still throw error.
        if (isValidElement(child)) {
          const {
            props: { id }
          } = child;

          if (id) {
            // Setup accordion default values
            setAccordions((prev) => ({
              ...prev,
              [id]: id === defaultOpenId
            }));
          }
        }
      });

      // We only want to setup default value before mount
      setIsMounted(true);
    }
  }, [isMounted]);

  return (
    <AccordionContainer className={className}>
      {Children.map(arrayChildren, (child) => {
        if (isValidElement(child)) {
          const {
            props: { id }
          } = child;

          if (!id) {
            return null;
          }

          return cloneElement(child as ReactElement<IAccordionItemProps>, {
            onClick: onAccordionClick,
            open: !isMounted ? id === defaultOpenId : accordions[id],
            isGroup: true
          });
        }

        return null;
      })}
    </AccordionContainer>
  );
};

Accordion.AccordionItem = AccordionItem;

export default Accordion;

const AccordionContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
